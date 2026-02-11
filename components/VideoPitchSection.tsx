import React, { useState } from 'react';
import { Play, Loader2, Video as VideoIcon, RefreshCw } from 'lucide-react';
import { generateProfileVideo } from '../services/geminiService';
import { CVData } from '../types';

interface VideoPitchSectionProps {
  data: CVData;
  onVideoGenerated: (url: string) => void;
}

const VideoPitchSection: React.FC<VideoPitchSectionProps> = ({ data, onVideoGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = await generateProfileVideo(data);
      if (url) {
        onVideoGenerated(url);
      } else {
        setError("Cancelled or failed to generate.");
      }
    } catch (e) {
      setError("Failed to generate video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
      <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3 text-white">
          <div className="bg-red-600 p-2 rounded-lg">
            <VideoIcon size={24} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-none">AI Video Pitch</h2>
            <p className="text-slate-400 text-xs mt-1">Powered by Veo 3.1</p>
          </div>
        </div>
        
        {!loading && data.videoUrl && (
          <button 
            onClick={handleGenerate}
            className="text-xs flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw size={14} /> Regenerate
          </button>
        )}
      </div>

      <div className="bg-black/40 min-h-[300px] md:min-h-[400px] flex items-center justify-center relative group">
        
        {loading ? (
          <div className="text-center px-4">
            <Loader2 className="animate-spin text-red-500 w-12 h-12 mx-auto mb-4" />
            <p className="text-white font-medium">Creating your cinematic video pitch...</p>
            <p className="text-slate-400 text-sm mt-2">This usually takes about a minute.</p>
          </div>
        ) : data.videoUrl ? (
          <video 
            src={data.videoUrl} 
            controls 
            className="w-full h-full max-h-[600px] object-contain"
            autoPlay
            loop
          />
        ) : (
          <div className="text-center px-6 py-12">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Play className="text-slate-400 fill-current ml-1" size={32} />
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Generate Video Introduction</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Create a custom 20-second professional video intro based on your CV profile using Google's Veo AI model.
            </p>
            <button 
              onClick={handleGenerate}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-red-900/20 transition-all transform hover:-translate-y-1"
            >
              Generate Video
            </button>
            {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPitchSection;
