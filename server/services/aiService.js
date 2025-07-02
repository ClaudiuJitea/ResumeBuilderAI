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
      const parsedData = JSON.parse(cleaned);
      
      // Log successful parsing with work experience count for debugging
      if (parsedData.work_experience) {
        console.log(`Successfully parsed CV data with ${parsedData.work_experience.length} work experience entries`);
      }
      
      return parsedData;
    } catch (error) {
      console.error('Failed to clean JSON response:', response.substring(0, 500) + '...');
      console.error('JSON Parse Error:', error.message);
      
      // If JSON parsing fails, try to detect if it's truncated and attempt recovery
      if (error.message.includes('Unterminated string') || error.message.includes('Unexpected end')) {
        console.log('Attempting to recover from truncated JSON...');
        try {
          // Attempt to fix truncated JSON by adding proper closing
          let recovered = response.trim()
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/, '')
            .replace(/\s*```$/i, '');
          
          // More sophisticated recovery logic
          console.log('Original response length:', response.length);
          
          // Try to find the last complete work experience entry
          let workExpMatch = recovered.match(/"work_experience"\s*:\s*\[(.*)/s);
          if (workExpMatch) {
            console.log('Found work_experience section, attempting to recover...');
            
            // Count complete work experience objects
            let workExpSection = workExpMatch[1];
            let completeEntries = [];
            let depth = 0;
            let currentEntry = '';
            let inString = false;
            let escapeNext = false;
            
            for (let i = 0; i < workExpSection.length; i++) {
              let char = workExpSection[i];
              
              if (escapeNext) {
                escapeNext = false;
                currentEntry += char;
                continue;
              }
              
              if (char === '\\') {
                escapeNext = true;
                currentEntry += char;
                continue;
              }
              
              if (char === '"' && !escapeNext) {
                inString = !inString;
              }
              
              if (!inString) {
                if (char === '{') {
                  depth++;
                } else if (char === '}') {
                  depth--;
                  if (depth === 0) {
                    // Complete work experience entry found
                    currentEntry += char;
                    completeEntries.push(currentEntry.trim());
                    currentEntry = '';
                    continue;
                  }
                }
              }
              
              if (depth > 0) {
                currentEntry += char;
              } else if (char === ']') {
                // End of work_experience array
                break;
              }
            }
            
            console.log(`Recovered ${completeEntries.length} complete work experience entries`);
            
            if (completeEntries.length > 0) {
              // Try to construct a minimal valid JSON with recovered work experiences
              let recoveredJson = `{
                "personal_information": {"name": "", "email": "", "phone": "", "location": "", "position": ""},
                "work_experience": [${completeEntries.join(', ')}],
                "education": [],
                "skills": [],
                "languages": [],
                "projects": [],
                "certifications": [],
                "achievements": []
              }`;
              
              try {
                const recoveredData = JSON.parse(recoveredJson);
                console.log(`Successfully recovered ${recoveredData.work_experience.length} work experiences`);
                return recoveredData;
              } catch (recoveredError) {
                console.error('Failed to parse recovered JSON:', recoveredError.message);
              }
            }
          }
          
          // Try to recover certifications as well
          let certsMatch = recovered.match(/"certifications"\s*:\s*\[(.*)/s);
          if (certsMatch) {
            console.log('Found certifications section, attempting to recover...');
            
            let certsSection = certsMatch[1];
            let completeCerts = [];
            let depth = 0;
            let currentCert = '';
            let inString = false;
            let escapeNext = false;
            
            for (let i = 0; i < certsSection.length; i++) {
              let char = certsSection[i];
              
              if (escapeNext) {
                escapeNext = false;
                currentCert += char;
                continue;
              }
              
              if (char === '\\') {
                escapeNext = true;
                currentCert += char;
                continue;
              }
              
              if (char === '"' && !escapeNext) {
                inString = !inString;
              }
              
              if (!inString) {
                if (char === '{') {
                  depth++;
                } else if (char === '}') {
                  depth--;
                  if (depth === 0) {
                    // Complete certification entry found
                    currentCert += char;
                    completeCerts.push(currentCert.trim());
                    currentCert = '';
                    continue;
                  }
                }
              }
              
              if (depth > 0) {
                currentCert += char;
              } else if (char === ']') {
                // End of certifications array
                break;
              }
            }
            
            console.log(`Recovered ${completeCerts.length} complete certification entries`);
            
            if (completeCerts.length > 0) {
              // Try to construct a minimal valid JSON with recovered certifications
              let recoveredJson = `{
                "personal_information": {"name": "", "email": "", "phone": "", "location": "", "position": ""},
                "work_experience": [],
                "education": [],
                "skills": [],
                "languages": [],
                "projects": [],
                "certifications": [${completeCerts.join(', ')}],
                "achievements": []
              }`;
              
              try {
                const recoveredData = JSON.parse(recoveredJson);
                console.log(`Successfully recovered ${recoveredData.certifications.length} certifications`);
                return recoveredData;
              } catch (recoveredError) {
                console.error('Failed to parse recovered certifications JSON:', recoveredError.message);
              }
            }
          }
          
          // Try to recover skills as well
          let skillsMatch = recovered.match(/"skills"\s*:\s*\[(.*)/s);
          if (skillsMatch) {
            console.log('Found skills section, attempting to recover...');
            
            let skillsSection = skillsMatch[1];
            let completeSkills = [];
            let currentSkill = '';
            let inString = false;
            let escapeNext = false;
            
            for (let i = 0; i < skillsSection.length; i++) {
              let char = skillsSection[i];
              
              if (escapeNext) {
                escapeNext = false;
                currentSkill += char;
                continue;
              }
              
              if (char === '\\') {
                escapeNext = true;
                currentSkill += char;
                continue;
              }
              
              if (char === '"' && !escapeNext) {
                inString = !inString;
                if (!inString && currentSkill.trim()) {
                  // End of string, we have a complete skill
                  completeSkills.push(`"${currentSkill.trim()}"`);
                  currentSkill = '';
                }
              } else if (inString) {
                currentSkill += char;
              } else if (char === ']') {
                // End of skills array
                break;
              }
            }
            
            console.log(`Recovered ${completeSkills.length} complete skill entries`);
            
            if (completeSkills.length > 0) {
              // Try to construct a minimal valid JSON with recovered skills
              let recoveredJson = `{
                "personal_information": {"name": "", "email": "", "phone": "", "location": "", "position": ""},
                "work_experience": [],
                "education": [],
                "skills": [${completeSkills.join(', ')}],
                "languages": [],
                "projects": [],
                "certifications": [],
                "achievements": []
              }`;
              
              try {
                const recoveredData = JSON.parse(recoveredJson);
                console.log(`Successfully recovered ${recoveredData.skills.length} skills`);
                return recoveredData;
              } catch (recoveredError) {
                console.error('Failed to parse recovered skills JSON:', recoveredError.message);
              }
            }
          }
          
          // Fallback to original recovery logic
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
          
          console.log('Attempting to parse auto-recovered JSON...');
          const autoRecovered = JSON.parse(recovered);
          console.log(`Auto-recovery successful with ${autoRecovered.work_experience?.length || 0} work experiences`);
          return autoRecovered;
          
        } catch (recoveryError) {
          console.error('Recovery attempt failed:', recoveryError.message);
          
          // Final fallback: return a basic structure with error info
          return {
            personal_information: {
              name: "Extraction Failed - Please try again",
              email: "",
              phone: "",
              location: "",
              position: ""
            },
            work_experience: [],
            education: [],
            skills: [],
            languages: [],
            projects: [],
            certifications: [],
            achievements: [],
            error: "CV parsing was incomplete due to response length limits. The AI response was truncated. Please try again or contact administrator."
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
        content: `You are a CV data extraction assistant. Extract ALL structured information from CV text and return it in JSON format.

CRITICAL: You MUST extract ALL sections found in the CV, with SPECIAL PRIORITY on skills extraction. Do not skip or omit any entries, especially skills.

Extract the following sections comprehensively IN THIS ORDER OF IMPORTANCE:
1. skills: Array of ALL skills (HIGHEST PRIORITY - scan entire document for technical and soft skills)
2. work_experience: Array of ALL work experiences {company, position, start_date, end_date, duration, description}
3. certifications: Array of ALL certifications, certificates, professional licenses, and courses
4. personal_information: {name, email, phone, location, position}
5. education: Array of ALL education entries {school, degree, start_date, end_date, description}  
6. languages: Array of ALL languages {language, proficiency}
7. projects: Array of ALL projects {name, description, technologies}
8. achievements: Array of ALL achievements, awards, and recognitions

SKILLS EXTRACTION RULES:
1. Look for sections named: "Skills", "Technical Skills", "Core Competencies", "Expertise", "Technologies", "Tools", "Software", "Programming Languages"
2. Extract both technical skills AND soft skills
3. Look for skills mentioned throughout the document, not just in dedicated sections
4. Include programming languages, frameworks, tools, methodologies, soft skills
5. Format as array of strings or objects with skill name and optional level

SPECIAL HANDLING FOR PARAGRAPH-FORMAT SKILLS:
- Skills may be written in paragraph format with categories like "Virtualization:", "Networking:", "Systems Administration:"
- Extract individual skills from descriptive text (e.g., "familiar with VMware vSphere (from version 5.5 up to 6.7)" → extract "VMware vSphere")
- Look for technology names, software names, protocols, and methodologies within descriptions
- Parse skills from phrases like "familiar with", "experience with", "knowledge of", "proficient in"
- Extract skills from technical acronyms and technologies mentioned (e.g., VTP, STP, LACP, VRRP, CIDR, DHCP, DNS, TCP/UDP)

SKILLS PARSING EXAMPLES:
- "VMware vSphere (from version 5.5 up to 6.7)" → "VMware vSphere"
- "firewalls, Routing, Switching, NAT, DHCP, DNS" → ["Firewalls", "Routing", "Switching", "NAT", "DHCP", "DNS"]
- "familiar with Windows Server 2016 & 2019" → "Windows Server"
- "PowerShell, Python" → ["PowerShell", "Python"]

CERTIFICATION EXTRACTION RULES:
1. Look for sections named: "Certifications", "Certificates", "Professional Certifications", "Licenses", "Courses", "Training", "Professional Development"
2. Extract certification name, issuing organization, date obtained, expiry date if available
3. Include both completed certifications AND completed courses/training
4. Format: {name, issuer, date_obtained, expiry_date, description}

IMPORTANT INSTRUCTIONS:
1. Extract EVERY work experience entry - do not limit the number
2. Extract EVERY certification, course, and training mentioned
3. Extract EVERY skill mentioned - scan the entire document for skills
4. For work experience descriptions, keep them detailed enough to be useful but not excessively long (2-3 sentences max per role)
5. Use consistent date formats (MM/YYYY or Month YYYY)
6. If dates show "Present", "Current", or similar, use those exact terms
7. Extract ALL skills mentioned, grouped appropriately
8. Be thorough - scan the entire document for all relevant information
9. Return ONLY valid JSON with the extracted data, no markdown formatting or additional text

Example certifications format:
[
  {
    "name": "CCNA Routing and Switching",
    "issuer": "Cisco",
    "date_obtained": "2021",
    "expiry_date": "",
    "description": "Cisco Certified Network Associate certification"
  },
  {
    "name": "VMware vSphere: Install, Configure, Manage",
    "issuer": "VMware",
    "date_obtained": "2020",
    "expiry_date": "",
    "description": "Professional course completion"
  }
]

Example skills format:
["JavaScript", "Python", "Network Administration", "VMware vSphere", "CCNA", "Project Management", "Team Leadership"]

COMPREHENSIVE SKILLS EXTRACTION EXAMPLE:
Input text: "Virtualization: - VMware vSphere (from version 5.5 up to 6.7) - Docker Containers (testing and playing) Networking: - firewalls, Routing, Switching, NAT, DHCP, DNS, TCP/UDP, load balancing - familiar with VTP, STP, LACP, VRRP, CIDR, and HA firewall config Systems Administration: - familiar with Windows Server 2016 & 2019 (Active Directory, DHCP Server, DNS Server, File and Storage Services, Remote Access) - familiar with Ubuntu Server 12+, CentOS 6+ General scripting knowledge: PowerShell, Python"

Expected output: ["VMware vSphere", "Docker Containers", "Firewalls", "Routing", "Switching", "NAT", "DHCP", "DNS", "TCP/UDP", "Load Balancing", "VTP", "STP", "LACP", "VRRP", "CIDR", "HA Firewall Configuration", "Windows Server", "Active Directory", "DHCP Server", "DNS Server", "File and Storage Services", "Remote Access", "Ubuntu Server", "CentOS", "PowerShell", "Python"]`
      },
      {
        role: 'user',
        content: `Extract ALL data from this CV. Pay special attention to skills throughout the document, certifications, courses, and training sections. Ensure you capture EVERY work experience, education entry, skill, and certification mentioned:\n\n${cvText}`
      }
    ];

    // Significantly increase token limit to handle up to 10 PDF pages
    const response = await this.makeRequest(messages, null, 10000);
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

  async generateCombinedCVProfile(targetRole, extractedCVDataArray) {
    const cvDataSummary = extractedCVDataArray.map((cvData, index) => 
      `CV ${index + 1}:\n${JSON.stringify(cvData, null, 2)}`
    ).join('\n\n');

    const messages = [
      {
        role: 'system',
        content: `You are a professional CV analysis and combination assistant. You will analyze multiple CVs and create a comprehensive profile optimized for a specific target role.

        Your task:
        1. Analyze all provided CVs and extract the best information from each
        2. Combine and optimize the information for the target role: "${targetRole}"
        3. Remove duplicates and consolidate similar experiences
        4. Enhance descriptions to align with the target role
        5. Prioritize the most relevant experiences and skills

        Return a JSON object with these sections:
        - personal_information (best contact info and professional title optimized for target role)
        - work_experience (combined and optimized, most relevant first)
        - education (all education, most relevant first)
        - skills (comprehensive list, grouped by relevance to target role)
        - projects (best projects that showcase relevant skills)
        - certifications (all relevant certifications)
        - achievements (most impressive achievements)
        - languages (all languages with highest proficiency levels)

        Focus on quality over quantity and relevance to the target role.`
      },
      {
        role: 'user',
        content: `Target role: ${targetRole}\n\nCVs to analyze and combine:\n\n${cvDataSummary}`
      }
    ];

    const response = await this.makeRequest(messages, null, 3000);
    return this.cleanJsonResponse(response);
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

  async suggestSkillsBasedOnProfile(workExperience, position, education) {
    // Build context from user's profile
    let context = '';
    
    if (position) {
      context += `Target Position: ${position}\n`;
    }
    
    if (workExperience && workExperience.length > 0) {
      context += `Work Experience:\n`;
      workExperience.forEach((exp, index) => {
        context += `${index + 1}. ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate})\n`;
        if (exp.description) {
          context += `   Description: ${exp.description.substring(0, 200)}...\n`;
        }
      });
    }
    
    if (education && education.length > 0) {
      context += `Education:\n`;
      education.forEach((edu, index) => {
        context += `${index + 1}. ${edu.degree} from ${edu.school}\n`;
      });
    }

    const messages = [
      {
        role: 'system',
        content: `You are a professional career advisor and resume expert. Based on the provided work experience, position, and education, suggest 6 relevant professional skills that would be valuable for this person's career.

INSTRUCTIONS:
1. Suggest exactly 6 skills
2. Mix of technical and soft skills appropriate for their field
3. Focus on skills that are:
   - Relevant to their work experience and target position
   - Currently in-demand in their industry
   - Realistic for their experience level
4. Return ONLY a JSON array of skill names (strings)
5. No additional text or explanations

Example response format:
["JavaScript", "Project Management", "Team Leadership", "SQL", "Problem Solving", "Agile Methodology"]`
      },
      {
        role: 'user',
        content: `Based on this professional profile, suggest 6 relevant skills:\n\n${context}`
      }
    ];

    const response = await this.makeRequest(messages, null, 1500);
    try {
      // Clean and parse the response
      let cleaned = response.trim();
      cleaned = cleaned.replace(/^```json\s*/i, '');
      cleaned = cleaned.replace(/^```\s*/, '');
      cleaned = cleaned.replace(/\s*```$/i, '');
      
      const suggestedSkills = JSON.parse(cleaned);
      
      if (Array.isArray(suggestedSkills) && suggestedSkills.length === 6) {
        return suggestedSkills;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error parsing suggested skills:', error);
      // Fallback suggestions based on common professional skills
      return [
        "Communication",
        "Problem Solving", 
        "Team Collaboration",
        "Project Management",
        "Time Management",
        "Analytical Thinking"
      ];
    }
  }

  async extractSkillsOnly(cvText) {
    const messages = [
      {
        role: 'system',
        content: `You are a skills extraction specialist. Your ONLY job is to find and extract ALL skills from CV text.

CRITICAL MISSION: Extract every single skill mentioned in the document.

SKILLS EXTRACTION STRATEGY:
1. Scan the ENTIRE document for skills - not just skills sections
2. Look for sections: "Skills", "Technical Skills", "Core Competencies", "Expertise", "Technologies", "Tools", "Software"
3. Extract skills from work experience descriptions
4. Parse paragraph-format skills with categories like "Virtualization:", "Networking:", "Systems Administration:"

SPECIAL HANDLING FOR PARAGRAPH-FORMAT SKILLS:
- Extract individual skills from descriptive text
- Parse skills from phrases like "familiar with", "experience with", "knowledge of", "proficient in"  
- Extract technology names, software names, protocols, methodologies
- Handle technical acronyms (VTP, STP, LACP, VRRP, CIDR, DHCP, DNS, TCP/UDP)

PARSING EXAMPLES:
- "VMware vSphere (from version 5.5 up to 6.7)" → "VMware vSphere"
- "firewalls, Routing, Switching, NAT, DHCP, DNS" → ["Firewalls", "Routing", "Switching", "NAT", "DHCP", "DNS"]
- "familiar with Windows Server 2016 & 2019" → "Windows Server"
- "PowerShell, Python" → ["PowerShell", "Python"]

Return ONLY a JSON array of skill names (strings). No other text.
Example: ["VMware vSphere", "Docker", "Networking", "PowerShell", "Python", "Windows Server"]`
      },
      {
        role: 'user',
        content: `Extract ALL skills from this CV text. Be thorough and don't miss any:\n\n${cvText}`
      }
    ];

    try {
      const response = await this.makeRequest(messages, null, 3000);
      
      // Clean and parse the response
      let cleaned = response.trim();
      cleaned = cleaned.replace(/^```json\s*/i, '');
      cleaned = cleaned.replace(/^```\s*/, '');
      cleaned = cleaned.replace(/\s*```$/i, '');
      
      const skills = JSON.parse(cleaned);
      
      if (Array.isArray(skills)) {
        console.log(`Skills-only extraction found ${skills.length} skills:`, skills);
        return skills;
      } else {
        throw new Error('Invalid skills response format');
      }
    } catch (error) {
      console.error('Skills-only extraction failed:', error);
      return [];
    }
  }

  async groupAndCategorizeSkills(skillsList) {
    if (!skillsList || !Array.isArray(skillsList) || skillsList.length === 0) {
      return [];
    }

    const messages = [
      {
        role: 'system',
        content: `You are an expert IT resume skills organizer. Your job is to intelligently categorize technical skills into granular, professional categories. 

CRITICAL REQUIREMENTS:
1. Create 6-8 GRANULAR, SPECIFIC categories (MANDATORY: minimum 6, maximum 8 categories)
2. Skills can appear in MULTIPLE relevant categories when appropriate
3. Focus on technical domains and expertise areas
4. Use professional category names that showcase expertise depth
5. ALWAYS create at least 6 categories even if you need to split broader categories into more specific ones

PREFERRED SKILL CATEGORIES (create as many as relevant, up to 8):
- "Networking" - TCP/IP, Routing, Switching, VLANs, Firewalls, VPN, DNS, DHCP, NAT, Network Protocols
- "System Administration" - Windows Server, Linux, Active Directory, Group Policy, PowerShell, Scripting, Server Management
- "Virtualization" - VMware vSphere, ESXi, Hyper-V, Virtual Machines, vCenter, Docker, Containers
- "Cloud Technologies" - AWS, Azure, Google Cloud, Cloud Computing, SaaS, IaaS, PaaS
- "Security" - Cybersecurity, Information Security, Network Security, Penetration Testing, Risk Assessment
- "Database Management" - SQL, MySQL, PostgreSQL, Database Administration, Data Management
- "Programming & Scripting" - Python, PowerShell, JavaScript, Automation, Scripting Languages
- "Storage & Backup" - SAN, NAS, Backup Solutions, Data Storage, Disaster Recovery

CROSS-CATEGORIZATION RULES:
- "Active Directory" can be in both "System Administration" AND "Security"
- "Firewalls" can be in both "Networking" AND "Security" 
- "PowerShell" can be in both "System Administration" AND "Programming & Scripting"
- "VMware NSX" can be in both "Virtualization" AND "Networking"
- "Windows Server" can be in both "System Administration" AND "Virtualization"

ADVANCED TECHNICAL SKILLS IDENTIFICATION:
- Recognize vendor-specific technologies (Cisco, VMware, Microsoft, Nutanix, etc.)
- Identify protocols and standards (OSPF, BGP, SNMP, LDAP, Kerberos, etc.)
- Categorize certification-related skills appropriately
- Group related technologies logically

FORMAT: Return a JSON array where skills can appear multiple times with different categories:
[
  {"name": "Active Directory", "category": "System Administration"},
  {"name": "Active Directory", "category": "Security"},
  {"name": "VMware vSphere", "category": "Virtualization"},
  {"name": "Firewalls", "category": "Networking"},
  {"name": "Firewalls", "category": "Security"},
  {"name": "PowerShell", "category": "System Administration"},
  {"name": "PowerShell", "category": "Programming & Scripting"}
]

IMPORTANT: 
- Create EXACTLY 6-8 relevant categories based on the skills provided (MANDATORY)
- If you have fewer than 6 natural categories, split broader categories into more specific ones
- Allow logical cross-categorization when skills fit multiple domains
- Use specific, professional category names
- Maximum 12 skills per category to keep it manageable
- Prioritize the most relevant categorizations if a skill could fit in many categories
- EVERY skill must be categorized - do not leave any skill uncategorized`
      },
      {
        role: 'user',
        content: `Organize these technical skills into granular professional categories with cross-categorization where appropriate:\n\n${JSON.stringify(skillsList)}`
      }
    ];

    try {
      const response = await this.makeRequest(messages, null, 3000);
      
      // Clean and parse the response
      let cleaned = response.trim();
      cleaned = cleaned.replace(/^```json\s*/i, '');
      cleaned = cleaned.replace(/^```\s*/, '');
      cleaned = cleaned.replace(/\s*```$/i, '');
      
      const categorizedSkills = JSON.parse(cleaned);
      
      if (Array.isArray(categorizedSkills)) {
        console.log(`AI successfully categorized ${categorizedSkills.length} skill entries (with cross-categorization)`);
        
        // Log categories for debugging
        const categories = [...new Set(categorizedSkills.map(skill => skill.category))];
        console.log(`Created ${categories.length} skill categories:`, categories);
        
        // Validate we have 6-8 categories as requested
        if (categories.length < 6) {
          console.warn(`WARNING: Only ${categories.length} categories created, expected 6-8. Categories:`, categories);
        } else if (categories.length > 8) {
          console.warn(`WARNING: ${categories.length} categories created, expected max 8. Categories:`, categories);
        } else {
          console.log(`✓ Perfect! Created ${categories.length} categories as requested.`);
        }
        
        categories.forEach(category => {
          const skillsInCategory = categorizedSkills.filter(skill => skill.category === category);
          const uniqueSkills = [...new Set(skillsInCategory.map(s => s.name))];
          console.log(`${category} (${uniqueSkills.length} unique skills): ${uniqueSkills.slice(0, 5).join(', ')}${uniqueSkills.length > 5 ? '...' : ''}`);
        });
        
        return categorizedSkills;
      } else {
        throw new Error('Invalid categorized skills response format');
      }
    } catch (error) {
      console.error('Skills categorization failed:', error);
      // Fallback: return skills without categories
      return skillsList.map(skill => ({
        name: typeof skill === 'string' ? skill : skill.name,
        category: 'Technical Skills'
      }));
    }
  }
}

module.exports = AIService; 