
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Download, MessageSquare } from 'lucide-react';
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

  // Fetch metadata for featured apps
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
  const downloads = appDetails.downloads;
  const reviewsCount = appDetails.reviewsCount;
  
  // Logic to clean description: 
  // 1. Remove title if present at start.
  // 2. Remove common prefixes.
  // 3. One line only (Short Description).
  
  // Start with full description or title as fallback
  let rawDesc = appDetails.description || currentApp.title;
  
  // Remove the App Title from the description (case-insensitive)
  const titleRegex = new RegExp(`${currentApp.title}\\s*[:|-]?\\s*`, 'gi');
  let cleanDesc = rawDesc.replace(titleRegex, '').trim();

  // Remove leading non-alphanumeric chars that might remain (like -, :)
  cleanDesc = cleanDesc.replace(/^[\s-:]+/, '');

  // Extract only the first sentence or first line
  // Split by newline or period followed by space
  const firstLine = cleanDesc.split(/(\r\n|\n|\r|\.\s)/)[0];
  
  // Truncate to max 90 characters to keep it "one line" visually
  let description = firstLine.length > 90 ? firstLine.substring(0, 90) + '...' : firstLine;

  const handleHeroClick = () => {
    navigate(`/app/${currentApp.id}`);
  };

  return (
    <div 
      className="relative w-full min-h-[450px] md:h-[350px] rounded-3xl overflow-hidden shadow-2xl mb-12 transition-all duration-500 ease-in-out group cursor-pointer"
      onClick={handleHeroClick}
    >
      
      {/* Dynamic Background Image (Dark Faded) */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out blur-lg scale-110"
        style={{ 
          backgroundImage: iconUrl ? `url(${iconUrl})` : 'linear-gradient(to right, #1565C0, #0D47A1)',
          filter: 'blur(20px) brightness(0.4)' 
        }}
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

      {/* 
         LAYOUT:
         Mobile: Flex Column (Icon first, then Text)
         Desktop: Flex Row Reverse (Text on Right, Icon on Left)
      */}
      <div className="relative z-10 flex flex-col md:flex-row-reverse items-center justify-center h-full p-6 md:p-12 gap-6 md:gap-8">
        
        {/* Icon (Order 1 on Mobile) */}
        <div className="flex-shrink-0 relative">
          <img 
            key={`img-${currentApp.id}`}
            src={iconUrl || ''} 
            alt={currentApp.title}
            className={`w-28 h-28 md:w-48 md:h-48 rounded-3xl shadow-2xl object-cover ring-4 ring-white/20 transition-all duration-500 group-hover:scale-105 ${iconUrl ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>

        {/* Text Content (Order 2 on Mobile) */}
        <div key={`text-${currentApp.id}`} className="flex-grow text-center md:text-right animate-fade-in-up flex flex-col items-center md:items-end">
          
          <div className="inline-block px-3 py-1 mb-2 text-xs font-bold tracking-wider text-blue-300 uppercase bg-blue-900/50 rounded-full border border-blue-500/30 backdrop-blur-sm">
            تطبيق مميز
          </div>
          
          <h1 dir="rtl" className="text-2xl md:text-5xl font-bold text-white mb-2 md:mb-3 drop-shadow-md font-sans group-hover:text-blue-300 transition-colors">
            {currentApp.title}
          </h1>
          
          {/* Summary / Short Description */}
          <p dir="rtl" className="text-gray-200 text-sm md:text-lg mb-4 max-w-xl font-sans leading-relaxed drop-shadow-sm whitespace-nowrap overflow-hidden text-ellipsis w-full">
            {description}
          </p>
          
          {/* Stats Row: Ratings, Downloads, Reviews */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 mb-5" onClick={(e) => e.stopPropagation()}>
             {/* Rating Badge */}
             <div className="flex items-center text-white px-3 py-1.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              <span className="font-bold mr-2 text-sm">{rating}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-400"} 
                  />
                ))}
              </div>
            </div>

            {/* Downloads Badge */}
            {downloads && (
                <div className="flex items-center text-white px-3 py-1.5 bg-green-600/20 rounded-xl backdrop-blur-md border border-green-400/30">
                     <span className="font-bold mr-1 text-sm">{downloads}</span>
                     <Download size={14} className="text-green-400" />
                </div>
            )}
            
            {/* Reviews Count */}
             {reviewsCount && (
                <div className="hidden sm:flex items-center text-white px-3 py-1.5 bg-purple-600/20 rounded-xl backdrop-blur-md border border-purple-400/30">
                     <span className="font-bold mr-1 text-sm">{reviewsCount}</span>
                     <MessageSquare size={14} className="text-purple-400" />
                </div>
            )}
          </div>

          <a 
              href={currentApp.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-full transition-all duration-300 flex items-center shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1 w-full md:w-auto justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              حمله من جوجل بلاي
              <Download size={18} className="ml-2" />
          </a>
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
