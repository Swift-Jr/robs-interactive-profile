import React, { useRef, useEffect, useState, useCallback } from 'react';
import { X, RotateCcw, Trophy, Volume2, VolumeX } from 'lucide-react';

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'solid' | 'hollow';
  color: string;
}

interface Line {
  p1: number; // Index of dot 1
  p2: number; // Index of dot 2
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

interface GameState {
  status: 'idle' | 'playing' | 'gameover';
  score: number;
  userHighScores: number[];
}

const GameOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // BGM Refs
  const bgmGainRef = useRef<GainNode | null>(null);
  const bgmNoteIndexRef = useRef(0);
  const nextNoteTimeRef = useRef(0);
  const bgmTimerRef = useRef<number | null>(null);
  const isBgmPlayingRef = useRef(false);

  const [gameState, setGameState] = useState<GameState>(() => {
    let savedScores: number[] = [];
    try {
      const saved = localStorage.getItem('game_highscores');
      if (saved) {
        savedScores = JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load high scores", e);
    }
    return {
      status: 'idle',
      score: 0,
      userHighScores: savedScores
    };
  });
  
  // Game data refs to avoid re-renders during loop
  const dotsRef = useRef<Dot[]>([]);
  const linesRef = useRef<Line[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const selectedDotRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const globalAlphaRef = useRef(0.15);

  // Initialize Audio Context lazily
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        audioCtxRef.current = new AudioContext();
        // Master BGM Gain
        const bgmGain = audioCtxRef.current.createGain();
        bgmGain.gain.value = 0.05; // Very low volume background
        bgmGain.connect(audioCtxRef.current.destination);
        bgmGainRef.current = bgmGain;
      }
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume().catch(e => console.error(e));
    }
    return audioCtxRef.current;
  };

  // --- Sound Effects ---

  const playSound = (type: 'connect' | 'start' | 'gameover', data?: number, targetDot?: Dot) => {
    if (isMuted) return;
    const ctx = initAudio();
    if (!ctx) return;

    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    const osc = ctx.createOscillator();
    
    gainNode.connect(ctx.destination);
    osc.connect(gainNode);

    if (type === 'connect') {
      const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C4, D4, E4, G4, A4, C5
      const sequenceIndex = (data || 0);
      const baseNote = notes[sequenceIndex % notes.length];
      const octave = Math.floor(sequenceIndex / notes.length);
      const frequency = baseNote * Math.pow(2, octave * 0.5); 

      osc.frequency.setValueAtTime(frequency, now);

      if (targetDot?.color === '#ef4444') {
        osc.type = 'sawtooth';
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.08, now + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      } else if (targetDot?.type === 'hollow') {
        osc.type = 'square';
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.05, now + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      } else {
        osc.type = 'sine';
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      }
      
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'start') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(440, now + 0.1);
      osc.frequency.linearRampToValueAtTime(880, now + 0.2);
      
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.linearRampToValueAtTime(0.1, now + 0.2);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
      
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'gameover') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);
      
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      
      osc.start(now);
      osc.stop(now + 0.5);
    }
  };

  // --- Background Music Scheduler ---

  const scheduleNote = (noteFreq: number, time: number, duration: number) => {
    if (!bgmGainRef.current || !audioCtxRef.current) return;
    
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    
    osc.type = 'triangle'; 
    osc.frequency.value = noteFreq;
    
    osc.connect(gain);
    gain.connect(bgmGainRef.current);
    
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.4, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
    
    osc.start(time);
    osc.stop(time + duration);
  };

  const bgmLoop = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx || !isBgmPlayingRef.current) return;

    const melody = [130.81, 164.81, 196.00, 220.00, 233.08, 220.00, 196.00, 164.81];
    
    const tempo = 200; 
    const secondsPerBeat = 60.0 / tempo;
    const lookahead = 25.0; 
    const scheduleAheadTime = 0.1; 

    while (nextNoteTimeRef.current < ctx.currentTime + scheduleAheadTime) {
      const freq = melody[bgmNoteIndexRef.current % melody.length];
      scheduleNote(freq, nextNoteTimeRef.current, secondsPerBeat * 0.8);
      nextNoteTimeRef.current += secondsPerBeat;
      bgmNoteIndexRef.current++;
    }

    bgmTimerRef.current = window.setTimeout(bgmLoop, lookahead);
  }, []);

  const startBGM = useCallback(() => {
    const ctx = initAudio();
    if (!ctx || isBgmPlayingRef.current) return;
    
    isBgmPlayingRef.current = true;
    bgmNoteIndexRef.current = 0;
    nextNoteTimeRef.current = ctx.currentTime + 0.05;
    bgmLoop();
  }, [bgmLoop]);

  const stopBGM = useCallback(() => {
    isBgmPlayingRef.current = false;
    if (bgmTimerRef.current) {
      clearTimeout(bgmTimerRef.current);
      bgmTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (gameState.status === 'playing' && !isMuted) {
      startBGM();
    } else {
      stopBGM();
    }
    return () => stopBGM();
  }, [gameState.status, isMuted, startBGM, stopBGM]);

  const initDots = (width: number, height: number) => {
    const dotCount = Math.floor((width * height) / 15000); 
    const newDots: Dot[] = [];
    for (let i = 0; i < dotCount; i++) {
      newDots.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8, 
        vy: (Math.random() - 0.5) * 0.8,
        radius: 2 + Math.random() * 10,
        type: Math.random() > 0.6 ? 'hollow' : 'solid',
        color: Math.random() > 0.9 ? '#ef4444' : '#475569' 
      });
    }
    dotsRef.current = newDots;
  };

  const getIntersection = (p1: Dot, p2: Dot, p3: Dot, p4: Dot) => {
    const det = (p2.x - p1.x) * (p4.y - p3.y) - (p4.x - p3.x) * (p2.y - p1.y);
    if (det === 0) return false;
    const lambda = ((p4.y - p3.y) * (p4.x - p1.x) + (p3.x - p4.x) * (p4.y - p1.y)) / det;
    const gamma = ((p1.y - p2.y) * (p4.x - p1.x) + (p2.x - p1.x) * (p4.y - p1.y)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  };

  const createRipple = (x: number, y: number) => {
    ripplesRef.current.push({
      x,
      y,
      radius: 0,
      maxRadius: 100,
      alpha: 0.5
    });
  };

  const startGame = () => {
    setGameState(prev => ({ ...prev, status: 'playing', score: 0 }));
    linesRef.current = [];
    selectedDotRef.current = null;
    playSound('start');
  };

  const endGame = () => {
    playSound('gameover');
    setGameState(prev => {
      const newUserScores = [...prev.userHighScores, prev.score]
        .sort((a, b) => b - a)
        .slice(0, 10);
      localStorage.setItem('game_highscores', JSON.stringify(newUserScores));
      return { ...prev, status: 'gameover', userHighScores: newUserScores };
    });
  };

  const resetGame = () => {
    linesRef.current = [];
    selectedDotRef.current = null;
    setGameState(prev => ({ ...prev, status: 'idle', score: 0 }));
  };

  const playAgain = () => {
    linesRef.current = [];
    selectedDotRef.current = null;
    setGameState(prev => ({ ...prev, status: 'playing', score: 0 }));
    playSound('start');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (dotsRef.current.length === 0) {
        initDots(canvas.width, canvas.height);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const isPlaying = gameState.status === 'playing';
      const isIdle = gameState.status === 'idle';

      // Global Alpha interpolation for idle fade
      if (isIdle) {
        const anyDotHovered = dotsRef.current.some(dot => 
          Math.hypot(dot.x - mouseRef.current.x, dot.y - mouseRef.current.y) < dot.radius + 15
        );
        const targetAlpha = anyDotHovered ? 1.0 : 0.15;
        // Smoothly nudge globalAlphaRef towards targetAlpha
        globalAlphaRef.current += (targetAlpha - globalAlphaRef.current) * 0.1;
      } else {
        globalAlphaRef.current = 1.0;
      }

      // Draw Ripples
      ripplesRef.current = ripplesRef.current.filter(ripple => {
        ripple.radius += 2.5;
        ripple.alpha -= 0.015;
        if (ripple.alpha <= 0) return false;

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(239, 68, 68, ${ripple.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        return true;
      });

      // Update positions & Draw Dots
      dotsRef.current.forEach((dot, index) => {
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        
        const isHovered = Math.hypot(dot.x - mouseRef.current.x, dot.y - mouseRef.current.y) < dot.radius + 10;
        const isSelected = selectedDotRef.current === index;

        ctx.globalAlpha = globalAlphaRef.current;
        
        if (isPlaying) {
          ctx.fillStyle = isSelected ? '#ef4444' : (isHovered ? '#f87171' : dot.color);
          ctx.strokeStyle = isSelected ? '#ef4444' : (isHovered ? '#f87171' : dot.color);
        } else {
           ctx.fillStyle = isHovered ? '#ef4444' : dot.color;
           ctx.strokeStyle = isHovered ? '#ef4444' : dot.color;
        }

        if (dot.type === 'solid' || isHovered || isSelected) {
          ctx.fill();
        } else {
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.globalAlpha = 1.0; 
      });

      // Draw Lines
      if (linesRef.current.length > 0) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ef4444';
        ctx.beginPath();
        linesRef.current.forEach(line => {
          const d1 = dotsRef.current[line.p1];
          const d2 = dotsRef.current[line.p2];
          ctx.moveTo(d1.x, d1.y);
          ctx.lineTo(d2.x, d2.y);
        });
        ctx.stroke();
      }

      if (isPlaying && selectedDotRef.current !== null) {
        const startDot = dotsRef.current[selectedDotRef.current];
        ctx.beginPath();
        ctx.strokeStyle = '#ef4444';
        ctx.setLineDash([5, 5]);
        ctx.moveTo(startDot.x, startDot.y);
        ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      if (isPlaying) {
        let collision = false;
        const lines = linesRef.current;
        for (let i = 0; i < lines.length; i++) {
          for (let j = i + 1; j < lines.length; j++) {
            const l1 = lines[i];
            const l2 = lines[j];
            if (l1.p1 === l2.p1 || l1.p1 === l2.p2 || l1.p2 === l2.p1 || l1.p2 === l2.p2) continue;
            
            if (getIntersection(
              dotsRef.current[l1.p1], dotsRef.current[l1.p2],
              dotsRef.current[l2.p1], dotsRef.current[l2.p2]
            )) {
              collision = true;
              break;
            }
          }
          if (collision) break;
        }
        if (collision) {
          endGame();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState.status]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (gameState.status === 'idle') {
        const isOverDot = dotsRef.current.some(dot => 
          Math.hypot(dot.x - e.clientX, dot.y - e.clientY) < dot.radius + 15
        );
        document.body.style.cursor = isOverDot ? 'pointer' : 'default';
      }
    };

    const handleClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;

      const clickedDotIndex = dotsRef.current.findIndex(dot => 
        Math.hypot(dot.x - clickX, dot.y - clickY) < dot.radius + 15
      );

      if (clickedDotIndex !== -1) {
        createRipple(dotsRef.current[clickedDotIndex].x, dotsRef.current[clickedDotIndex].y);
      }

      if (gameState.status === 'idle') {
        const target = e.target as HTMLElement;
        const isInteractive = target.closest('button, a, input, textarea, select, [role="button"]');
        if (isInteractive) return;

        if (clickedDotIndex !== -1) {
          e.preventDefault();
          e.stopPropagation();
          startGame();
          selectedDotRef.current = clickedDotIndex; 
        }
      } else if (gameState.status === 'playing') {
        if (clickedDotIndex !== -1) {
          const currentSelected = selectedDotRef.current;
          
          if (currentSelected === null) {
            selectedDotRef.current = clickedDotIndex;
          } else if (currentSelected !== clickedDotIndex) {
            const exists = linesRef.current.some(l => 
              (l.p1 === currentSelected && l.p2 === clickedDotIndex) ||
              (l.p1 === clickedDotIndex && l.p2 === currentSelected)
            );

            if (!exists) {
              linesRef.current.push({ p1: currentSelected, p2: clickedDotIndex });
              const connectionsCount = linesRef.current.length;
              const targetDot = dotsRef.current[clickedDotIndex];
              playSound('connect', connectionsCount, targetDot);
              const existingConnections = linesRef.current.filter(l => l.p1 === clickedDotIndex || l.p2 === clickedDotIndex).length;
              setGameState(prev => ({ ...prev, score: prev.score + (10 * existingConnections) }));
              selectedDotRef.current = clickedDotIndex; 
            } else {
              selectedDotRef.current = null;
            }
          }
        } else {
          selectedDotRef.current = null;
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick, { capture: true }); 

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick, { capture: true });
      document.body.style.cursor = 'default';
    };
  }, [gameState.status, isMuted]);

  const leaderboardData = [
    { name: "Rob's Top Score", score: 180, isRob: true },
    ...gameState.userHighScores.map(score => ({ name: 'You', score, isRob: false }))
  ]
  .sort((a, b) => b.score - a.score)
  .slice(0, 5);

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 transition-colors duration-700 ${
        gameState.status !== 'idle' 
          ? 'z-50 bg-slate-900/95 pointer-events-auto cursor-pointer' 
          : 'z-10 pointer-events-none'
      }`}
    >
      <canvas 
        ref={canvasRef}
        className="block w-full h-full"
      />
      
      {gameState.status === 'idle' && (
        <div className="absolute bottom-6 left-6 pointer-events-none opacity-40 rotate-[-2deg]">
          <p className="font-hand text-sm text-slate-500">Join 2 dots to start playing...</p>
        </div>
      )}

      <div className={`absolute top-6 right-16 z-50 pointer-events-auto ${gameState.status === 'idle' ? 'opacity-30 hover:opacity-100' : 'opacity-100'}`}>
         <button 
           onClick={() => setIsMuted(!isMuted)}
           className="p-2 text-white/50 hover:text-white transition-colors"
           title={isMuted ? "Unmute" : "Mute"}
         >
           {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
         </button>
      </div>

      {gameState.status === 'playing' && (
        <>
          <div className="absolute top-6 left-6 font-hand text-red-500 text-3xl font-bold animate-pulse">
            Score: {gameState.score.toLocaleString()} 1P
          </div>
          <button 
            onClick={resetGame}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </>
      )}

      {gameState.status === 'gameover' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center transform scale-100 animate-in fade-in zoom-in duration-300">
            <h2 className="text-3xl font-hand font-bold text-slate-900 mb-2">Game Over!</h2>
            <div className="text-6xl font-bold text-red-600 mb-6">{gameState.score}</div>
            
            <div className="mb-8 text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                <Trophy size={14} /> Leaderboard
              </h3>
              <div className="space-y-2">
                {leaderboardData.map((item, index) => (
                  <div key={index} className={`flex justify-between text-sm font-medium ${item.isRob ? 'text-red-500 font-bold' : 'text-slate-900'}`}>
                    <span className={item.isRob ? 'text-red-500' : 'text-slate-500'}>
                      {index + 1}. {item.name}
                    </span>
                    <span>{item.score}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={resetGame}
                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Exit
              </button>
              <button 
                onClick={playAgain}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} /> Retry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameOverlay;