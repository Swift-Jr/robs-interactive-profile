import React, { useState, useMemo } from 'react';
import { ExperienceItem } from '../types';
import { MapPin, Calendar, Filter } from 'lucide-react';

interface ExperienceSectionProps {
  experience: ExperienceItem[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience }) => {
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // Deduplicate tags case-insensitively and sort
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    experience.forEach(exp => {
      exp.tags?.forEach(t => tagsSet.add(t.toUpperCase()));
    });
    return Array.from(tagsSet).sort();
  }, [experience]);

  // Inclusive OR filter: show role if it matches ANY of the selected tags
  const filteredExperience = experience.filter(exp => {
    if (activeTags.length === 0) return true;
    return exp.tags?.some(tag => activeTags.includes(tag.toUpperCase()));
  });

  const toggleTag = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="max-w-5xl mx-auto relative z-20">
      
      {/* Filters Cloud */}
      <div className="mb-12 space-y-4 px-4">
        <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="mt-1.5 p-2 bg-slate-50 rounded-lg text-slate-400 shrink-0">
            <Filter size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                Filter Experience
                {activeTags.length > 0 && (
                  <span className="bg-red-50 text-red-500 px-2 py-0.5 rounded text-[10px] lowercase tracking-normal font-medium">
                    {activeTags.length} active
                  </span>
                )}
              </h5>
              {activeTags.length > 0 && (
                <button 
                  onClick={() => setActiveTags([])}
                  className="text-[10px] text-red-500 hover:underline font-bold"
                >
                  Clear all
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                    activeTags.includes(tag)
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                      : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-0.5 bg-slate-200 -ml-[0.5px] hidden md:block" />

        {filteredExperience.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-dashed border-slate-300 mx-4">
            <p>No roles match your selected filters.</p>
            <button onClick={() => setActiveTags([])} className="text-red-500 font-bold mt-2 hover:underline">Reset Filters</button>
          </div>
        ) : (
          filteredExperience.map((exp, index) => (
            <div key={exp.id} className={`relative mb-16 flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="absolute left-8 md:left-1/2 top-8 w-4 h-4 bg-white rounded-full border-4 border-red-500 z-10 shadow-sm -ml-2 hidden md:block" />
              <div className="hidden md:block md:w-1/2" />
              <div className={`px-4 md:px-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative z-20">
                  <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                    <div className="flex flex-wrap gap-2 mb-3">
                       {exp.tags?.map((tag, i) => (
                         <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600">{tag}</span>
                       ))}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold tracking-wider text-red-500 uppercase mb-1">{exp.company}</h3>
                      <h4 className="text-xl font-bold text-slate-900 leading-tight">{exp.role}</h4>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-400 mt-3">
                       <div className="flex items-center gap-1.5"><Calendar size={12} /><span>{exp.startDate} — {exp.endDate}</span></div>
                       <div className="flex items-center gap-1.5"><MapPin size={12} /><span>{exp.location}</span></div>
                     </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <p className="text-slate-600 leading-relaxed text-sm">{exp.description}</p>
                    {exp.highlights.length > 0 && (
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Key Achievements
                        </h5>
                        <ul className="space-y-3">
                          {exp.highlights.map((item, i) => (
                            <li key={i} className="flex gap-3 text-slate-700 text-xs leading-relaxed items-start group/item">
                               <span className="text-slate-300 font-serif text-lg leading-none mt-[-2px] group-hover/item:text-red-500 transition-colors">›</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {exp.skills && exp.skills.length > 0 && (
                      <div className="pt-4 border-t border-slate-50">
                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Key Projects</h5>
                        <div className="flex flex-wrap gap-2">
                          {exp.skills.map((skill, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 text-[10px] font-bold hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors cursor-default">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExperienceSection;
