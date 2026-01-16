import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Download, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { APPS_DATA } from '../constants';
import { AppData } from '../types';

const AppDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const basicAppInfo = APPS_DATA.find((a) => a.id === id);

  const [details, setDetails] = useState<Partial<AppData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!basicAppInfo) return;

    const fetchData = async () => {
        try {
            // Cache check
            const cached = sessionStorage.getItem(`app_${id}`);
            if (cached) {
                setDetails(JSON.parse(cached));
                setLoading(false);
                return;
            }

            const res = await fetch(`/api/app?id=${id}`);
            if (!res.ok) throw new Error('Failed to load app data');
            const data = await res.json();
            
            setDetails(data);
            sessionStorage.setItem(`app_${id}`, JSON.stringify(data));
        } catch (err) {
            setError('Could not load app details from Play Store.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [id, basicAppInfo]);

  if (!basicAppInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">App not found</h2>
          <button onClick={() => navigate('/')} className="text-primary hover:underline">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 animate-fade-in">
      {/* Header / Nav */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-md border-b border-white/5 h-16 flex items-center px-4">
        <button 
          onClick={() => navigate('/')}
          className="p-2 -mr-2 text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowRight size={24} />
        </button>
        <span className="mr-4 text-lg font-semibold text-white truncate max-w-[200px]">
          {basicAppInfo.title}
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Loading State */}
        {loading && (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 size={48} className="animate-spin text-primary mb-4" />
                <p className="text-gray-400">Fetching latest data from Play Store...</p>
            </div>
        )}

        {/* Error State */}
        {!loading && error && (
            <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-6 text-center my-10">
                <AlertCircle size={32} className="text-red-500 mx-auto mb-2" />
                <p className="text-red-300">{error}</p>
                <a 
                  href={basicAppInfo.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-primary hover:underline"
                >
                    View on Play Store directly
                </a>
            </div>
        )}

        {/* Content */}
        {!loading && !error && details && (
            <>
                {/* Top Section */}
                <div className="flex flex-col md:flex-row gap-6 mt-6">
                <img 
                    src={details.iconUrl} 
                    alt={basicAppInfo.title} 
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl shadow-2xl mx-auto md:mx-0 object-cover"
                />
                <div className="flex-grow text-center md:text-right">
                    <h1 dir="rtl" className="text-3xl font-bold text-white mb-1 font-sans">{basicAppInfo.title}</h1>
                    <p className="text-primary font-medium mb-4">{basicAppInfo.developer}</p>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-center md:justify-end gap-6 text-gray-300 text-sm mb-6 border-b border-white/10 pb-6 md:border-none md:pb-0">
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-white flex items-center">
                        {details.rating} <Star size={12} fill="currentColor" className="ml-1" />
                        </span>
                        <span className="text-xs text-gray-500">Rating</span>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-white">{details.downloads}</span>
                        <span className="text-xs text-gray-500">Downloads</span>
                    </div>
                    </div>

                    <a 
                    href={basicAppInfo.playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-auto inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg shadow-primary/20"
                    >
                    Install
                    </a>
                </div>
                </div>

                {/* Screenshots */}
                {details.screenshots && details.screenshots.length > 0 && (
                    <div className="mt-8 md:mt-12">
                    <h2 className="text-xl font-bold text-white mb-4 text-right">Screenshots</h2>
                    <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
                        {details.screenshots.map((shot, index) => (
                        <img 
                            key={index}
                            src={shot} 
                            alt={`Screenshot ${index + 1}`}
                            className="h-64 md:h-80 rounded-2xl shadow-lg snap-center object-cover border border-white/5"
                        />
                        ))}
                    </div>
                    </div>
                )}

                {/* About */}
                <div className="mt-8 md:mt-12">
                <h2 className="text-xl font-bold text-white mb-4 text-right">About this app</h2>
                <p dir="rtl" className="text-gray-300 leading-relaxed whitespace-pre-wrap text-right font-sans">
                    {details.fullDescription || details.description}
                </p>
                </div>

                {/* Data Safety Stub */}
                <div className="mt-8 border-t border-white/10 pt-8 mb-12">
                    <div className="flex items-center justify-end mb-4 text-right">
                        <h2 className="text-xl font-bold text-white mr-2">Data Safety</h2>
                        <ShieldCheck size={20} className="text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-sm text-right">
                        Data privacy and security practices may vary based on your use, region, and age. The developer provided this information and may update it over time.
                    </p>
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default AppDetails;