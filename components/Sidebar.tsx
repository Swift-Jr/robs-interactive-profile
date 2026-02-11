import React from 'react';
import { Menu, X, Linkedin, Mail, Phone } from 'lucide-react';
import { ContactInfo } from '../types';

interface SidebarProps {
  contact: ContactInfo;
}

const Sidebar: React.FC<SidebarProps> = ({ contact }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const links = [
    { id: 'summary', label: 'Summary' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'awards', label: 'Awards' },
    { id: 'other', label: 'Principles & Interests' },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="fixed top-4 right-4 z-40 p-2 bg-slate-900 text-white rounded-full lg:hidden shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col z-30 transition-transform duration-300
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 pb-4">
          <div className="w-12 h-12 bg-red-500 flex items-center justify-center rounded-br-2xl mb-6">
            <span className="text-white font-bold text-xl tracking-tighter">RG</span>
          </div>
          <h1 className="text-white font-bold text-xl leading-tight">Robert<br/>Guard</h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {links.map(link => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="w-full text-left px-4 py-3 text-sm font-medium rounded-lg hover:bg-white/10 transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-slate-800 space-y-4 text-sm">
          <a href={`mailto:${contact.email}`} className="flex items-center gap-3 hover:text-white transition-colors">
            <Mail size={16} />
            <span className="truncate">{contact.email}</span>
          </a>
          <a href={`tel:${contact.phone}`} className="flex items-center gap-3 hover:text-white transition-colors">
            <Phone size={16} />
            <span>{contact.phone}</span>
          </a>
          <a href={`https://${contact.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-white transition-colors">
            <Linkedin size={16} />
            <span className="truncate">LinkedIn</span>
          </a>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
