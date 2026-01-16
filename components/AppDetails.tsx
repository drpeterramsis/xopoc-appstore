import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Download, ShieldCheck, Loader2, AlertCircle, Package } from 'lucide-react';
import { APPS_DATA } from '../constants';
import { AppData } from '../types';

const AppDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const basicAppInfo = APPS_DATA.find((a) => a.id === id);

  const [details, setDetails] = useState<Partial<AppData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

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
            console.warn("Could not load full app details, using fallback.", err);
            setUsingFallback(true);
            setDetails({
                ...basicAppInfo,
                description: "تعذر تحميل التفاصيل الكاملة من المتجر. يرجى الضغط على زر التحميل للمزيد من المعلومات.",
                screenshots: []
            });
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [id, basicAppInfo]);

  if (!basicAppInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">البرنامج غير موجود</h2>
          <button onClick={() => navigate('/')} className="text-primary hover:underline">العودة للرئيسية</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-20 animate-fade-in text-text font-sans">
      {/* Header / Nav */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 h-16 flex items-center px-4 shadow-sm justify-between">
        <div className="flex items-center gap-2">
            <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-text hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors group"
            >
            <ArrowRight size={20} className="transform rotate-180 ml-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">عودة</span>
            </button>
        </div>
        
        <span className="text-lg font-bold text-text truncate max-w-[200px] md:max-w-md text-right">
          {basicAppInfo.title}
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Loading State */}
        {loading && (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 size={48} className="animate-spin text-primary mb-4" />
                <p className="text-text-muted">جاري تحميل البيانات من المتجر...</p>
            </div>
        )}

        {/* Content */}
        {!loading && details && (
            <>
                {/* Fallback Warning */}
                {usingFallback && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center justify-end text-right">
                        <div>
                            <p className="text-amber-800 text-sm font-bold">تعذر الاتصال بمتجر جوجل</p>
                            <p className="text-amber-600 text-xs">بعض التفاصيل قد تكون غير متاحة</p>
                        </div>
                        <AlertCircle size={24} className="text-amber-500 ml-3" />
                    </div>
                )}

                {/* Top Section */}
                <div className="flex flex-col md:flex-row gap-6 mt-6">
                 <div className="mx-auto md:mx-0">
                    {details.iconUrl ? (
                         <img 
                         src={details.iconUrl} 
                         alt={basicAppInfo.title} 
                         className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl shadow-xl object-cover ring-4 ring-white"
                     />
                    ) : (
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl shadow-xl bg-primary/10 flex items-center justify-center">
                            <span className="text-4xl font-bold text-primary">{basicAppInfo.title.charAt(0)}</span>
                        </div>
                    )}
                 </div>
                
                <div className="flex-grow text-center md:text-right">
                    <h1 dir="rtl" className="text-3xl font-bold text-text mb-1 font-sans">{basicAppInfo.title}</h1>
                    <p className="text-primary font-medium mb-4">{basicAppInfo.developer}</p>
                    
                    {/* Stats */}
                    {details.rating ? (
                        <div className="flex items-center justify-center md:justify-end gap-6 text-text-muted text-sm mb-6 border-b border-gray-200 pb-6 md:border-none md:pb-0">
                        <div className="flex flex-col items-center">
                            <span className="font-bold text-text flex items-center">
                            {details.rating} <Star size={12} fill="currentColor" className="ml-1 text-yellow-500" />
                            </span>
                            <span className="text-xs text-text-muted">التقييم</span>
                        </div>
                        <div className="w-px h-8 bg-gray-300"></div>
                        <div className="flex flex-col items-center">
                            <span className="font-bold text-text" dir="ltr">{details.downloads || '-'}</span>
                            <span className="text-xs text-text-muted">التحميلات</span>
                        </div>
                        </div>
                    ) : (
                        <div className="mb-6"></div>
                    )}

                    <a 
                    href={basicAppInfo.playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-auto inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-1"
                    >
                    تحميل من جوجل بلاي
                    </a>
                </div>
                </div>

                {/* Screenshots */}
                {details.screenshots && details.screenshots.length > 0 && (
                    <div className="mt-8 md:mt-12">
                    <h2 className="text-xl font-bold text-text mb-4 text-right">لقطات الشاشة</h2>
                    <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide px-1">
                        {details.screenshots.map((shot, index) => (
                        <img 
                            key={index}
                            src={shot} 
                            alt={`Screenshot ${index + 1}`}
                            className="h-64 md:h-80 rounded-2xl shadow-md snap-center object-cover border border-gray-100"
                        />
                        ))}
                    </div>
                    </div>
                )}

                {/* About */}
                <div className="mt-8 md:mt-12">
                <h2 className="text-xl font-bold text-text mb-4 text-right">عن هذا البرانامج</h2>
                <p dir="rtl" className="text-text-muted leading-relaxed whitespace-pre-wrap text-right font-sans bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    {details.fullDescription || details.description}
                </p>
                </div>

                {/* Data Safety Stub */}
                <div className="mt-8 border-t border-gray-200 pt-8 mb-12">
                    <div className="flex items-center justify-end mb-4 text-right">
                        <h2 className="text-xl font-bold text-text mr-2">أمان البيانات</h2>
                        <ShieldCheck size={20} className="text-primary" />
                    </div>
                    <p className="text-text-muted text-sm text-right">
                        قد تختلف ممارسات خصوصية البيانات والأمان بناءً على استخدامك ومنطقتك وعمرك. قدم المطور هذه المعلومات وقد يقوم بتحديثها بمرور الوقت.
                    </p>
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default AppDetails;