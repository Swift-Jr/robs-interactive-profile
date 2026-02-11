import React, { useState, useEffect } from 'react';
import { INITIAL_CV_DATA } from './constants';
import { CVData } from './types';
import ExperienceSection from './components/ExperienceSection';
import AdminPanel from './components/AdminPanel';
import ScrollNavigation from './components/ScrollNavigation';
import GameOverlay from './components/GameOverlay';
import CaptchaModal from './components/CaptchaModal';
import { Settings, Award, BookOpen, Quote, Heart, Mail, ArrowRight, Linkedin, Download, Send, Cpu, PieChart, Users, Lightbulb, TrendingUp, Anchor } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<CVData>(INITIAL_CV_DATA);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Captcha State
  const [captchaOpen, setCaptchaOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'download' | 'send' | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('cv_data');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load local data", e);
      }
    }
    setMounted(true);
  }, []);

  const handleUpdate = (newData: CVData) => {
    setData(newData);
    localStorage.setItem('cv_data', JSON.stringify(newData));
  };

  // Action handlers triggered after captcha success
  const handleCaptchaSuccess = () => {
    if (pendingAction === 'download') {
      if (data.pdfUrl && data.pdfUrl.trim() !== '') {
         window.open(data.pdfUrl, '_blank');
      } else {
         window.print();
      }
    } else if (pendingAction === 'send') {
      const subject = encodeURIComponent(`Lets Connect`);
      window.location.href = `mailto:robguardjr+profile@gmail.com?subject=${subject}`;
    }
    setPendingAction(null);
  };

  const initiateAction = (action: 'download' | 'send') => {
    setPendingAction(action);
    setCaptchaOpen(true);
  };

  const renderInterestIcon = (id: string) => {
    const className = "text-slate-400 group-hover:text-red-500 transition-colors";
    const size = 24;

    switch (id) {
      case 'i1': // Emerging Tech
        return <Cpu size={size} className={className} />;
      case 'i2': // Data Curiosity
        return <PieChart size={size} className={className} />;
      case 'i3': // Mentoring
        return <Users size={size} className={className} />;
      case 'i4': // Problem Solving
        return <Lightbulb size={size} className={className} />;
      case 'i5': // Financial Empowerment
        return <TrendingUp size={size} className={className} />;
      case 'i6': // Risk Taker
        return <Anchor size={size} className={className} />;
      default:
        return <Heart size={size} className={className} />;
    }
  };

  if (!mounted) return null;

  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth font-sans text-slate-900 bg-white">
      <GameOverlay />
      <ScrollNavigation />
      
      <CaptchaModal 
        isOpen={captchaOpen}
        onClose={() => setCaptchaOpen(false)}
        onSuccess={handleCaptchaSuccess}
      />

      {/* Admin Panel (Hidden trigger by default, can be toggled manually in dev) */}
      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        data={data}
        onUpdate={handleUpdate}
      />

      {/* Hero Section */}
      <section id="hero" className="h-screen w-full snap-start relative overflow-hidden flex items-center bg-slate-900 text-white">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-3/4 h-full bg-gradient-to-l from-slate-800 to-transparent opacity-40 skew-x-12 transform translate-x-40"></div>
        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-red-600 rounded-full blur-[128px] opacity-20 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-6 w-full relative z-20">
          <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-24 justify-between">
            <div className="flex-1 text-center md:text-left space-y-8">
              <div>
                <div className="inline-block px-4 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-xs font-bold tracking-wider uppercase mb-6">
                  Available for Opportunities
                </div>
                <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-none mb-6">
                  {data.name}
                </h1>
                <p className="text-2xl md:text-4xl font-light text-slate-300">
                  {data.title}
                </p>
              </div>
              
              <div className="text-lg text-slate-400 leading-relaxed max-w-xl mx-auto md:mx-0 font-light space-y-4">
                 {data.heroBlurb.split('\n').map((p, i) => (
                   <p key={i}>{p}</p>
                 ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start pt-4">
                <button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg shadow-red-900/20 transition-all flex items-center gap-2"
                >
                  <Mail size={18} />
                  Get in Touch
                </button>
                <a 
                  href={data.pdfUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-lg backdrop-blur-sm transition-all flex items-center gap-2"
                >
                  Download CV <Download size={18} />
                </a>
                 <a 
                  href={`https://${data.contact.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-4 bg-slate-800 hover:bg-[#0077b5] border border-slate-700 hover:border-transparent text-white font-semibold rounded-lg transition-all flex items-center justify-center"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>

            {/* Profile Image */}
            <div className="relative shrink-0">
               <div className="w-64 h-64 md:w-96 md:h-96 rounded-full border-4 border-slate-800 shadow-2xl overflow-hidden relative z-10 group bg-slate-800">
                  {data.profileImage ? (
                    <img 
                      src={data.profileImage} 
                      alt={data.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 font-bold text-6xl">RG</div>
                  )}
               </div>
               {/* Decorative Ring */}
               <div className="absolute inset-0 -m-8 border border-slate-800/50 rounded-full animate-spin-slow opacity-50"></div>
               <div className="absolute inset-0 -m-4 border border-red-900/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section (White) */}
      <section id="about" className="h-screen w-full snap-start flex flex-col bg-white overflow-hidden">
         <div className="flex-1 w-full overflow-y-auto px-6 py-24 flex items-center justify-center">
           <div className="max-w-4xl mx-auto relative z-20">
              <div className="text-center mb-12">
                <span className="inline-block bg-slate-50 px-3 py-1 rounded mb-4 border border-slate-100">
                  <h2 className="text-sm font-bold tracking-widest text-red-500 uppercase">hey, nice to meet</h2>
                </span>
                
                <h3 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
                  Looking for an executive product leader with a passion for AI, data and transformative growth?
                </h3>
              </div>

              <div className="bg-slate-50/50 p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm relative group">
                {/* Decorative Quote Mark */}
                <Quote className="absolute -top-4 -left-4 text-slate-200 w-12 h-12" />
                
                <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed font-light">
                  {data.summary.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-8 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-12 flex flex-col items-end">
                   <div className="text-xl md:text-2xl font-hand text-slate-900 transform -rotate-3 hover:rotate-0 transition-transform duration-500 cursor-default">
                     Rob
                   </div>
                </div>
              </div>
           </div>
         </div>
      </section>

      {/* Experience Section (Gray) */}
      <section id="experience" className="h-screen w-full snap-start flex flex-col bg-slate-50 border-y border-slate-200 overflow-hidden">
         <div className="flex-1 w-full overflow-y-auto px-6 py-24 no-scrollbar">
           <div className="max-w-6xl mx-auto relative z-20">
             <div className="text-center mb-16">
               <div className="inline-flex items-center justify-center w-12 h-12 bg-white text-red-600 rounded-xl mb-4 shadow-sm border border-slate-100 relative z-20">
                 <BookOpen size={24} />
               </div>
               <div className="relative z-20">
                 <h2 className="text-4xl font-bold text-slate-900 mb-4 inline-block">
                    <span className="bg-slate-50/95 px-4 py-1 rounded-lg">Professional Journey</span>
                 </h2>
                 <br />
                 <p className="text-slate-500 max-w-xl mx-auto inline-block">
                   <span className="bg-slate-50/95 px-2 py-1 rounded">2 decades of experience driving product strategy and fintech innovation.</span>
                 </p>
               </div>
             </div>
             <ExperienceSection experience={data.experience} />
           </div>
         </div>
      </section>

      {/* Education & Awards (White) */}
      <section id="education" className="h-screen w-full snap-start flex flex-col bg-white overflow-hidden">
        <div className="flex-1 w-full overflow-y-auto px-6 py-24 flex items-center justify-center no-scrollbar">
          <div className="max-w-6xl mx-auto w-full relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
              
              {/* Education */}
              <div>
                 <div className="flex items-center gap-4 mb-10 border-b pb-6 bg-white/95 backdrop-blur-sm rounded-lg p-2 -ml-2">
                   <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                     <Quote size={20} />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-900">Education</h2>
                </div>
                <div className="space-y-12">
                  {data.education.map(edu => (
                    <div key={edu.id}>
                      <h3 className="text-xl font-bold text-slate-900 inline-block bg-white/95 px-2 -ml-2 rounded">{edu.degree}</h3>
                      <div className="block mt-1">
                        <p className="text-red-500 font-medium inline-block bg-white/95 px-2 -ml-2 rounded">{edu.institution}</p>
                      </div>
                      <div className="block mt-1">
                        <p className="text-slate-400 text-sm inline-block bg-white/95 px-2 -ml-2 rounded">{edu.years}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Awards */}
              <div>
                <div className="flex items-center gap-4 mb-10 border-b pb-6 bg-white/95 backdrop-blur-sm rounded-lg p-2 -ml-2">
                   <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                     <Award size={20} />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-900">Awards & Recognition</h2>
                </div>
                <div className="space-y-8">
                  {data.awards.map(award => (
                    <div key={award.id} className="flex gap-4 items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2.5 shrink-0 relative z-20"></div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 inline bg-white/95 px-1 rounded box-decoration-clone">{award.title}</h3>
                        {award.description && (
                          <div className="mt-1">
                             <p className="text-slate-500 inline bg-white/95 px-1 rounded box-decoration-clone">{award.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Principles (Dark Blue/Slate) */}
      <section id="principles" className="h-screen w-full snap-start flex flex-col bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute right-0 top-0 w-1/3 h-full bg-slate-800 opacity-20 skew-x-12"></div>
         <div className="flex-1 w-full overflow-y-auto px-6 py-24 flex items-center justify-center relative z-20 no-scrollbar">
           <div className="max-w-6xl mx-auto w-full">
              <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
                 <span className="w-12 h-1 bg-red-500 rounded-full"></span> 
                 My Key Principles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {data.principles.map(p => (
                  <div key={p.id} className="p-8 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all backdrop-blur-sm">
                    <h3 className="text-red-400 font-bold text-sm tracking-wider uppercase mb-3">{p.title}</h3>
                    <p className="text-slate-300 leading-relaxed text-lg">{p.description}</p>
                  </div>
                ))}
              </div>
           </div>
         </div>
      </section>

      {/* Interests (Light Gray/White) */}
      <section id="interests" className="h-screen w-full snap-start flex flex-col bg-slate-50 border-t border-slate-200 overflow-hidden">
         <div className="flex-1 w-full overflow-y-auto px-6 py-24 flex items-center justify-center no-scrollbar">
           <div className="max-w-6xl mx-auto w-full relative z-20">
              <div className="flex items-center gap-4 mb-12">
                 <div className="p-3 bg-red-100 rounded-lg text-red-600 shadow-sm relative z-20 bg-white">
                   <Heart size={24} />
                 </div>
                 <h2 className="text-3xl font-bold text-slate-900 inline-block">
                    <span className="bg-slate-50/95 px-2 py-1 rounded">Personal & Professional Interests</span>
                 </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.interests.map(i => (
                  <div key={i.id} className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative z-20">
                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                      {renderInterestIcon(i.id)}
                    </div>
                    <h3 className="font-bold text-slate-900 tracking-wide mb-2">{i.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{i.description}</p>
                  </div>
                ))}
              </div>
           </div>
         </div>
      </section>

      {/* Contact & Footer Section (Very Dark) */}
      <section id="contact" className="h-screen w-full snap-start flex flex-col bg-slate-950 text-white border-t border-slate-900 overflow-hidden">
         <div className="flex-1 w-full overflow-y-auto px-6 py-24 flex items-center justify-center no-scrollbar">
           <div className="max-w-4xl mx-auto w-full relative z-20">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-6">Let's Connect</h2>
                <p className="text-slate-400 text-lg">
                  Interested in working together? Drop me a message.
                </p>
              </div>

              <div className="flex flex-col items-center gap-8 relative z-20">
                 <button 
                   onClick={() => initiateAction('send')}
                   className="group px-12 py-6 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-3 text-xl shadow-2xl hover:scale-105"
                 >
                   <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                   Send Message
                 </button>
                 
                 <div className="flex gap-4 mt-8">
                    <button 
                      onClick={() => initiateAction('download')}
                      className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-all shadow-lg shadow-red-900/20"
                    >
                      <Download size={18} /> Download CV
                    </button>
                    <a 
                      href={`https://${data.contact.linkedin}`}
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-[#0077b5] text-white font-medium rounded-full transition-all border border-slate-700 hover:border-[#0077b5]"
                    >
                      <Linkedin size={18} /> Connect on LinkedIn
                    </a>
                 </div>
                 
                 <p className="text-slate-600 text-sm mt-12">
                   © {new Date().getFullYear()} {data.name}. All rights reserved.
                 </p>
              </div>
           </div>
         </div>
      </section>
    </div>
  );
};

export default App;