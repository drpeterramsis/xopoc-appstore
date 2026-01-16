import React, { useState, useEffect } from 'react';
import { Star, Download, Loader2, Package } from 'lucide-react';
import { AppData } from '../types';

interface AppCardProps {
  app: AppData;
  onClick?: () => void;
}

const AppCard: React.FC<AppCardProps> = ({ app, onClick }) => {
  const [fetchedData, setFetchedData] = useState<Partial<AppData>>({});
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchMetadata = async () => {
      try {
        const cached = sessionStorage.getItem(`app_${app.id}`);
        if (cached) {
            setFetchedData(JSON.parse(cached));
            setLoading(false);
            return;
        }

        const res = await fetch(`/api/app?id=${app.id}`);
        if (!res.ok) {
           throw new Error(`Status: ${res.status}`);
        }
        const data = await res.json();
        
        if (isMounted) {
          setFetchedData(data);
          sessionStorage.setItem(`app_${app.id}`, JSON.stringify(data));
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
            setHasError(true);
            setLoading(false);
        }
      }
    };

    fetchMetadata();
    return () => { isMounted = false; };
  }, [app.id]);

  const iconUrl = (!loading && !hasError && fetchedData.iconUrl) ? fetchedData.iconUrl : null;
  const rating = fetchedData.rating || 0;
  const downloads = fetchedData.downloads || '';
  const description = fetchedData.description || app.title;

  return (
    <div 
      className="group relative bg-white hover:bg-white transition-all duration-300 rounded-xl p-4 cursor-pointer flex flex-col h-full border border-gray-100 hover:border-primary/30 shadow-sm hover:shadow-lg hover:shadow-primary/5"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="relative">
            {iconUrl ? (
                <img 
                src={iconUrl} 
                alt={app.title} 
                className="w-16 h-16 rounded-2xl shadow-sm object-cover group-hover:scale-105 transition-transform duration-300 bg-gray-100"
                />
            ) : (
                <div className={`w-16 h-16 rounded-2xl shadow-sm bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 text-primary ${loading ? 'animate-pulse' : ''}`}>
                    {loading ? (
                        <Loader2 size={24} className="animate-spin" />
                    ) : (
                        <span className="text-xl font-bold">{app.title.charAt(0)}</span>
                    )}
                </div>
            )}
        </div>
        
        {downloads && (
          <div className="bg-gray-100 px-2 py-1 rounded-full text-xs text-text-muted flex items-center font-bold">
            <Download size={12} className="mr-1" />
            {downloads}
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <h3 dir="rtl" className="text-text font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors text-right font-sans">
          {app.title}
        </h3>
        <p dir="ltr" className="text-text-muted text-sm mb-2 text-right">{app.developer}</p>
        
        {rating > 0 && (
            <div className="flex items-center justify-end text-yellow-500 text-sm mb-3">
            <span className="font-bold mr-1 text-text">{rating}</span>
            <Star size={14} fill="currentColor" className="mr-2" />
            </div>
        )}
        
        <p dir="rtl" className="text-gray-500 text-xs line-clamp-2 text-right font-sans">
          {description}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          className="block w-full text-center bg-gray-50 border border-transparent hover:border-primary text-primary hover:text-white hover:bg-primary transition-all duration-300 py-2 rounded-lg font-bold text-sm"
        >
          التفاصيل
        </button>
      </div>
    </div>
  );
};

export default AppCard;