import React from 'react';
import { Phone, Mail, MapPin, Calendar, User, Briefcase, GraduationCap, Award, Globe, Code, ExternalLink } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

interface ModernTemplateProps {
  fontSize?: number;
  currentPage?: number;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ fontSize = 100, currentPage = 1 }) => {
  const { state } = useResume();
  const { personalInfo, workExperience, education, skills, languages, projects, skillsConfig } = state.resumeData;
  const colorTheme = state.resumeData.colorTheme;

  const scaleFactor = fontSize / 100;

  // Dynamic color styles
  const primaryColor = colorTheme?.primary || '#00FFCC';
  const secondaryColor = colorTheme?.secondary || '#00E6B8';
  const gradientFrom = colorTheme?.gradient?.from || primaryColor;
  const gradientTo = colorTheme?.gradient?.to || secondaryColor;

  const renderSkillLevel = (level: number, skillStyle: string, isDarkBackground = false) => {
    const style = skillStyle || 'dots';
    const activeColor = isDarkBackground ? '#FFFFFF' : primaryColor;
    const inactiveColor = isDarkBackground ? 'rgba(255, 255, 255, 0.3)' : '#E5E7EB';
    
    switch (style) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((dot) => (
              <div
                key={dot}
                style={{ 
                  width: `${Math.max(6, 8 * scaleFactor)}px`, 
                  height: `${Math.max(6, 8 * scaleFactor)}px`,
                  backgroundColor: dot <= level ? activeColor : inactiveColor,
                  borderRadius: '50%'
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
                style={{ 
                  width: `${Math.max(4, 6 * scaleFactor)}px`, 
                  height: `${Math.max(8, 16 * scaleFactor)}px`,
                  backgroundColor: bar <= level ? activeColor : inactiveColor,
                  borderRadius: '2px'
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
                style={{ 
                  width: `${Math.max(8, 12 * scaleFactor)}px`, 
                  height: `${Math.max(4, 6 * scaleFactor)}px`,
                  backgroundColor: pill <= level ? activeColor : inactiveColor,
                  borderRadius: '50%'
                }}
              />
            ))}
          </div>
        );
      default:
        return (
          <div className="w-full bg-gray-200 rounded-full" style={{ height: `${12 * scaleFactor}px` }}>
            <div 
              className="rounded-full transition-all duration-300"
              style={{ 
                width: `${(level / 5) * 100}%`,
                height: `${12 * scaleFactor}px`,
                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
              }}
            ></div>
          </div>
        );
    }
  };

  // Determine content for each page
  const renderPage1 = () => (
    <div 
      className="bg-white w-full h-full shadow-2xl overflow-hidden flex"
      style={{ 
        width: '210mm', 
        height: '297mm',
        fontSize: `${Math.max(8, 14 * scaleFactor)}px`
      }}
    >
      {/* Left Sidebar */}
      <div 
        className="w-1/3 text-white flex flex-col"
        style={{ 
          background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
          padding: `${32 * scaleFactor}px` 
        }}
      >
        {/* Profile Section */}
        <div className="text-center" style={{ marginBottom: `${32 * scaleFactor}px` }}>
          <div 
            className="bg-white rounded-full mx-auto overflow-hidden border-4 border-white shadow-lg"
            style={{ 
              width: `${128 * scaleFactor}px`, 
              height: `${128 * scaleFactor}px`,
              marginBottom: `${24 * scaleFactor}px`
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
                <User className="text-gray-400" style={{ width: `${64 * scaleFactor}px`, height: `${64 * scaleFactor}px` }} />
              </div>
            )}
          </div>
          <h1 
            className="font-bold tracking-wide"
            style={{ 
              fontSize: `${Math.max(12, 24 * scaleFactor)}px`,
              marginBottom: `${8 * scaleFactor}px`
            }}
          >
            {personalInfo.firstName.toUpperCase()} {personalInfo.lastName.toUpperCase()}
          </h1>
          <p 
            className="font-medium opacity-90 tracking-wider"
            style={{ fontSize: `${Math.max(8, 14 * scaleFactor)}px` }}
          >
            {personalInfo.position?.toUpperCase() || 'PROFESSIONAL TITLE'}
          </p>
        </div>

        {/* Contact Section */}
        <div style={{ marginBottom: `${32 * scaleFactor}px` }}>
          <div className="flex items-center" style={{ marginBottom: `${16 * scaleFactor}px` }}>
            <User className="mr-3" style={{ width: `${20 * scaleFactor}px`, height: `${20 * scaleFactor}px` }} />
            <h2 
              className="font-bold tracking-wide"
              style={{ fontSize: `${Math.max(10, 18 * scaleFactor)}px` }}
            >
              CONTACT
            </h2>
          </div>
          <div className="border-t-2 border-white/30" style={{ paddingTop: `${16 * scaleFactor}px` }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${16 * scaleFactor}px` }}>
              {personalInfo.phone && (
                <div className="flex items-center" style={{ fontSize: `${Math.max(8, 14 * scaleFactor)}px` }}>
                  {personalInfo.contactStyle === 'symbols' && (
                    <Phone className="flex-shrink-0" style={{ width: `${16 * scaleFactor}px`, height: `${16 * scaleFactor}px`, marginRight: `${12 * scaleFactor}px` }} />
                  )}
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.email && (
                <div className="flex items-center" style={{ fontSize: `${Math.max(8, 14 * scaleFactor)}px` }}>
                  {personalInfo.contactStyle === 'symbols' && (
                    <Mail className="flex-shrink-0" style={{ width: `${16 * scaleFactor}px`, height: `${16 * scaleFactor}px`, marginRight: `${12 * scaleFactor}px` }} />
                  )}
                  <span className="break-all">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center" style={{ fontSize: `${Math.max(8, 14 * scaleFactor)}px` }}>
                  {personalInfo.contactStyle === 'symbols' && (
                    <MapPin className="flex-shrink-0" style={{ width: `${16 * scaleFactor}px`, height: `${16 * scaleFactor}px`, marginRight: `${12 * scaleFactor}px` }} />
                  )}
                  <span>{personalInfo.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div style={{ marginBottom: `${32 * scaleFactor}px` }}>
          <div className="flex items-center" style={{ marginBottom: `${16 * scaleFactor}px` }}>
            <GraduationCap className="mr-3" style={{ width: `${20 * scaleFactor}px`, height: `${20 * scaleFactor}px` }} />
            <h2 
              className="font-bold tracking-wide"
              style={{ fontSize: `${Math.max(10, 18 * scaleFactor)}px` }}
            >
              EDUCATION
            </h2>
          </div>
          <div className="border-t-2 border-white/30" style={{ paddingTop: `${16 * scaleFactor}px` }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${24 * scaleFactor}px` }}>
              {education.length > 0 ? (
                education.map((edu, index) => (
                  <div key={index} style={{ fontSize: `${Math.max(8, 14 * scaleFactor)}px` }}>
                    <div className="flex items-center" style={{ marginBottom: `${8 * scaleFactor}px` }}>
                      <Calendar className="mr-2" style={{ width: `${12 * scaleFactor}px`, height: `${12 * scaleFactor}px` }} />
                      <span className="font-medium">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</span>
                    </div>
                    <h3 className="font-bold" style={{ marginBottom: `${4 * scaleFactor}px` }}>{edu.degree}</h3>
                    <p className="opacity-90">{edu.institution}</p>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: `${Math.max(8, 14 * scaleFactor)}px` }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: `${16 * scaleFactor}px` }}>
                    <div>
                      <div className="flex items-center" style={{ marginBottom: `${8 * scaleFactor}px` }}>
                        <Calendar className="mr-2" style={{ width: `${12 * scaleFactor}px`, height: `${12 * scaleFactor}px` }} />
                        <span className="font-medium">2005 - 2009</span>
                      </div>
                      <h3 className="font-bold" style={{ marginBottom: `${4 * scaleFactor}px` }}>Bachelor Of Design</h3>
                      <p className="opacity-90">Fauget University</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Languages Section */}
        <div className="flex-1">
          <div className="flex items-center" style={{ marginBottom: `${16 * scaleFactor}px` }}>
            <Globe className="mr-3" style={{ width: `${20 * scaleFactor}px`, height: `${20 * scaleFactor}px` }} />
            <h2 
              className="font-bold tracking-wide"
              style={{ fontSize: `${Math.max(10, 18 * scaleFactor)}px` }}
            >
              LANGUAGE
            </h2>
          </div>
          <div className="border-t-2 border-white/30" style={{ paddingTop: `${16 * scaleFactor}px` }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${12 * scaleFactor}px` }}>
              {languages.length > 0 ? (
                languages.map((lang, index) => (
                  <div key={index} style={{ fontSize: `${Math.max(8, 14 * scaleFactor)}px` }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: `${4 * scaleFactor}px` }}>
                      <span className="font-medium">{lang.name}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full" style={{ height: `${8 * scaleFactor}px` }}>
                      <div 
                        className="bg-white rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(lang.level / 7) * 100}%`,
                          height: `${8 * scaleFactor}px`
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: `${Math.max(8, 14 * scaleFactor)}px` }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: `${12 * scaleFactor}px` }}>
                    {['English', 'Spanish', 'Indonesia'].map((lang, index) => (
                      <div key={lang}>
                        <div className="flex justify-between items-center" style={{ marginBottom: `${4 * scaleFactor}px` }}>
                          <span className="font-medium">{lang}</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full" style={{ height: `${8 * scaleFactor}px` }}>
                          <div 
                            className="bg-white rounded-full"
                            style={{ 
                              width: index === 0 ? '80%' : index === 1 ? '60%' : '40%',
                              height: `${8 * scaleFactor}px`
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="w-2/3 bg-gray-50" style={{ padding: `${32 * scaleFactor}px` }}>
        {/* Profile Info Section */}
        <div style={{ marginBottom: `${32 * scaleFactor}px` }}>
          <div className="flex items-center" style={{ marginBottom: `${16 * scaleFactor}px` }}>
            <User className="mr-3" style={{ width: `${24 * scaleFactor}px`, height: `${24 * scaleFactor}px`, color: primaryColor }} />
            <h2 
              className="font-bold text-gray-800 tracking-wide"
              style={{ fontSize: `${Math.max(12, 20 * scaleFactor)}px` }}
            >
              PROFILE INFO
            </h2>
          </div>
          <div className="border-b-2 border-gray-300" style={{ paddingBottom: `${16 * scaleFactor}px` }}>
            <p 
              className="text-gray-600 leading-relaxed"
              style={{ 
                fontSize: `${Math.max(8, 14 * scaleFactor)}px`,
                lineHeight: `${Math.max(12, 20 * scaleFactor)}px`
              }}
            >
              {state.resumeData.aboutMe || 
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
              }
            </p>
          </div>
        </div>

        {/* Work Experience Section */}
        <div style={{ marginBottom: `${32 * scaleFactor}px` }}>
          <div className="flex items-center" style={{ marginBottom: `${16 * scaleFactor}px` }}>
            <Briefcase className="mr-3" style={{ width: `${24 * scaleFactor}px`, height: `${24 * scaleFactor}px`, color: primaryColor }} />
            <h2 
              className="font-bold text-gray-800 tracking-wide"
              style={{ fontSize: `${Math.max(12, 20 * scaleFactor)}px` }}
            >
              WORK EXPERIENCE
            </h2>
          </div>
          <div className="border-b-2 border-gray-300" style={{ paddingBottom: `${16 * scaleFactor}px` }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${24 * scaleFactor}px` }}>
              {workExperience.length > 0 ? (
                workExperience.slice(0, 2).map((exp, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-start">
                      <div 
                        className="rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ 
                          width: `${32 * scaleFactor}px`, 
                          height: `${32 * scaleFactor}px`,
                          marginRight: `${16 * scaleFactor}px`,
                          marginTop: `${4 * scaleFactor}px`,
                          backgroundColor: primaryColor
                        }}
                      >
                        <Calendar className="text-white" style={{ width: `${16 * scaleFactor}px`, height: `${16 * scaleFactor}px` }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start" style={{ marginBottom: `${8 * scaleFactor}px` }}>
                          <div>
                            <h3 
                              className="font-bold text-gray-800"
                              style={{ fontSize: `${Math.max(10, 16 * scaleFactor)}px` }}
                            >
                              {exp.position}
                            </h3>
                            <p 
                              className="font-medium"
                              style={{ fontSize: `${Math.max(8, 14 * scaleFactor)}px`, color: primaryColor }}
                            >
                              {exp.company}
                            </p>
                          </div>
                          <span 
                            className="text-gray-500 font-medium"
                            style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}
                          >
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </span>
                        </div>
                        <p 
                          className="text-gray-600 leading-relaxed"
                          style={{ 
                            fontSize: `${Math.max(8, 12 * scaleFactor)}px`,
                            lineHeight: `${Math.max(12, 18 * scaleFactor)}px`
                          }}
                        >
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: `${24 * scaleFactor}px` }}>
                  {[1, 2].map((item) => (
                    <div key={item} className="relative">
                      <div className="flex items-start">
                        <div 
                          className="rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ 
                            width: `${32 * scaleFactor}px`, 
                            height: `${32 * scaleFactor}px`,
                            marginRight: `${16 * scaleFactor}px`,
                            marginTop: `${4 * scaleFactor}px`,
                            backgroundColor: primaryColor
                          }}
                        >
                          <Calendar className="text-white" style={{ width: `${16 * scaleFactor}px`, height: `${16 * scaleFactor}px` }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start" style={{ marginBottom: `${8 * scaleFactor}px` }}>
                            <div>
                              <h3 
                                className="font-bold text-gray-800"
                                style={{ fontSize: `${Math.max(10, 16 * scaleFactor)}px` }}
                              >
                                Junior Graphic Designer
                              </h3>
                              <p 
                                className="font-medium"
                                style={{ fontSize: `${Math.max(8, 14 * scaleFactor)}px`, color: primaryColor }}
                              >
                                Borcelle Studios
                              </p>
                            </div>
                            <span 
                              className="text-gray-500 font-medium"
                              style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}
                            >
                              2012 - 2015
                            </span>
                          </div>
                          <p 
                            className="text-gray-600 leading-relaxed"
                            style={{ 
                              fontSize: `${Math.max(8, 12 * scaleFactor)}px`,
                              lineHeight: `${Math.max(12, 18 * scaleFactor)}px`
                            }}
                          >
                            Working as graphic designer for 1 year<br />
                            Post Graduated in Website & Graphics Designing.<br />
                            Academic Excellence in Web Design.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div>
          <div className="flex items-center" style={{ marginBottom: `${16 * scaleFactor}px` }}>
            <Award className="mr-3" style={{ width: `${24 * scaleFactor}px`, height: `${24 * scaleFactor}px`, color: primaryColor }} />
            <h2 
              className="font-bold text-gray-800 tracking-wide"
              style={{ fontSize: `${Math.max(12, 20 * scaleFactor)}px` }}
            >
              MY SKILLS & EXPERTISE
            </h2>
          </div>
          <div className="grid grid-cols-2" style={{ gap: `${24 * scaleFactor}px` }}>
            {skills.length > 0 ? (
              skills.slice(0, 6).map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center" style={{ marginBottom: `${8 * scaleFactor}px` }}>
                    <span 
                      className="font-medium text-gray-700"
                      style={{ fontSize: `${Math.max(8, 14 * scaleFactor)}px` }}
                    >
                      {skill.name}
                    </span>
                    {renderSkillLevel(skill.level, skillsConfig?.style || 'dots')}
                  </div>
                </div>
              ))
            ) : (
              <>
                {[
                  { name: 'Graphic Design', width: '83%' },
                  { name: 'Branding', width: '80%' },
                  { name: 'Web Design', width: '75%' },
                  { name: 'Photography', width: '80%' },
                  { name: 'Video Editing', width: '67%' },
                  { name: 'SEO & Marketing', width: '80%' }
                ].map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center" style={{ marginBottom: `${8 * scaleFactor}px` }}>
                      <span 
                        className="font-medium text-gray-700"
                        style={{ fontSize: `${Math.max(8, 14 * scaleFactor)}px` }}
                      >
                        {skill.name}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full" style={{ height: `${12 * scaleFactor}px` }}>
                      <div 
                        className="rounded-full"
                        style={{ 
                          width: skill.width,
                          height: `${12 * scaleFactor}px`,
                          background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPage2 = () => (
    <div 
      className="bg-white w-full h-full shadow-2xl overflow-hidden flex"
      style={{ 
        width: '210mm', 
        height: '297mm',
        fontSize: `${Math.max(8, 14 * scaleFactor)}px`
      }}
    >
      {/* Left Sidebar - Same as Page 1 but with different content */}
      <div 
        className="w-1/3 text-white flex flex-col"
        style={{ 
          background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
          padding: `${32 * scaleFactor}px` 
        }}
      >
        {/* Compact Profile Section */}
        <div className="text-center" style={{ marginBottom: `${24 * scaleFactor}px` }}>
          <h1 
            className="font-bold tracking-wide"
            style={{ 
              fontSize: `${Math.max(10, 18 * scaleFactor)}px`,
              marginBottom: `${8 * scaleFactor}px`
            }}
          >
            {personalInfo.firstName.toUpperCase()} {personalInfo.lastName.toUpperCase()}
          </h1>
          <p 
            className="font-medium opacity-90 tracking-wider"
            style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}
          >
            {personalInfo.position?.toUpperCase() || 'PROFESSIONAL TITLE'} - PAGE 2
          </p>
        </div>

        {/* Additional Skills Section */}
        {skills.length > 6 && (
          <div style={{ marginBottom: `${32 * scaleFactor}px` }}>
            <div className="flex items-center" style={{ marginBottom: `${16 * scaleFactor}px` }}>
              <Award className="mr-3" style={{ width: `${20 * scaleFactor}px`, height: `${20 * scaleFactor}px` }} />
              <h2 
                className="font-bold tracking-wide"
                style={{ fontSize: `${Math.max(10, 18 * scaleFactor)}px` }}
              >
                ADDITIONAL SKILLS
              </h2>
            </div>
            <div className="border-t-2 border-white/30" style={{ paddingTop: `${16 * scaleFactor}px` }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: `${12 * scaleFactor}px` }}>
                {skills.slice(6).map((skill, index) => (
                  <div key={index} style={{ fontSize: `${Math.max(8, 14 * scaleFactor)}px` }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: `${4 * scaleFactor}px` }}>
                      <span className="font-medium">{skill.name}</span>
                      {renderSkillLevel(skill.level, skillsConfig?.style || 'dots', true)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Project Technologies Summary */}
        {projects.length > 0 && (
          <div className="flex-1">
            <div className="flex items-center" style={{ marginBottom: `${16 * scaleFactor}px` }}>
              <Code className="mr-3" style={{ width: `${20 * scaleFactor}px`, height: `${20 * scaleFactor}px` }} />
              <h2 
                className="font-bold tracking-wide"
                style={{ fontSize: `${Math.max(10, 18 * scaleFactor)}px` }}
              >
                TECHNOLOGIES
              </h2>
            </div>
            <div className="border-t-2 border-white/30" style={{ paddingTop: `${16 * scaleFactor}px` }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: `${8 * scaleFactor}px` }}>
                {/* Extract unique technologies from all projects */}
                {Array.from(new Set(projects.flatMap(p => p.technologies || []))).slice(0, 8).map((tech, index) => (
                  <div key={index} style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}>
                    <span className="font-medium opacity-90">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="w-2/3 bg-gray-50" style={{ padding: `${32 * scaleFactor}px` }}>
        {/* Additional Work Experience */}
        {workExperience.length > 2 && (
          <div style={{ marginBottom: `${32 * scaleFactor}px` }}>
            <div className="flex items-center" style={{ marginBottom: `${16 * scaleFactor}px` }}>
              <Briefcase className="mr-3" style={{ width: `${24 * scaleFactor}px`, height: `${24 * scaleFactor}px`, color: primaryColor }} />
              <h2 
                className="font-bold text-gray-800 tracking-wide"
                style={{ fontSize: `${Math.max(12, 20 * scaleFactor)}px` }}
              >
                ADDITIONAL WORK EXPERIENCE
              </h2>
            </div>
            <div className="border-b-2 border-gray-300" style={{ paddingBottom: `${16 * scaleFactor}px` }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: `${24 * scaleFactor}px` }}>
                {workExperience.slice(2).map((exp, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-start">
                      <div 
                        className="rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ 
                          width: `${32 * scaleFactor}px`, 
                          height: `${32 * scaleFactor}px`,
                          marginRight: `${16 * scaleFactor}px`,
                          marginTop: `${4 * scaleFactor}px`,
                          backgroundColor: primaryColor
                        }}
                      >
                        <Calendar className="text-white" style={{ width: `${16 * scaleFactor}px`, height: `${16 * scaleFactor}px` }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start" style={{ marginBottom: `${8 * scaleFactor}px` }}>
                          <div>
                            <h3 
                              className="font-bold text-gray-800"
                              style={{ fontSize: `${Math.max(10, 16 * scaleFactor)}px` }}
                            >
                              {exp.position}
                            </h3>
                            <p 
                              className="font-medium"
                              style={{ fontSize: `${Math.max(8, 14 * scaleFactor)}px`, color: primaryColor }}
                            >
                              {exp.company}
                            </p>
                          </div>
                          <span 
                            className="text-gray-500 font-medium"
                            style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}
                          >
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </span>
                        </div>
                        <p 
                          className="text-gray-600 leading-relaxed"
                          style={{ 
                            fontSize: `${Math.max(8, 12 * scaleFactor)}px`,
                            lineHeight: `${Math.max(12, 18 * scaleFactor)}px`
                          }}
                        >
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <div style={{ marginBottom: `${32 * scaleFactor}px` }}>
            <div className="flex items-center" style={{ marginBottom: `${16 * scaleFactor}px` }}>
              <Code className="mr-3" style={{ width: `${24 * scaleFactor}px`, height: `${24 * scaleFactor}px`, color: primaryColor }} />
              <h2 
                className="font-bold text-gray-800 tracking-wide"
                style={{ fontSize: `${Math.max(12, 20 * scaleFactor)}px` }}
              >
                PROJECTS
              </h2>
            </div>
            <div className="border-b-2 border-gray-300" style={{ paddingBottom: `${16 * scaleFactor}px` }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: `${24 * scaleFactor}px` }}>
                {projects.map((project, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-start">
                      <div 
                        className="rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ 
                          width: `${32 * scaleFactor}px`, 
                          height: `${32 * scaleFactor}px`,
                          marginRight: `${16 * scaleFactor}px`,
                          marginTop: `${4 * scaleFactor}px`,
                          backgroundColor: primaryColor
                        }}
                      >
                        <Code className="text-white" style={{ width: `${16 * scaleFactor}px`, height: `${16 * scaleFactor}px` }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start" style={{ marginBottom: `${8 * scaleFactor}px` }}>
                          <div>
                            <h3 
                              className="font-bold text-gray-800"
                              style={{ fontSize: `${Math.max(10, 16 * scaleFactor)}px` }}
                            >
                              {project.title}
                            </h3>
                            {project.link && (
                              <div className="flex items-center" style={{ marginTop: `${4 * scaleFactor}px` }}>
                                <ExternalLink className="mr-2" style={{ width: `${12 * scaleFactor}px`, height: `${12 * scaleFactor}px`, color: primaryColor }} />
                                <span 
                                  className="font-medium break-all"
                                  style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px`, color: primaryColor }}
                                >
                                  {project.link.replace(/^https?:\/\//, '')}
                                </span>
                              </div>
                            )}
                          </div>
                          {(project.startDate || project.endDate) && (
                            <span 
                              className="text-gray-500 font-medium"
                              style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}
                            >
                              {project.startDate} - {project.current ? 'Ongoing' : project.endDate}
                            </span>
                          )}
                        </div>
                        <p 
                          className="text-gray-600 leading-relaxed"
                          style={{ 
                            fontSize: `${Math.max(8, 12 * scaleFactor)}px`,
                            lineHeight: `${Math.max(12, 18 * scaleFactor)}px`,
                            marginBottom: `${8 * scaleFactor}px`
                          }}
                        >
                          {project.description}
                        </p>
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1" style={{ marginTop: `${8 * scaleFactor}px` }}>
                            {project.technologies.slice(0, 6).map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="text-white px-2 py-1 rounded text-xs font-medium"
                                style={{ 
                                  backgroundColor: primaryColor,
                                  fontSize: `${Math.max(6, 10 * scaleFactor)}px`
                                }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* References Section */}
        <div>
          <div className="flex items-center" style={{ marginBottom: `${16 * scaleFactor}px` }}>
            <User className="mr-3" style={{ width: `${24 * scaleFactor}px`, height: `${24 * scaleFactor}px`, color: primaryColor }} />
            <h2 
              className="font-bold text-gray-800 tracking-wide"
              style={{ fontSize: `${Math.max(12, 20 * scaleFactor)}px` }}
            >
              MY REFERENCE
            </h2>
          </div>
          <div className="grid grid-cols-2" style={{ gap: `${24 * scaleFactor}px` }}>
            <div>
              <h3 
                className="font-bold text-gray-800"
                style={{ 
                  fontSize: `${Math.max(10, 16 * scaleFactor)}px`,
                  marginBottom: `${4 * scaleFactor}px`
                }}
              >
                Harumi Kobayashi
              </h3>
              <p 
                className="font-medium"
                style={{ 
                  fontSize: `${Math.max(8, 12 * scaleFactor)}px`,
                  marginBottom: `${4 * scaleFactor}px`,
                  color: primaryColor
                }}
              >
                Wardiere Inc. / CEO
              </p>
              <p 
                className="text-gray-600"
                style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}
              >
                123-456-7890
              </p>
            </div>
            <div>
              <h3 
                className="font-bold text-gray-800"
                style={{ 
                  fontSize: `${Math.max(10, 16 * scaleFactor)}px`,
                  marginBottom: `${4 * scaleFactor}px`
                }}
              >
                Francois Mercer
              </h3>
              <p 
                className="font-medium"
                style={{ 
                  fontSize: `${Math.max(8, 12 * scaleFactor)}px`,
                  marginBottom: `${4 * scaleFactor}px`,
                  color: primaryColor
                }}
              >
                Wardiere Inc. / CEO
              </p>
              <p 
                className="text-gray-600"
                style={{ fontSize: `${Math.max(8, 12 * scaleFactor)}px` }}
              >
                123-456-7890
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Determine if we need a second page
  const needsSecondPage = workExperience.length > 2 || projects.length > 0 || skills.length > 6;

  if (currentPage === 2 && needsSecondPage) {
    return renderPage2();
  }

  return renderPage1();
};

export default ModernTemplate;