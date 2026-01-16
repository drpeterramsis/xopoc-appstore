
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { AppData } from '../types';

interface HeroProps {
  featuredApps: AppData[];
}

const Hero: React.FC<HeroProps> = ({ featuredApps }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fetchedData, setFetchedData] = useState<Record<string, Partial<AppData>>>({});

  // Cycle through apps
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredApps.length);
    }, 5000); // 5 Seconds per app
    return () => clearInterval(timer);
  }, [featuredApps.length]);

  const currentApp = featuredApps[currentIndex];

  // Fetch metadata for featured apps (if needed)
  useEffect(() => {
    const fetchMeta = async () => {
      if (fetchedData[currentApp.id]) return;

      // Check session
      const cached = sessionStorage.getItem(`app_${currentApp.id}`);
      if (cached) {
        setFetchedData(prev => ({ ...prev, [currentApp.id]: JSON.parse(cached) }));
        return;
      }

      try {
        const res = await fetch(`/api/app?id=${currentApp.id}`);
        if(res.ok) {
           const data = await res.json();
           setFetchedData(prev => ({ ...prev, [currentApp.id]: data }));
           sessionStorage.setItem(`app_${currentApp.id}`, JSON.stringify(data));
        }
      } catch (e) { console.error(e); }
    };
    fetchMeta();
  }, [currentApp.id, fetchedData]);

  const appDetails = fetchedData[currentApp.id] || {};
  const iconUrl = appDetails.iconUrl || null;
  const rating = appDetails.rating || 5.0; // Default to 5 if loading
  
  // Logic to clean description: remove title if it starts with it
  let description = appDetails.description || currentApp.title;
  if (description.startsWith(currentApp.title)) {
      description = description.substring(currentApp.title.length).replace(/^[\s-:]+/, '');
  }
  // Limit length
  if (description.length > 150) {
      description = description.substring(0, 150) + '...';
  }

  const handleHeroClick = () => {
    navigate(`/app/${currentApp.id}`);
  };

  return (
    <div 
      className="relative w-full h-[400px] md:h-[350px] rounded-3xl overflow-hidden shadow-2xl mb-12 transition-all duration-500 ease-in-out group cursor-pointer"
      onClick={handleHeroClick}
    >
      
      {/* Dynamic Background Image (Dark Faded) */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out blur-lg scale-110"
        style={{ 
          backgroundImage: iconUrl ? `url(${iconUrl})` : 'linear-gradient(to right, #0F9D58, #0B864A)',
          filter: 'blur(20px) brightness(0.4)' // Darken the background for text contrast
        }}
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" /> {/* Overlay for extra readability */}

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center h-full p-6 md:p-12 gap-8">
        
        {/* Animated Text Content */}
        <div key={`text-${currentApp.id}`} className="flex-grow text-center md:text-right animate-fade-in-up">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-green-300 uppercase bg-green-900/50 rounded-full border border-green-500/30 backdrop-blur-sm">
            تطبيق مميز
          </div>
          <h1 dir="rtl" className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4 drop-shadow-md font-sans group-hover:text-green-300 transition-colors">
            {currentApp.title}
          </h1>
          <p dir="rtl" className="text-gray-200 text-base md:text-lg mb-6 max-w-2xl ml-auto font-sans line-clamp-2 drop-shadow-sm">
            {description}
          </p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4" onClick={(e) => e.stopPropagation()}>
             <div className="flex items-center text-white px-4 py-2 bg-white/10 rounded-full backdrop-blur-md border border-white/20">
              <span className="font-bold mr-2 text-lg">{rating}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-400"} 
                  />
                ))}
              </div>
            </div>
             <a 
              href={currentApp.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-full transition-all duration-300 flex items-center shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-1"
            >
              حمله من جوجل بلاي
            </a>
          </div>
        </div>

        {/* Icon */}
        <div className="flex-shrink-0 relative">
          <img 
            key={`img-${currentApp.id}`}
            src={iconUrl || ''} 
            alt={currentApp.title}
            className={`w-32 h-32 md:w-48 md:h-48 rounded-3xl shadow-2xl object-cover ring-4 ring-white/20 transition-all duration-500 group-hover:scale-105 ${iconUrl ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20" onClick={(e) => e.stopPropagation()}>
        {featuredApps.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
