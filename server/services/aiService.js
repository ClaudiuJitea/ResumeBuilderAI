const fetch = require('node-fetch');
const database = require('../database');

class AIService {
  constructor() {
    this.baseURL = 'https://openrouter.ai/api/v1';
  }

  // Helper function to clean markdown formatting and extract JSON
  cleanJsonResponse(response) {
    try {
      // Remove markdown code blocks and extra whitespace
      let cleaned = response.trim();
      
      // Remove ```json and ``` markers
      cleaned = cleaned.replace(/^```json\s*/i, '');
      cleaned = cleaned.replace(/^```\s*/, ''); // Also handle just ```
      cleaned = cleaned.replace(/\s*```$/i, '');
      
      // Try to parse the cleaned response
      return JSON.parse(cleaned);
    } catch (error) {
      console.error('Failed to clean JSON response:', response);
      
      // If JSON parsing fails, try to detect if it's truncated and attempt recovery
      if (error.message.includes('Unterminated string') || error.message.includes('Unexpected end')) {
        console.log('Attempting to recover from truncated JSON...');
        try {
          // Attempt to fix truncated JSON by adding proper closing
          let recovered = response.trim()
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/, '')
            .replace(/\s*```$/i, '');
          
          // Count open braces and brackets to determine where JSON was cut off
          let openBraces = (recovered.match(/\{/g) || []).length;
          let closeBraces = (recovered.match(/\}/g) || []).length;
          let openBrackets = (recovered.match(/\[/g) || []).length;
          let closeBrackets = (recovered.match(/\]/g) || []).length;
          
          // Check if we're inside a string (last character before truncation)
          if (recovered.slice(-1).match(/[^",\}\]]/)) {
            // We're in the middle of a string value, close it
            recovered += '"';
          }
          
          // Close any unclosed arrays
          for (let i = 0; i < (openBrackets - closeBrackets); i++) {
            recovered += ']';
          }
          
          // Close any unclosed objects
          for (let i = 0; i < (openBraces - closeBraces); i++) {
            recovered += '}';
          }
          
          console.log('Attempting to parse recovered JSON...');
          return JSON.parse(recovered);
          
        } catch (recoveryError) {
          console.error('Recovery attempt failed:', recoveryError.message);
          
          // Final fallback: return a basic structure with error info
          return {
            personal_information: {
              name: "Extraction Failed",
              email: "",
              phone: "",
              location: "",
              position: ""
            },
            work_experience: [],
            education: [],
            skills: [],
            error: "CV parsing was incomplete due to response length limits. Please try with a shorter CV or contact administrator."
          };
        }
      }
      
      throw new Error(`Invalid JSON response from AI: ${error.message}`);
    }
  }

  async getApiKeyAndModel() {
    const apiKeyRecord = database.apiKeyOperations.getApiKey.get('openrouter');
    if (!apiKeyRecord) {
      throw new Error('OpenRouter API key not configured');
    }
    return {
      apiKey: apiKeyRecord.apiKey,
      model: apiKeyRecord.selectedModel || 'anthropic/claude-3.5-sonnet'
    };
  }

  async makeRequest(messages, customModel = null, customMaxTokens = null) {
    const { apiKey, model } = await this.getApiKeyAndModel();
    const selectedModel = customModel || model;
    const maxTokens = customMaxTokens || 1000;
    
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3001',
        'X-Title': 'ResumeAI Assistant'
      },
      body: JSON.stringify({
        model: selectedModel,
        messages,
        temperature: 0.7,
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async extractDataFromCV(cvText) {
    const messages = [
      {
        role: 'system',
        content: `You are a CV data extraction assistant. Extract structured information from CV text and return it in JSON format. Extract:
        - Personal information (name, email, phone, location, position)
        - Work experience (company, position, dates, description - keep descriptions concise)
        - Education (school, degree, dates, description)
        - Skills (technical and soft skills)
        - Languages (language and proficiency level)
        - Projects (name, description, technologies)
        - Certifications
        - Achievements
        
        IMPORTANT: Keep descriptions concise to fit within token limits. Return ONLY valid JSON with the extracted data, no additional text or markdown formatting.`
      },
      {
        role: 'user',
        content: `Extract data from this CV:\n\n${cvText}`
      }
    ];

    // Use higher token limit for CV parsing since it needs to extract a lot of data
    const response = await this.makeRequest(messages, null, 2500);
    return this.cleanJsonResponse(response);
  }

  async suggestContent(section, context = '') {
    const suggestions = {
      personalInfo: 'Suggest professional position titles based on the provided context.',
      aboutMe: 'Write a compelling professional summary that highlights key strengths and career goals.',
      workExperience: 'Suggest professional accomplishments and responsibilities for this role.',
      education: 'Suggest relevant coursework, projects, or achievements for this educational background.',
      skills: 'Suggest relevant technical and soft skills for this profession.',
      projects: 'Suggest project descriptions that highlight technical skills and impact.',
      achievements: 'Suggest professional achievements and recognition.',
      interests: 'Suggest professional interests that complement career goals.'
    };

    const messages = [
      {
        role: 'system',
        content: `You are a professional resume writing assistant. Provide 3-5 specific, actionable suggestions for the ${section} section of a resume. Keep suggestions concise and professional.`
      },
      {
        role: 'user',
        content: `${suggestions[section] || 'Provide suggestions for this resume section.'}\n\nContext: ${context}`
      }
    ];

    return await this.makeRequest(messages);
  }

  async rephraseContent(originalText, style = 'professional') {
    const stylePrompts = {
      professional: 'Rephrase this text to be more professional and impactful for a resume',
      concise: 'Rephrase this text to be more concise while maintaining all key information',
      detailed: 'Rephrase this text to be more detailed and comprehensive',
      actionOriented: 'Rephrase this text to emphasize actions and achievements using strong action verbs'
    };

    const messages = [
      {
        role: 'system',
        content: `You are a professional resume writing assistant. ${stylePrompts[style] || stylePrompts.professional}. Maintain the factual content while improving the presentation.`
      },
      {
        role: 'user',
        content: `Rephrase this text: "${originalText}"`
      }
    ];

    return await this.makeRequest(messages);
  }

  async improveSection(sectionType, sectionData) {
    const messages = [
      {
        role: 'system',
        content: `You are a professional resume writing assistant. Analyze and improve the ${sectionType} section. Provide specific suggestions for improvement, focusing on impact, clarity, and professional presentation. Return suggestions in a structured format.`
      },
      {
        role: 'user',
        content: `Improve this ${sectionType} section:\n\n${JSON.stringify(sectionData, null, 2)}`
      }
    ];

    return await this.makeRequest(messages);
  }

  async generateJobTailoredSuggestions(jobDescription, resumeData) {
    const messages = [
      {
        role: 'system',
        content: `You are a resume optimization assistant. Analyze the job description and current resume data to provide tailored suggestions for improving the resume to better match the job requirements. Focus on skills, keywords, and experience alignment.`
      },
      {
        role: 'user',
        content: `Job Description:\n${jobDescription}\n\nCurrent Resume Data:\n${JSON.stringify(resumeData, null, 2)}\n\nProvide specific suggestions for optimizing this resume for this job.`
      }
    ];

    return await this.makeRequest(messages);
  }
}

module.exports = new AIService(); 