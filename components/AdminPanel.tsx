import React, { useState } from 'react';
import { CVData, ExperienceItem } from '../types';
import { X, Save, Wand2, Plus, Trash2 } from 'lucide-react';
import { improveTextWithAI } from '../services/geminiService';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data: CVData;
  onUpdate: (newData: CVData) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, data, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'experience' | 'other'>('profile');
  const [isImproving, setIsImproving] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImprove = async (fieldId: string, text: string, context: string, updateCb: (newText: string) => void) => {
    setIsImproving(fieldId);
    const improved = await improveTextWithAI(text, context);
    updateCb(improved);
    setIsImproving(null);
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: any) => {
    const newExp = data.experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onUpdate({ ...data, experience: newExp });
  };

  const updateHighlight = (expId: string, idx: number, value: string) => {
    const newExp = data.experience.map(exp => {
      if (exp.id === expId) {
        const newHighlights = [...exp.highlights];
        newHighlights[idx] = value;
        return { ...exp, highlights: newHighlights };
      }
      return exp;
    });
    onUpdate({ ...data, experience: newExp });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-900 text-white">
          <h2 className="text-xl font-bold">Content Manager</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-slate-50">
          {(['profile', 'experience', 'other'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium uppercase tracking-wider ${
                activeTab === tab 
                  ? 'border-b-2 border-slate-900 text-slate-900 bg-white' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50">
          
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
                <h3 className="font-semibold text-slate-900">Basic Info</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                  <input 
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-slate-900 outline-none"
                    value={data.name}
                    onChange={(e) => onUpdate({ ...data, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tagline</label>
                  <input 
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-slate-900 outline-none"
                    value={data.title}
                    onChange={(e) => onUpdate({ ...data, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Profile Image URL</label>
                  <input 
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-slate-900 outline-none"
                    value={data.profileImage || ''}
                    placeholder="https://..."
                    onChange={(e) => onUpdate({ ...data, profileImage: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Downloadable CV URL (PDF)</label>
                  <input 
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-slate-900 outline-none text-sm"
                    value={data.pdfUrl || ''}
                    placeholder="https://example.com/my-cv.pdf"
                    onChange={(e) => onUpdate({ ...data, pdfUrl: e.target.value })}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">If left empty, the download button will print this page as PDF.</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-slate-900">Hero Pitch</h3>
                  <button 
                    onClick={() => handleImprove('heroBlurb', data.heroBlurb, 'High impact professional elevator pitch', (t) => onUpdate({ ...data, heroBlurb: t }))}
                    className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-purple-200 transition-colors"
                  >
                    {isImproving === 'heroBlurb' ? <span className="animate-spin">⌛</span> : <Wand2 size={12} />}
                    AI Improve
                  </button>
                </div>
                <textarea 
                  className="w-full p-3 border rounded h-32 focus:ring-2 focus:ring-slate-900 outline-none text-sm leading-relaxed"
                  value={data.heroBlurb}
                  onChange={(e) => onUpdate({ ...data, heroBlurb: e.target.value })}
                />
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-slate-900">Note From Me (Summary)</h3>
                  <button 
                    onClick={() => handleImprove('summary', data.summary, 'Professional Summary', (t) => onUpdate({ ...data, summary: t }))}
                    className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-purple-200 transition-colors"
                  >
                    {isImproving === 'summary' ? <span className="animate-spin">⌛</span> : <Wand2 size={12} />}
                    AI Improve
                  </button>
                </div>
                <textarea 
                  className="w-full p-3 border rounded h-40 focus:ring-2 focus:ring-slate-900 outline-none text-sm leading-relaxed"
                  value={data.summary}
                  onChange={(e) => onUpdate({ ...data, summary: e.target.value })}
                />
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
                <h3 className="font-semibold text-slate-900">Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    className="p-2 border rounded text-sm"
                    placeholder="Phone"
                    value={data.contact.phone}
                    onChange={(e) => onUpdate({ ...data, contact: { ...data.contact, phone: e.target.value } })}
                  />
                  <input 
                    className="p-2 border rounded text-sm"
                    placeholder="Email"
                    value={data.contact.email}
                    onChange={(e) => onUpdate({ ...data, contact: { ...data.contact, email: e.target.value } })}
                  />
                  <input 
                    className="p-2 border rounded text-sm col-span-2"
                    placeholder="LinkedIn"
                    value={data.contact.linkedin}
                    onChange={(e) => onUpdate({ ...data, contact: { ...data.contact, linkedin: e.target.value } })}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-6">
              {data.experience.map((exp, idx) => (
                <div key={exp.id} className="bg-white p-4 rounded-lg shadow-sm border border-l-4 border-l-slate-900">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input 
                      className="font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-slate-900 outline-none"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    />
                    <input 
                      className="text-right text-xs font-mono text-slate-500 border-b border-transparent hover:border-slate-300 focus:border-slate-900 outline-none"
                      value={`${exp.startDate} — ${exp.endDate}`}
                      onChange={(e) => {
                         const parts = e.target.value.split('—').map(s => s.trim());
                         if (parts.length === 2) {
                           updateExperience(exp.id, 'startDate', parts[0]);
                           updateExperience(exp.id, 'endDate', parts[1]);
                         }
                      }}
                    />
                    <input 
                      className="text-sm font-medium text-slate-700 col-span-2 border-b border-transparent hover:border-slate-300 focus:border-slate-900 outline-none"
                      value={exp.role}
                      onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Company Tags (comma sep)</label>
                      <input 
                        className="w-full p-2 border rounded text-xs"
                        value={exp.tags?.join(', ') || ''}
                        onChange={(e) => updateExperience(exp.id, 'tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Skills (comma sep)</label>
                      <input 
                        className="w-full p-2 border rounded text-xs"
                        value={exp.skills?.join(', ') || ''}
                        onChange={(e) => updateExperience(exp.id, 'skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                     <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Role Description</label>
                      <button 
                        onClick={() => handleImprove(`exp-desc-${exp.id}`, exp.description, `Job Description for ${exp.role} at ${exp.company}`, (t) => updateExperience(exp.id, 'description', t))}
                        className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1"
                      >
                         {isImproving === `exp-desc-${exp.id}` ? <span className="animate-spin">⌛</span> : <Wand2 size={10} />}
                        AI
                      </button>
                    </div>
                    <textarea 
                      className="w-full p-2 bg-slate-50 border rounded text-sm h-24 focus:bg-white transition-colors"
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Key Achievements</label>
                    {exp.highlights.map((h, hIdx) => (
                       <div key={hIdx} className="flex gap-2">
                          <textarea 
                            className="flex-1 p-2 text-sm border rounded bg-slate-50 focus:bg-white h-20"
                            value={h}
                            onChange={(e) => updateHighlight(exp.id, hIdx, e.target.value)}
                          />
                          <button 
                            className="text-slate-300 hover:text-red-500"
                            onClick={() => {
                              const newHighlights = exp.highlights.filter((_, i) => i !== hIdx);
                              updateExperience(exp.id, 'highlights', newHighlights);
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                       </div>
                    ))}
                    <button 
                      className="text-xs flex items-center gap-1 text-slate-500 hover:text-slate-900 font-medium mt-2"
                      onClick={() => updateExperience(exp.id, 'highlights', [...exp.highlights, "New achievement..."])}
                    >
                      <Plus size={14} /> Add Achievement
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'other' && (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="font-semibold text-slate-900 mb-4">Principles</h3>
                <div className="space-y-4">
                  {data.principles.map(p => (
                    <div key={p.id} className="border-b last:border-0 pb-4 last:pb-0">
                      <input 
                        className="font-bold text-sm text-slate-800 w-full mb-1 outline-none"
                        value={p.title}
                        onChange={(e) => {
                          const newPrinciples = data.principles.map(item => item.id === p.id ? {...item, title: e.target.value} : item);
                          onUpdate({...data, principles: newPrinciples});
                        }}
                      />
                      <textarea 
                        className="w-full text-sm text-slate-600 bg-slate-50 p-2 rounded"
                        value={p.description}
                        onChange={(e) => {
                          const newPrinciples = data.principles.map(item => item.id === p.id ? {...item, description: e.target.value} : item);
                          onUpdate({...data, principles: newPrinciples});
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

               <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="font-semibold text-slate-900 mb-4">Interests</h3>
                 <div className="space-y-4">
                  {data.interests.map(i => (
                    <div key={i.id} className="border-b last:border-0 pb-4 last:pb-0">
                      <input 
                        className="font-bold text-sm text-slate-800 w-full mb-1 outline-none"
                        value={i.title}
                        onChange={(e) => {
                          const newInterests = data.interests.map(item => item.id === i.id ? {...item, title: e.target.value} : item);
                          onUpdate({...data, interests: newInterests});
                        }}
                      />
                      <textarea 
                        className="w-full text-sm text-slate-600 bg-slate-50 p-2 rounded"
                        value={i.description}
                        onChange={(e) => {
                          const newInterests = data.interests.map(item => item.id === i.id ? {...item, description: e.target.value} : item);
                          onUpdate({...data, interests: newInterests});
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
          <button onClick={onClose} className="px-6 py-2 bg-slate-900 text-white font-medium rounded hover:bg-slate-800 flex items-center gap-2">
            <Save size={18} /> Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;