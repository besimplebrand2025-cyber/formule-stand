import React from 'react';

interface FirstImexLogoProps {
  variant?: 'banner' | 'navbar' | 'compact' | 'badge';
  customLogoUrl?: string;
  className?: string;
}

export const FirstImexLogo: React.FC<FirstImexLogoProps> = ({
  variant = 'navbar',
  customLogoUrl,
  className = ''
}) => {
  // If user uploaded a custom logo image file
  if (customLogoUrl) {
    return (
      <img
        src={customLogoUrl}
        alt="Logo FIRST IMEX"
        className={`object-contain ${className || (variant === 'banner' ? 'max-h-24' : 'h-10')}`}
      />
    );
  }

  // Full Brand Banner (Faithful reproduction of user uploaded image first_imex_cover.jfif)
  if (variant === 'banner') {
    return (
      <div 
        className={`w-full max-w-2xl mx-auto rounded-2xl p-6 sm:p-8 text-center shadow-md relative overflow-hidden select-none ${className}`}
        style={{ backgroundColor: '#17436b' }}
      >
        {/* Subtle engineering line grid texture */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 flex flex-col items-center">
          {/* Outlined Brand Box with FIRST IMEX */}
          <div className="border-[3px] border-white rounded-xl px-6 sm:px-12 py-3 sm:py-4 shadow-sm inline-block">
            <h1 
              className="text-white font-extrabold tracking-[0.22em] text-2xl sm:text-4xl uppercase"
              style={{ fontFamily: "'Orbitron', 'Plus Jakarta Sans', sans-serif" }}
            >
              FIRST IMEX
            </h1>
          </div>

          {/* Subtitle / Tagline */}
          <p 
            className="text-white font-bold tracking-[0.25em] sm:tracking-[0.32em] text-[10px] sm:text-xs uppercase mt-3 sm:mt-4 text-blue-100"
            style={{ fontFamily: "'Orbitron', 'Rajdhani', sans-serif" }}
          >
            COMPOSANTS &amp; SYSTEMES HYDRAULIQUES
          </p>
        </div>
      </div>
    );
  }

  // Navbar compact logo
  if (variant === 'navbar') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        {/* Navy box with FIRST IMEX */}
        <div 
          className="px-2.5 py-1.5 rounded-lg flex flex-col items-center justify-center shadow-xs border border-white/20"
          style={{ backgroundColor: '#17436b' }}
        >
          <div className="border border-white/90 rounded px-2 py-0.5">
            <span 
              className="text-white font-black tracking-wider text-xs block leading-none"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              FIRST IMEX
            </span>
          </div>
          <span 
            className="text-[7.5px] text-blue-200 font-bold tracking-widest uppercase mt-0.5 block leading-none"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            HYDRAULIQUE
          </span>
        </div>

        <div className="hidden sm:block">
          <div className="text-sm font-bold text-slate-900 tracking-tight leading-none">
            FIRST IMEX
          </div>
          <div className="text-[10px] text-slate-500 font-medium tracking-wide uppercase mt-1 leading-none">
            Composants &amp; Systèmes Hydrauliques
          </div>
        </div>
      </div>
    );
  }

  // Compact badge for cards / tables
  if (variant === 'badge') {
    return (
      <span 
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold text-white shadow-xs ${className}`}
        style={{ backgroundColor: '#17436b' }}
      >
        <span className="border border-white/80 rounded px-1 text-[10px] tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          FIRST IMEX
        </span>
      </span>
    );
  }

  // Default clean inline
  return (
    <div className={`inline-flex flex-col items-center p-3 rounded-xl border border-slate-200 bg-white ${className}`}>
      <div 
        className="px-4 py-2 rounded-lg text-center"
        style={{ backgroundColor: '#17436b' }}
      >
        <div className="border-2 border-white rounded px-3 py-1">
          <span className="text-white font-black text-sm tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            FIRST IMEX
          </span>
        </div>
        <div className="text-[8px] text-white font-bold tracking-wider uppercase mt-1">
          COMPOSANTS &amp; SYSTEMES HYDRAULIQUES
        </div>
      </div>
    </div>
  );
};
