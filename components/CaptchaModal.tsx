import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, RefreshCw } from 'lucide-react';

interface CaptchaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CaptchaModal: React.FC<CaptchaModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState(false);

  const generateProblem = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setUserAnswer('');
    setError(false);
  };

  useEffect(() => {
    if (isOpen) {
      generateProblem();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sum = num1 + num2;
    // Allow a small bit of fuzziness? No, math is exact.
    if (parseInt(userAnswer) === sum) {
      onSuccess();
      onClose();
    } else {
      setError(true);
      setUserAnswer('');
      // Generate new problem on failure to prevent brute forcing one static problem
      generateProblem();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative z-10 animate-in zoom-in-95 duration-200 border border-slate-100">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-slate-50 text-slate-900 rounded-full flex items-center justify-center mb-5 shadow-sm border border-slate-100">
            <ShieldCheck size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Security Check</h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            To prevent automated requests, please solve this quick problem.
          </p>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="bg-slate-50 rounded-xl p-6 mb-6 border border-slate-100 relative">
              <div className="flex items-center justify-center gap-4 text-3xl font-bold text-slate-800 font-mono">
                <span>{num1}</span>
                <span className="text-slate-400">+</span>
                <span>{num2}</span>
                <span className="text-slate-400">=</span>
                <input 
                  type="number" 
                  autoFocus
                  className={`w-20 text-center p-2 border-2 rounded-lg outline-none focus:ring-4 transition-all ${
                    error 
                      ? 'border-red-300 focus:ring-red-100 bg-white text-red-600' 
                      : 'border-slate-200 focus:border-slate-900 focus:ring-slate-100 bg-white'
                  }`}
                  placeholder="?"
                  value={userAnswer}
                  onChange={(e) => {
                    setError(false);
                    setUserAnswer(e.target.value);
                  }}
                />
              </div>
              <button 
                type="button" 
                onClick={generateProblem}
                className="absolute top-2 right-2 text-slate-300 hover:text-slate-500 p-1"
                title="New Problem"
              >
                <RefreshCw size={14} />
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 text-red-600 text-xs py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-2 animate-pulse">
                <X size={12} /> Incorrect answer, try again.
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all transform active:scale-95 shadow-lg shadow-slate-900/20"
            >
              Verify & Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CaptchaModal;