import React from 'react';
import { User, Phone, Mail, MapPin, Calendar, Briefcase, GraduationCap, Award, Globe } from 'lucide-react';

interface TemplatePreviewProps {
  templateId: string;
  className?: string;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ templateId, className = "" }) => {
  const renderModernPreview = () => (
    <div className={`bg-white w-full h-full flex ${className}`} style={{ fontSize: '3px' }}>
      {/* Left Sidebar */}
      <div className="w-1/3 bg-gradient-to-b from-cyan-400 to-teal-600 text-white p-1">
        {/* Profile */}
        <div className="text-center mb-1">
          <div className="w-4 h-4 bg-white rounded-full mx-auto mb-0.5 flex items-center justify-center">
            <User className="w-2 h-2 text-gray-400" />
          </div>
          <div className="text-white font-bold" style={{ fontSize: '2.5px', lineHeight: '3px' }}>JOHN DOE</div>
          <div className="text-white/80" style={{ fontSize: '2px', lineHeight: '2.5px' }}>DESIGNER</div>
        </div>
        
        {/* Contact */}
        <div className="mb-1">
          <div className="flex items-center mb-0.5">
            <User className="w-1 h-1 mr-0.5" />
            <div className="font-bold" style={{ fontSize: '2px' }}>CONTACT</div>
          </div>
          <div className="border-t border-white/30 pt-0.5">
            <div className="flex items-center mb-0.5">
              <Phone className="w-0.5 h-0.5 mr-0.5" />
              <span style={{ fontSize: '1.8px' }}>+123 456 7890</span>
            </div>
            <div className="flex items-center mb-0.5">
              <Mail className="w-0.5 h-0.5 mr-0.5" />
              <span style={{ fontSize: '1.8px' }}>john@email.com</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-0.5 h-0.5 mr-0.5" />
              <span style={{ fontSize: '1.8px' }}>New York, NY</span>
            </div>
          </div>
        </div>
        
        {/* Education */}
        <div className="mb-1">
          <div className="flex items-center mb-0.5">
            <GraduationCap className="w-1 h-1 mr-0.5" />
            <div className="font-bold" style={{ fontSize: '2px' }}>EDUCATION</div>
          </div>
          <div className="border-t border-white/30 pt-0.5">
            <div style={{ fontSize: '1.8px' }} className="font-bold">Bachelor Design</div>
            <div style={{ fontSize: '1.5px' }} className="opacity-90">University</div>
          </div>
        </div>
        
        {/* Languages */}
        <div>
          <div className="font-bold mb-0.5" style={{ fontSize: '2px' }}>LANGUAGE</div>
          <div className="border-t border-white/30 pt-0.5">
            <div className="mb-0.5">
              <div style={{ fontSize: '1.8px' }}>English</div>
              <div className="w-full bg-white/20 rounded-full" style={{ height: '1px' }}>
                <div className="bg-white rounded-full w-4/5" style={{ height: '1px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Content */}
      <div className="w-2/3 bg-gray-50 p-1">
        {/* Profile Info */}
        <div className="mb-1">
          <div className="flex items-center mb-0.5">
            <User className="w-1 h-1 mr-0.5 text-cyan-500" />
            <div className="font-bold text-gray-800" style={{ fontSize: '2px' }}>PROFILE INFO</div>
          </div>
          <div className="border-b border-gray-300 pb-0.5">
            <div className="text-gray-600" style={{ fontSize: '1.5px', lineHeight: '2px' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit...
            </div>
          </div>
        </div>
        
        {/* Work Experience */}
        <div className="mb-1">
          <div className="flex items-center mb-0.5">
            <Briefcase className="w-1 h-1 mr-0.5 text-cyan-500" />
            <div className="font-bold text-gray-800" style={{ fontSize: '2px' }}>WORK EXPERIENCE</div>
          </div>
          <div className="border-b border-gray-300 pb-0.5">
            <div className="flex items-start mb-0.5">
              <div className="w-1 h-1 bg-cyan-500 rounded-full mr-0.5 mt-0.5 flex-shrink-0"></div>
              <div>
                <div className="font-bold text-gray-800" style={{ fontSize: '1.8px' }}>Junior Designer</div>
                <div className="text-cyan-600" style={{ fontSize: '1.5px' }}>Company Name</div>
                <div className="text-gray-600" style={{ fontSize: '1.5px' }}>2020 - Present</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Skills */}
        <div>
          <div className="flex items-center mb-0.5">
            <Award className="w-1 h-1 mr-0.5 text-cyan-500" />
            <div className="font-bold text-gray-800" style={{ fontSize: '2px' }}>SKILLS</div>
          </div>
          <div className="grid grid-cols-2 gap-0.5">
            <div>
              <div className="text-gray-700" style={{ fontSize: '1.5px' }}>Design</div>
              <div className="w-full bg-gray-200 rounded-full" style={{ height: '1px' }}>
                <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full w-4/5" style={{ height: '1px' }}></div>
              </div>
            </div>
            <div>
              <div className="text-gray-700" style={{ fontSize: '1.5px' }}>Branding</div>
              <div className="w-full bg-gray-200 rounded-full" style={{ height: '1px' }}>
                <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full w-3/4" style={{ height: '1px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfessionalPreview = () => (
    <div className={`bg-white w-full h-full ${className}`} style={{ fontSize: '3px' }}>
      {/* Header */}
      <div className="bg-white p-1 flex items-start justify-between">
        <div className="flex-1">
          <h1 className="font-black text-gray-900 mb-0.5" style={{ fontSize: '3px' }}>JOHN DOE</h1>
          <p className="text-gray-600" style={{ fontSize: '2px' }}>JOB TITLE HERE</p>
        </div>
        <div className="w-4 h-4 bg-gray-800 rounded-full flex items-center justify-center ml-1">
          <User className="w-2 h-2 text-white" />
        </div>
      </div>

      <div className="flex">
        {/* Left Content */}
        <div className="w-2/3 bg-white p-1">
          {/* Profile */}
          <div className="mb-1">
            <div className="bg-teal-400 text-white font-bold px-1 py-0.5 mb-0.5 inline-block" style={{ fontSize: '1.8px' }}>
              PROFILE
            </div>
            <p className="text-gray-700" style={{ fontSize: '1.5px', lineHeight: '2px' }}>
              Use this section of job profile or summary to demonstrate your level experience...
            </p>
          </div>

          {/* Work Experience */}
          <div>
            <h2 className="font-bold text-gray-900 border-b border-gray-300 pb-0.5 mb-1" style={{ fontSize: '2px' }}>
              WORK EXPERIENCE
            </h2>
            <div className="flex items-start">
              <div className="flex flex-col items-center mr-1 w-2">
                <div className="text-gray-600 font-bold text-center" style={{ fontSize: '1.5px', lineHeight: '1.8px' }}>2018<br/>2020</div>
                <div className="w-0.5 h-0.5 bg-teal-400 rounded-full mt-0.5"></div>
                <div className="w-0.5 bg-gray-300 mt-0.5" style={{ height: '3px' }}></div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900" style={{ fontSize: '1.8px' }}>JOB TITLE HERE</h3>
                <p className="text-gray-600 mb-0.5" style={{ fontSize: '1.5px' }}>Company Name and Location</p>
                <p className="text-gray-700" style={{ fontSize: '1.3px', lineHeight: '1.8px' }}>
                  Start with your most recent experience first...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-1/3 bg-gray-800 text-white p-1">
          {/* Contact */}
          <div className="mb-1">
            <h2 className="font-bold border-b-2 border-teal-400 pb-0.5 mb-1" style={{ fontSize: '1.8px' }}>CONTACT</h2>
            <div className="space-y-0.5">
              <div className="flex items-center">
                <div className="w-1 h-1 bg-teal-400 rounded-full mr-0.5 flex items-center justify-center">
                  <Phone className="w-0.5 h-0.5 text-white" />
                </div>
                <span style={{ fontSize: '1.5px' }}>+111 222 333</span>
              </div>
              <div className="flex items-center">
                <div className="w-1 h-1 bg-teal-400 rounded-full mr-0.5 flex items-center justify-center">
                  <Mail className="w-0.5 h-0.5 text-white" />
                </div>
                <span style={{ fontSize: '1.5px' }}>your-email@example.com</span>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="mb-1">
            <h2 className="font-bold border-b-2 border-teal-400 pb-0.5 mb-1" style={{ fontSize: '1.8px' }}>EDUCATION</h2>
            <div>
              <h3 className="font-bold" style={{ fontSize: '1.5px' }}>Your Degree</h3>
              <p className="text-gray-300" style={{ fontSize: '1.3px' }}>Year</p>
              <p className="text-gray-300" style={{ fontSize: '1.3px' }}>University</p>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h2 className="font-bold border-b-2 border-teal-400 pb-0.5 mb-1" style={{ fontSize: '1.8px' }}>SKILLS</h2>
            <div>
              <h3 className="font-bold mb-0.5" style={{ fontSize: '1.5px' }}>PROFESSIONAL</h3>
              <div className="space-y-0.5 text-gray-300">
                <div style={{ fontSize: '1.3px' }}>Problem Solving</div>
                <div style={{ fontSize: '1.3px' }}>Creative Thinking</div>
                <div style={{ fontSize: '1.3px' }}>Leadership</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCreativePreview = () => (
    <div className={`bg-white w-full h-full ${className}`} style={{ fontSize: '3px' }}>
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold" style={{ fontSize: '3px' }}>CREATIVE NAME</h1>
            <p className="opacity-90" style={{ fontSize: '2px' }}>CREATIVE DESIGNER</p>
          </div>
          <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
            <User className="w-2 h-2 text-purple-500" />
          </div>
        </div>
      </div>
      <div className="p-1 bg-gray-50">
        <div className="grid grid-cols-2 gap-1">
          <div>
            <h3 className="font-bold text-purple-600 mb-0.5" style={{ fontSize: '1.8px' }}>PORTFOLIO</h3>
            <div className="space-y-0.5">
              <div className="bg-purple-100 rounded" style={{ height: '2px' }}></div>
              <div className="bg-pink-100 rounded" style={{ height: '2px' }}></div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-purple-600 mb-0.5" style={{ fontSize: '1.8px' }}>SKILLS</h3>
            <div className="space-y-0.5">
              <div style={{ fontSize: '1.5px' }}>Creative Design</div>
              <div style={{ fontSize: '1.5px' }}>Illustration</div>
              <div style={{ fontSize: '1.5px' }}>Branding</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMinimalPreview = () => (
    <div className={`bg-white w-full h-full border-l-4 border-gray-600 ${className}`} style={{ fontSize: '3px' }}>
      <div className="p-1">
        <h1 className="font-light text-gray-900 mb-0.5" style={{ fontSize: '3px' }}>John Doe</h1>
        <p className="text-gray-600 mb-1" style={{ fontSize: '2px' }}>Professional Title</p>
        
        <div className="space-y-1">
          <div>
            <h3 className="font-medium text-gray-800 mb-0.5" style={{ fontSize: '1.8px' }}>Experience</h3>
            <div className="text-gray-600">
              <div className="mb-0.5" style={{ fontSize: '1.5px' }}>Senior Position • Company</div>
              <div style={{ fontSize: '1.5px' }}>Junior Position • Previous Company</div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-0.5" style={{ fontSize: '1.8px' }}>Education</h3>
            <div className="text-gray-600">
              <div style={{ fontSize: '1.5px' }}>Degree • University</div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-0.5" style={{ fontSize: '1.8px' }}>Skills</h3>
            <div className="text-gray-600">
              <div style={{ fontSize: '1.5px' }}>Skill One, Skill Two, Skill Three</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExecutivePreview = () => (
    <div className={`bg-white w-full h-full ${className}`} style={{ fontSize: '3px' }}>
      <div className="bg-red-600 text-white p-1">
        <div className="text-center">
          <h1 className="font-bold" style={{ fontSize: '3px' }}>EXECUTIVE NAME</h1>
          <p className="opacity-90" style={{ fontSize: '2px' }}>CHIEF EXECUTIVE OFFICER</p>
        </div>
      </div>
      <div className="p-1">
        <div className="grid grid-cols-2 gap-1">
          <div>
            <h3 className="font-bold text-red-600 mb-0.5 border-b border-red-200" style={{ fontSize: '1.8px' }}>LEADERSHIP</h3>
            <div className="text-gray-700 space-y-0.5">
              <div style={{ fontSize: '1.5px' }}>• Strategic Planning</div>
              <div style={{ fontSize: '1.5px' }}>• Team Management</div>
              <div style={{ fontSize: '1.5px' }}>• Business Development</div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-red-600 mb-0.5 border-b border-red-200" style={{ fontSize: '1.8px' }}>ACHIEVEMENTS</h3>
            <div className="text-gray-700 space-y-0.5">
              <div style={{ fontSize: '1.5px' }}>• Revenue Growth 150%</div>
              <div style={{ fontSize: '1.5px' }}>• Team Expansion</div>
              <div style={{ fontSize: '1.5px' }}>• Market Leadership</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAcademicPreview = () => (
    <div className={`bg-white w-full h-full ${className}`} style={{ fontSize: '3px' }}>
      <div className="p-1 border-b-2 border-green-600">
        <h1 className="font-serif text-gray-900" style={{ fontSize: '3px' }}>Dr. Academic Name</h1>
        <p className="text-gray-600" style={{ fontSize: '2px' }}>Professor of Research</p>
      </div>
      <div className="p-1">
        <div className="space-y-1">
          <div>
            <h3 className="font-semibold text-green-600 mb-0.5" style={{ fontSize: '1.8px' }}>PUBLICATIONS</h3>
            <div className="text-gray-700 space-y-0.5">
              <div style={{ fontSize: '1.5px' }}>• Research Paper Title (2023)</div>
              <div style={{ fontSize: '1.5px' }}>• Journal Article (2022)</div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-green-600 mb-0.5" style={{ fontSize: '1.8px' }}>EDUCATION</h3>
            <div className="text-gray-700">
              <div style={{ fontSize: '1.5px' }}>Ph.D. in Field • University</div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-green-600 mb-0.5" style={{ fontSize: '1.8px' }}>RESEARCH</h3>
            <div className="text-gray-700">
              <div style={{ fontSize: '1.5px' }}>Research Area, Methodology</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  switch (templateId) {
    case 'modern':
      return renderModernPreview();
    case 'professional':
      return renderProfessionalPreview();
    case 'creative':
      return renderCreativePreview();
    case 'minimal':
      return renderMinimalPreview();
    case 'executive':
      return renderExecutivePreview();
    case 'academic':
      return renderAcademicPreview();
    default:
      return renderModernPreview();
  }
};

export default TemplatePreview;