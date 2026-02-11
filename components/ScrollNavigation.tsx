import React, { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'principles', label: 'Principles' },
  { id: 'interests', label: 'Interests' },
  { id: 'contact', label: 'Contact' },
];

const ScrollNavigation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 } // Trigger when 40% of section is visible
    );

    SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-end gap-4">
      {SECTIONS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          className="group flex items-center gap-4 py-1"
          aria-label={`Scroll to ${label}`}
        >
          <span className={`
            text-xs font-bold uppercase tracking-wider transition-all duration-300
            ${activeSection === id ? 'text-red-500 opacity-100 translate-x-0' : 'text-slate-400 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'}
          `}>
            {label}
          </span>
          <div className={`
            w-3 h-3 rounded-full transition-all duration-300 border-2
            ${activeSection === id 
              ? 'bg-red-500 border-red-500 scale-125' 
              : 'bg-transparent border-slate-300 group-hover:border-red-400'}
          `} />
        </button>
      ))}
    </nav>
  );
};

export default ScrollNavigation;