
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Download, ShieldCheck, Loader2, AlertCircle, Calendar, Tag, MessageSquare, ExternalLink } from 'lucide-react';
import { APPS_DATA } from '../constants';
import { AppData } from '../types';

const AppDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const basicAppInfo = APPS_DATA.find((a) => a.id === id);

  const [details, setDetails] = useState<Partial<AppData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [dominantColor, setDominantColor] = useState<string>('');
  const [isLightColor, setIsLightColor] = useState(false); // Track if background is light
  
  // Canvas for color extraction
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!basicAppInfo) return;

    const fetchData = async () => {
        try {
            // Cache check
            const cached = sessionStorage.getItem(`app_${id}`);
            if (cached) {
                const data = JSON.parse(cached);
                setDetails(data);
                setLoading(false);
                // Trigger extraction if icon exists
                if (data.iconUrl) extractColor(data.iconUrl);
                return;
            }

            const res = await fetch(`/api/app?id=${id}`);
            if (!res.ok) throw new Error('Failed to load app data');
            const data = await res.json();
            
            setDetails(data);
            sessionStorage.setItem(`app_${id}`, JSON.stringify(data));
            if (data.iconUrl) extractColor(data.iconUrl);

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

  // Extract color logic & Calculate Contrast
  const extractColor = (url: string) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = 1;
        canvas.height = 1;
        ctx.drawImage(img, 0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        
        setDominantColor(`rgb(${r},${g},${b})`);

        // Calculate YIQ brightness (human eye perception)
        // Formula: ((R*299)+(G*587)+(B*114))/1000
        // If result >= 128, color is light.
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        setIsLightColor(yiq >= 128);
    };
  };

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

  // Dynamic Styles
  const headerStyle = dominantColor ? { backgroundColor: dominantColor, color: '#fff' } : {};
  const textStyle = dominantColor ? { color: dominantColor } : {};
  
  // Dynamic Button Style
  // Background is dominantColor, Text is black if light, white if dark.
  const buttonStyle = {
      backgroundColor: dominantColor || '#C62828',
      color: isLightColor ? '#000000' : '#ffffff'
  };
  
  // Secondary Button Style (for direct download)
  // Inverse of main button for contrast
  const secondaryButtonStyle = {
      backgroundColor: 'transparent',
      borderColor: dominantColor || '#C62828',
      color: dominantColor || '#C62828',
      borderWidth: '2px'
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-20 animate-fade-in text-text font-sans relative" dir="rtl">
      <canvas ref={canvasRef} className="hidden"></canvas>
      
      {/* Header / Nav */}
      <div 
        className={`fixed top-0 left-0 right-0 z-40 h-16 flex items-center px-4 shadow-sm justify-between transition-colors duration-500`}
        style={dominantColor ? { backgroundColor: dominantColor } : { backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
      >
        <div className="flex items-center gap-2">
            <button 
            onClick={() => navigate(-1)}
            className={`flex items-center px-3 py-2 rounded-lg transition-colors group ${dominantColor ? (isLightColor ? 'text-black hover:bg-black/10' : 'text-white hover:bg-white/20') : 'text-text hover:bg-gray-100'}`}
            >
            <ArrowRight size={20} className="transform rotate-180 ml-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">عودة</span>
            </button>
        </div>
        
        <span className={`text-lg font-bold truncate max-w-[200px] md:max-w-md text-right ${dominantColor ? (isLightColor ? 'text-black' : 'text-white') : 'text-text'}`}>
          {basicAppInfo.title}
        </span>
      </div>

      {/* Dynamic Background Blob */}
      {dominantColor && (
         <div 
            className="fixed top-0 left-0 w-full h-[50vh] opacity-10 pointer-events-none -z-10 blur-3xl transition-colors duration-1000"
            style={{ background: `linear-gradient(180deg, ${dominantColor} 0%, rgba(255,255,255,0) 100%)` }}
         />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
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
                <div className="flex flex-col md:flex-row gap-8 mt-6">
                 <div className="mx-auto md:mx-0 relative group">
                    <div className="absolute inset-0 bg-black/10 rounded-3xl transform rotate-3 scale-95 group-hover:rotate-6 transition-transform duration-300 -z-10"></div>
                    {details.iconUrl ? (
                         <img 
                         src={details.iconUrl} 
                         alt={basicAppInfo.title} 
                         className="w-32 h-32 md:w-40 md:h-40 rounded-3xl shadow-xl object-cover ring-4 ring-white"
                     />
                    ) : (
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl shadow-xl bg-gray-100 flex items-center justify-center">
                            <span className="text-4xl font-bold text-primary">{basicAppInfo.title.charAt(0)}</span>
                        </div>
                    )}
                 </div>
                
                <div className="flex-grow text-center md:text-right flex flex-col justify-center">
                    <h1 dir="rtl" className="text-3xl md:text-4xl font-extrabold text-text mb-2 font-sans">{basicAppInfo.title}</h1>
                    <p className="font-bold text-lg mb-4" style={textStyle || {color:'#C62828'}}>{basicAppInfo.developer}</p>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-b border-gray-100 py-4 mb-6">
                        <div className="flex flex-col items-center border-l border-gray-100">
                             <span className="flex items-center font-bold text-lg text-text">
                                {details.rating || '-'} <Star size={14} fill="#fbbf24" className="text-yellow-400 ml-1" />
                             </span>
                             <span className="text-xs text-text-muted">التقييم</span>
                        </div>
                        <div className="flex flex-col items-center border-l border-gray-100">
                             <span className="font-bold text-lg text-text flex items-center">
                                {details.reviewsCount || '-'} <MessageSquare size={14} className="ml-1 text-blue-400" />
                             </span>
                             <span className="text-xs text-text-muted">المراجعات</span>
                        </div>
                        <div className="flex flex-col items-center border-l border-gray-100">
                             <span className="font-bold text-lg text-text flex items-center">
                                {details.downloads || '-'} <Download size={14} className="ml-1 text-green-500" />
                             </span>
                             <span className="text-xs text-text-muted">التحميلات</span>
                        </div>
                         <div className="flex flex-col items-center">
                             <span className="font-bold text-lg text-text flex items-center">
                                {details.version || '-'} <Tag size={14} className="ml-1 text-purple-400" />
                             </span>
                             <span className="text-xs text-text-muted">الإصدار</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row gap-3 w-full justify-center md:justify-end">
                      {/* Google Play Button */}
                      <a 
                        href={basicAppInfo.playStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 md:flex-none inline-flex items-center justify-center font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
                        style={buttonStyle}
                      >
                        تحميل من جوجل بلاي
                        <ExternalLink size={18} className="ml-2" />
                      </a>
                      
                      {/* Direct Download Button (If Available) */}
                      {basicAppInfo.directDownloadUrl && (
                        <a 
                            href={basicAppInfo.directDownloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 md:flex-none inline-flex items-center justify-center font-bold py-3 px-6 rounded-full transition-all duration-300 hover:bg-gray-50 border-2"
                            style={secondaryButtonStyle}
                            title="مناسب فقط لأندرويد 6 و 7"
                        >
                            تحميل خاص بالاجهزة القديمة
                            <Download size={18} className="ml-2" />
                        </a>
                      )}
                    </div>

                </div>
                </div>

                {/* Additional Metadata */}
                {details.updatedOn && (
                     <div className="flex items-center justify-end mt-4 text-xs text-text-muted bg-gray-50 p-2 rounded-lg inline-block w-full text-right">
                        <span dir="ltr">{details.updatedOn}</span>
                        <span className="ml-2 font-bold">:آخر تحديث</span>
                        <Calendar size={14} className="ml-1" />
                     </div>
                )}

                {/* Screenshots */}
                {details.screenshots && details.screenshots.length > 0 && (
                    <div className="mt-8 md:mt-12">
                    <h2 className="text-xl font-bold text-text mb-4 text-right flex items-center justify-end">
                        لقطات الشاشة
                        <div className="w-2 h-6 bg-primary rounded-full ml-2"></div>
                    </h2>
                    <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide px-1">
                        {details.screenshots.map((shot, index) => (
                        <img 
                            key={index}
                            src={shot} 
                            alt={`Screenshot ${index + 1}`}
                            className="h-64 md:h-80 rounded-2xl shadow-md snap-center object-cover border border-gray-100 hover:scale-[1.02] transition-transform"
                        />
                        ))}
                    </div>
                    </div>
                )}

                {/* About */}
                <div className="mt-8 md:mt-12">
                <h2 className="text-xl font-bold text-text mb-4 text-right flex items-center justify-end">
                    عن هذا البرنامج
                    <div className="w-2 h-6 bg-secondary rounded-full ml-2"></div>
                </h2>
                <p dir="rtl" className="text-text leading-loose whitespace-pre-wrap text-right font-sans bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-base">
                    {details.fullDescription || details.description}
                </p>
                </div>

                {/* Data Safety Stub */}
                <div className="mt-8 border-t border-gray-200 pt-8 mb-12">
                    <div className="flex items-center justify-end mb-4 text-right">
                        <h2 className="text-xl font-bold text-text mr-2">أمان البيانات</h2>
                        <ShieldCheck size={20} className="text-green-600" />
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
