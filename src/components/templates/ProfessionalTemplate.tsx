import React from 'react';
import { Phone, Mail, MapPin, Calendar, User, Briefcase, GraduationCap, Award } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

interface ProfessionalTemplateProps {
  fontSize?: number;
}

const ProfessionalTemplate: React.FC<ProfessionalTemplateProps> = ({ fontSize = 100 }) => {
  const { state } = useResume();
  const { personalInfo, workExperience, education, skills, skillsConfig } = state.resumeData;
  const colorTheme = state.resumeData.colorTheme;

  const scaleFactor = fontSize / 100;

  // Dynamic color styles
  const primaryColor = colorTheme?.primary || '#14B8A6';
  const secondaryColor = colorTheme?.secondary || '#0F766E';
  const accentColor = colorTheme?.accent || '#5EEAD4';

  const renderSkillLevel = (level: number, skillStyle: string) => {
    const style = skillStyle || 'dots';
    switch (style) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((dot) => (
              <div
                key={dot}
                className={`rounded-full`}
                style={{ 
                  width: `${Math.max(6, 8 * scaleFactor)}px`, 
                  height: `${Math.max(6, 8 * scaleFactor)}px`,
                  backgroundColor: dot <= level ? primaryColor : '#D1D5DB'
                }}
              />
            ))}
          </div>
        );
      case 'bars':
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((bar) => (
              <div
                key={bar}
                className={`rounded-sm`}
                style={{ 
                  width: `${Math.max(4, 6 * scaleFactor)}px`, 
                  height: `${Math.max(8, 16 * scaleFactor)}px`,
                  backgroundColor: bar <= level ? primaryColor : '#D1D5DB'
                }}
              />
            ))}
          </div>
        );
      case 'pills':
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((pill) => (
              <div
                key={pill}
                className={`rounded-full`}
                style={{ 
                  width: `${Math.max(8, 12 * scaleFactor)}px`, 
                  height: `${Math.max(4, 6 * scaleFactor)}px`,
                  backgroundColor: pill <= level ? primaryColor : '#D1D5DB'
                }}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="bg-white w-full h-full shadow-2xl overflow-hidden"
      style={{ 
        width: '210mm', 
        height: '297mm',
        fontSize: `${Math.max(8, 14 * scaleFactor)}px`
      }}
    >
      {/* Header Section */}
      <div className="bg-white" style={{ padding: `${32 * scaleFactor}px` }}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 
              className="font-black text-gray-900 tracking-wider mb-2"
              style={{ fontSize: `${Math.max(16, 36 * scaleFactor)}px` }}
            >
              {personalInfo.firstName.toUpperCase()} {personalInfo.lastName.toUpperCase()}
            </h1>
            <p 
              className="text-gray-600 font-medium tracking-wide"
              style={{ fontSize: `${Math.max(10, 18 * scaleFactor)}px` }}
            >
              {personalInfo.position?.toUpperCase() || 'JOB TITLE HERE'}
            </p>
          </div>
          
          {/* Profile Photo */}
          <div 
            className="rounded-full overflow-hidden border-4 shadow-lg ml-8"
            style={{ 
              width: `${120 * scaleFactor}px`, 
              height: `${120 * scaleFactor}px`,
              borderColor: primaryColor
            }}
          >
            {personalInfo.photo ? (
              <img 
                src={personalInfo.photo} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <User className="text-gray-400" style={{ width: `${60 * scaleFactor}px`, height: `${60 * scaleFactor}px` }} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Content */}
        <div className="w-2/3 bg-white" style={{ padding: `0 ${32 * scaleFactor}px ${32 * scaleFactor}px` }}>
          {/* Profile Section */}
          <div style={{ marginBottom: `${32 * scaleFactor}px` }}>
            <div 
              className="text-white font-bold tracking-wider inline-block"
              style={{ 
                padding: `${8 * scaleFactor}px ${24 * scaleFactor}px`,
                fontSize: `${Math.max(10, 16 * scaleFactor)}px`,
                marginBottom: `${16 * scaleFactor}px`,
                backgroundColor: primaryColor
              }}
            >
              PROFILE
            </div>
            <p 
              className="text-gray-700 leading-relaxed"
              style={{ 
                fontSize: `${Math.max(8, 12 * scaleFactor)}px`,
                lineHeight: `${Math.max(12, 18 * scaleFactor)}px`,
                whiteSpace: 'pre-line'
              }}
            >
              {state.resumeData.aboutMe || 
              "Use this section of job profile or summary to demonstrate your level experience, key skills, achievements and qualities can support the companies to accomplish their goals. Resume summary enables you to showcase your strongest qualities upfront. You can mention your achievement figures or number here to prove yourself. Keep this summary section concise and to the point as this will be the first impression of you resume."
              }
            </p>
          </div>

          {/* Work Experience Section */}
          <div style={{ marginBottom: `${32 * scaleFactor}px` }}>
            <h2 
              className="font-bold text-gray-900 tracking-wider border-b-2 border-gray-300 pb-2"
              style={{ 
                fontSize: `${Math.max(12, 20 * scaleFactor)}px`,
                marginBottom: `${24 * scaleFactor}px`
              }}
            >
              WORK EXPERIENCE
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${32 * scaleFactor}px` }}>
              {workExperience.length > 0 ? (
                workExperience.map((exp, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-start">
                      <div 
                        className="flex flex-col items-center mr-6"
                        style={{ width: `${60 * scaleFactor}px` }}
                      >
                        <div 
                          className="text-gray-600 font-bold text-center"
                          style={{ 
                            fontSize: `${Math.max(8, 14 * scaleFactor)}px`,
                            lineHeight: `${Math.max(10, 16 * scaleFactor)}px`
                          }}
                        >
                          {exp.startDate.split(' ')[0]}<br />
                          {exp.current ? new Date().getFullYear() : exp.endDate.split(' ')[0]}
                        </div>
                        <div 
                          className="rounded-full mt-2"
                          style={{ 
                            width: `${12 * scaleFactor}px`, 
                            height: `${12 * scaleFactor}px`,
                            backgroundColor: primaryColor
                          }}
                        ></div>
                        {index < workExperience.length - 1 && (
                          <div 
                            className="bg-gray-300 mt-2"
                            style={{ 
                              width: `${2 * scaleFactor}px`, 
                              height: `${80 * scaleFactor}px`
                            }}
                          ></div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 
                          className="font-bold text-gray-900"
                          style={{ 
                            fontSize: `${Math.max(10, 16 * scaleFactor)}px`,
                            marginBottom: `${4 * scaleFactor}px`
                          }}
                        >
                          {exp.position.toUpperCase()}
                        </h3>
                        <p 
                          className="text-gray-600 font-medium"
                          style={{ 
                            fontSize: `${Math.max(8, 14 * scaleFactor)}px`,
                            marginBottom: `${12 * scaleFactor}px`
                          }}
                        >
                          {exp.company}
                        </p>
                        <p 
                          className="text-gray-700 leading-relaxed"
                          style={{ 
                            fontSize: `${Math.max(8, 12 * scaleFactor)}px`,
                            lineHeight: `${Math.max(12, 18 * scaleFactor)}px`,
                            marginBottom: `${8 * scaleFactor}px`,
                            whiteSpace: 'pre-line'
                          }}
                        >
                          {exp.description}
                        </p>
                        <div 
                          className="text-gray-800 font-medium"
                          style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}
                        >
                          • List your achievement and accomplishments here in bullet<br />
                          • Start with the most relevant job
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Default work experience entries
                <>
                  {[
                    { year: '2018\n2020', title: 'JOB TITLE HERE', company: 'Company Name and Location' },
                    { year: '2016\n2018', title: 'JOB TITLE HERE', company: 'Company Name and Location' },
                    { year: '2014\n2016', title: 'JOB TITLE HERE', company: 'Company Name and Location' }
                  ].map((job, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-start">
                        <div 
                          className="flex flex-col items-center mr-6"
                          style={{ width: `${60 * scaleFactor}px` }}
                        >
                          <div 
                            className="text-gray-600 font-bold text-center whitespace-pre-line"
                            style={{ 
                              fontSize: `${Math.max(8, 14 * scaleFactor)}px`,
                              lineHeight: `${Math.max(10, 16 * scaleFactor)}px`
                            }}
                          >
                            {job.year}
                          </div>
                          <div 
                            className="rounded-full mt-2"
                            style={{ 
                              width: `${12 * scaleFactor}px`, 
                              height: `${12 * scaleFactor}px`,
                              backgroundColor: primaryColor
                            }}
                          ></div>
                          {index < 2 && (
                            <div 
                              className="bg-gray-300 mt-2"
                              style={{ 
                                width: `${2 * scaleFactor}px`, 
                                height: `${80 * scaleFactor}px`
                              }}
                            ></div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 
                            className="font-bold text-gray-900"
                            style={{ 
                              fontSize: `${Math.max(10, 16 * scaleFactor)}px`,
                              marginBottom: `${4 * scaleFactor}px`
                            }}
                          >
                            {job.title}
                          </h3>
                          <p 
                            className="text-gray-600 font-medium"
                            style={{ 
                              fontSize: `${Math.max(8, 14 * scaleFactor)}px`,
                              marginBottom: `${12 * scaleFactor}px`
                            }}
                          >
                            {job.company}
                          </p>
                          <p 
                            className="text-gray-700 leading-relaxed"
                            style={{ 
                              fontSize: `${Math.max(8, 12 * scaleFactor)}px`,
                              lineHeight: `${Math.max(12, 18 * scaleFactor)}px`,
                              marginBottom: `${8 * scaleFactor}px`
                            }}
                          >
                            Start with your most recent experience first and then go on with former work experience. Define briefly your accomplishments during this position here and use words like accomplished, managed, handled and achieved.
                          </p>
                          <div 
                            className="text-gray-800 font-medium"
                            style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}
                          >
                            • List your achievement and accomplishments here in bullet<br />
                            • Start with the most relevant job
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-1/3 bg-gray-800 text-white" style={{ padding: `${32 * scaleFactor}px` }}>
          {/* Contact Section */}
          <div style={{ marginBottom: `${32 * scaleFactor}px` }}>
            <h2 
              className="font-bold tracking-wider border-b-2 pb-2"
              style={{ 
                fontSize: `${Math.max(10, 18 * scaleFactor)}px`,
                marginBottom: `${20 * scaleFactor}px`,
                borderColor: primaryColor
              }}
            >
              CONTACT
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${16 * scaleFactor}px` }}>
              {personalInfo.phone && (
                <div className="flex items-center">
                  {personalInfo.contactStyle === 'symbols' && (
                    <div 
                      className="rounded-full flex items-center justify-center mr-3"
                      style={{ 
                        width: `${32 * scaleFactor}px`, 
                        height: `${32 * scaleFactor}px`,
                        backgroundColor: primaryColor
                      }}
                    >
                      <Phone className="text-white" style={{ width: `${16 * scaleFactor}px`, height: `${16 * scaleFactor}px` }} />
                    </div>
                  )}
                  <span style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}>
                    {personalInfo.phone}
                  </span>
                </div>
              )}
              
              {personalInfo.email && (
                <div className="flex items-center">
                  {personalInfo.contactStyle === 'symbols' && (
                    <div 
                      className="rounded-full flex items-center justify-center mr-3"
                      style={{ 
                        width: `${32 * scaleFactor}px`, 
                        height: `${32 * scaleFactor}px`,
                        backgroundColor: primaryColor
                      }}
                    >
                      <Mail className="text-white" style={{ width: `${16 * scaleFactor}px`, height: `${16 * scaleFactor}px` }} />
                    </div>
                  )}
                  <span 
                    className="break-all"
                    style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}
                  >
                    {personalInfo.email}
                  </span>
                </div>
              )}
              
              {personalInfo.location && (
                <div className="flex items-center">
                  {personalInfo.contactStyle === 'symbols' && (
                    <div 
                      className="rounded-full flex items-center justify-center mr-3"
                      style={{ 
                        width: `${32 * scaleFactor}px`, 
                        height: `${32 * scaleFactor}px`,
                        backgroundColor: primaryColor
                      }}
                    >
                      <MapPin className="text-white" style={{ width: `${16 * scaleFactor}px`, height: `${16 * scaleFactor}px` }} />
                    </div>
                  )}
                  <span style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}>
                    {personalInfo.location}
                  </span>
                </div>
              )}

              {/* Default contact info if none provided */}
              {!personalInfo.phone && !personalInfo.email && !personalInfo.location && (
                <>
                  <div className="flex items-center">
                    {personalInfo.contactStyle === 'symbols' && (
                      <div 
                        className="rounded-full flex items-center justify-center mr-3"
                        style={{ 
                          width: `${32 * scaleFactor}px`, 
                          height: `${32 * scaleFactor}px`,
                          backgroundColor: primaryColor
                        }}
                      >
                        <Phone className="text-white" style={{ width: `${16 * scaleFactor}px`, height: `${16 * scaleFactor}px` }} />
                      </div>
                    )}
                    <span style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}>
                      +111 222 333 444 55
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    {personalInfo.contactStyle === 'symbols' && (
                      <div 
                        className="rounded-full flex items-center justify-center mr-3"
                        style={{ 
                          width: `${32 * scaleFactor}px`, 
                          height: `${32 * scaleFactor}px`,
                          backgroundColor: primaryColor
                        }}
                      >
                        <Mail className="text-white" style={{ width: `${16 * scaleFactor}px`, height: `${16 * scaleFactor}px` }} />
                      </div>
                    )}
                    <span style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}>
                      your-email@example.com
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    {personalInfo.contactStyle === 'symbols' && (
                      <div 
                        className="rounded-full flex items-center justify-center mr-3"
                        style={{ 
                          width: `${32 * scaleFactor}px`, 
                          height: `${32 * scaleFactor}px`,
                          backgroundColor: primaryColor
                        }}
                      >
                        <MapPin className="text-white" style={{ width: `${16 * scaleFactor}px`, height: `${16 * scaleFactor}px` }} />
                      </div>
                    )}
                    <span style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}>
                      Your city and country
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Education Section */}
          <div style={{ marginBottom: `${32 * scaleFactor}px` }}>
            <h2 
              className="font-bold tracking-wider border-b-2 pb-2"
              style={{ 
                fontSize: `${Math.max(10, 18 * scaleFactor)}px`,
                marginBottom: `${20 * scaleFactor}px`,
                borderColor: primaryColor
              }}
            >
              EDUCATION
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${20 * scaleFactor}px` }}>
              {education.length > 0 ? (
                education.map((edu, index) => (
                  <div key={index}>
                    <h3 
                      className="font-bold"
                      style={{ 
                        fontSize: `${Math.max(8, 14 * scaleFactor)}px`,
                        marginBottom: `${4 * scaleFactor}px`
                      }}
                    >
                      {edu.degree}
                    </h3>
                    <p 
                      className="text-gray-300"
                      style={{ 
                        fontSize: `${Math.max(8, 12 * scaleFactor)}px`,
                        marginBottom: `${4 * scaleFactor}px`
                      }}
                    >
                      {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                    </p>
                    <p 
                      className="text-gray-300"
                      style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}
                    >
                      {edu.institution}
                    </p>
                  </div>
                ))
              ) : (
                <>
                  <div>
                    <h3 
                      className="font-bold"
                      style={{ 
                        fontSize: `${Math.max(8, 14 * scaleFactor)}px`,
                        marginBottom: `${4 * scaleFactor}px`
                      }}
                    >
                      Your Degree/Major
                    </h3>
                    <p 
                      className="text-gray-300"
                      style={{ 
                        fontSize: `${Math.max(8, 12 * scaleFactor)}px`,
                        marginBottom: `${4 * scaleFactor}px`
                      }}
                    >
                      Year
                    </p>
                    <p 
                      className="text-gray-300"
                      style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}
                    >
                      University, School, Country
                    </p>
                  </div>
                  
                  <div>
                    <h3 
                      className="font-bold"
                      style={{ 
                        fontSize: `${Math.max(8, 14 * scaleFactor)}px`,
                        marginBottom: `${4 * scaleFactor}px`
                      }}
                    >
                      Your Degree/Major
                    </h3>
                    <p 
                      className="text-gray-300"
                      style={{ 
                        fontSize: `${Math.max(8, 12 * scaleFactor)}px`,
                        marginBottom: `${4 * scaleFactor}px`
                      }}
                    >
                      Year
                    </p>
                    <p 
                      className="text-gray-300"
                      style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}
                    >
                      University, School, Country
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <h2 
              className="font-bold tracking-wider border-b-2 pb-2"
              style={{ 
                fontSize: `${Math.max(10, 18 * scaleFactor)}px`,
                marginBottom: `${20 * scaleFactor}px`,
                borderColor: primaryColor
              }}
            >
              SKILLS
            </h2>
            
            <div style={{ marginBottom: `${24 * scaleFactor}px` }}>
              <h3 
                className="font-bold"
                style={{ 
                  fontSize: `${Math.max(8, 14 * scaleFactor)}px`,
                  marginBottom: `${12 * scaleFactor}px`
                }}
              >
                PROFESSIONAL
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: `${8 * scaleFactor}px` }}>
                {skills.filter(skill => skill.name.toLowerCase().includes('problem') || 
                                      skill.name.toLowerCase().includes('creative') ||
                                      skill.name.toLowerCase().includes('conflict') ||
                                      skill.name.toLowerCase().includes('leadership') ||
                                      skill.name.toLowerCase().includes('communication')).length > 0 ? (
                  skills.filter(skill => skill.name.toLowerCase().includes('problem') || 
                                        skill.name.toLowerCase().includes('creative') ||
                                        skill.name.toLowerCase().includes('conflict') ||
                                        skill.name.toLowerCase().includes('leadership') ||
                                        skill.name.toLowerCase().includes('communication')).map((skill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span 
                        className="text-gray-300"
                        style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}
                      >
                        {skill.name}
                      </span>
                      {renderSkillLevel(skill.level, skillsConfig?.style || 'dots')}
                    </div>
                  ))
                ) : (
                  <>
                    <span className="text-gray-300" style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}>Problem Solving</span>
                    <span className="text-gray-300" style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}>Creative Thinking</span>
                    <span className="text-gray-300" style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}>Conflict Resolution</span>
                    <span className="text-gray-300" style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}>Leadership</span>
                    <span className="text-gray-300" style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}>Communication</span>
                  </>
                )}
              </div>
            </div>
            
            <div>
              <h3 
                className="font-bold"
                style={{ 
                  fontSize: `${Math.max(8, 14 * scaleFactor)}px`,
                  marginBottom: `${12 * scaleFactor}px`
                }}
              >
                TECHNICAL
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: `${8 * scaleFactor}px` }}>
                {skills.filter(skill => !skill.name.toLowerCase().includes('problem') && 
                                       !skill.name.toLowerCase().includes('creative') &&
                                       !skill.name.toLowerCase().includes('conflict') &&
                                       !skill.name.toLowerCase().includes('leadership') &&
                                       !skill.name.toLowerCase().includes('communication')).length > 0 ? (
                  skills.filter(skill => !skill.name.toLowerCase().includes('problem') && 
                                        !skill.name.toLowerCase().includes('creative') &&
                                        !skill.name.toLowerCase().includes('conflict') &&
                                        !skill.name.toLowerCase().includes('leadership') &&
                                        !skill.name.toLowerCase().includes('communication')).map((skill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span 
                        className="text-gray-300"
                        style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}
                      >
                        {skill.name}
                      </span>
                      {renderSkillLevel(skill.level, skillsConfig?.style || 'dots')}
                    </div>
                  ))
                ) : (
                  <>
                    <span className="text-gray-300" style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}>MS Office</span>
                    <span className="text-gray-300" style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}>PC Trouble Shooting</span>
                    <span className="text-gray-300" style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}>Adobe Photoshop</span>
                    <span className="text-gray-300" style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}>Html Email</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTemplate;