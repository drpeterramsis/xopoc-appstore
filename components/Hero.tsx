import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { AppData } from '../types';

interface HeroProps {
  featuredApp: AppData;
}

const Hero: React.FC<HeroProps> = ({ featuredApp }) => {
  if (!featuredApp) return null;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 shadow-2xl border border-white/10 mb-8 sm:mb-12">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center p-6 md:p-12 gap-8">
        <div className="flex-shrink-0">
          <img 
            src={featuredApp.iconUrl} 
            alt={featuredApp.title}
            className="w-32 h-32 md:w-48 md:h-48 rounded-3xl shadow-2xl object-cover ring-4 ring-white/10"
          />
        </div>
        
        <div className="flex-grow text-center md:text-right">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
            Featured App
          </div>
          <h1 dir="rtl" className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4 font-sans">
            {featuredApp.title}
          </h1>
          <p dir="rtl" className="text-gray-300 text-base md:text-lg mb-6 max-w-2xl ml-auto font-sans">
            {featuredApp.description}
          </p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4">
             <div className="flex items-center text-white px-4 py-2 bg-white/5 rounded-full backdrop-blur-sm border border-white/10">
              <span className="font-bold mr-2 text-lg">{featuredApp.rating}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < Math.floor(featuredApp.rating) ? "text-yellow-400 fill-current" : "text-gray-500"} 
                  />
                ))}
              </div>
            </div>
             <a 
              href={featuredApp.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-all duration-300 flex items-center shadow-lg shadow-primary/25 transform hover:-translate-y-1"
            >
              Get it on Google Play
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;