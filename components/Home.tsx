
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Hero from './Hero';
import AppCard from './AppCard';
import { APPS_DATA } from '../constants';
import { AppCategory, AppData } from '../types';
import { Frown, ArrowUp } from 'lucide-react';

const CATEGORY_MAIN = 'الرئيسية';
const CATEGORY_SPIRIT = 'غذاء الروح';

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORY_MAIN);
  const [filteredApps, setFilteredApps] = useState<AppData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  // Custom Category List including the "Spirit Bread" filter
  const categories = [
    CATEGORY_MAIN, 
    CATEGORY_SPIRIT,
    AppCategory.BIBLE,
    AppCategory.HYMNS,
    AppCategory.RADIO,
    AppCategory.SERVICES
  ];

  // Randomize function for Hero section
  const shuffleArray = (array: AppData[]) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  // Get all apps marked as featured for the Hero Slider
  // UPDATED: Now randomizes the order on every mount (site open)
  const featuredApps = useMemo(() => {
    const featured = APPS_DATA.filter(app => app.featured);
    // Return shuffled array if apps exist, otherwise fallback
    return featured.length > 0 ? shuffleArray(featured) : [APPS_DATA[0]];
  }, []);

  // Filter Logic
  useEffect(() => {
    if (isSearching) return;

    let results = APPS_DATA;

    // "Main" = All Xopoc apps, excluding Spirit Bread
    if (activeCategory === CATEGORY_MAIN) {
      results = APPS_DATA.filter(app => app.developer === 'Xopoc');
    } 
    // "Spirit Bread" = Only Spirit Bread apps
    else if (activeCategory === CATEGORY_SPIRIT) {
      results = APPS_DATA.filter(app => app.developer === 'Sp Bread');
    }
    else {
      results = APPS_DATA.filter(app => 
        app.developer === 'Xopoc' && app.category === activeCategory
      );
    }

    setFilteredApps(results);
  }, [activeCategory, isSearching]);

  // Scroll to Top Logic
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (category: string) => {
    setIsSearching(false);
    setActiveCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search Logic (Local Only)
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setIsSearching(false);
      setActiveCategory(activeCategory); 
      return;
    }

    setIsSearching(true);
    const lowerQuery = query.toLowerCase();
    const results = APPS_DATA.filter(app => 
      app.title.toLowerCase().includes(lowerQuery) || 
      app.developer.toLowerCase().includes(lowerQuery) ||
      app.description?.toLowerCase().includes(lowerQuery) ||
      app.category.toLowerCase().includes(lowerQuery)
    );
    setFilteredApps(results);
  };

  return (
    <div className="min-h-screen bg-background text-text font-sans selection:bg-primary/30 pb-20">
      
      <Navbar 
        onSearch={handleSearch} 
        onCategorySelect={handleCategorySelect}
        categories={categories}
        activeCategory={activeCategory}
      />

      <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Show Hero only if not searching and on "Main" category */}
        {activeCategory === CATEGORY_MAIN && !isSearching && (
          <Hero featuredApps={featuredApps} />
        )}

        {/* Category Title */}
        <div className="flex items-center justify-between mb-6 flex-row-reverse">
          <h2 className="text-2xl font-bold text-text border-r-4 border-primary pr-3">
            {isSearching ? 'نتائج البحث' : activeCategory}
          </h2>
          <span className="text-white bg-secondary px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            {filteredApps.length}
          </span>
        </div>

        {/* Empty State */}
        {filteredApps.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <Frown size={64} className="mb-4 opacity-50 text-gray-400" />
            <h3 className="text-xl font-bold mb-2">لا توجد نتائج</h3>
            <p>حاول استخدام كلمات بحث مختلفة أو تغيير التصنيف</p>
            <button 
              onClick={() => {
                handleCategorySelect(CATEGORY_MAIN);
              }}
              className="mt-6 px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-full text-text transition-colors font-bold"
            >
              العودة للرئيسية
            </button>
          </div>
        )}

        {/* Grid */}
        {filteredApps.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredApps.map((app) => (
              <AppCard 
                key={app.id} 
                app={app} 
                onClick={() => navigate(`/app/${app.id}`)}
              />
            ))}
          </div>
        )}

      </main>
      
      {/* Scroll To Top Button */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-20 right-6 z-50 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-all duration-300 transform ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={24} />
      </button>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 text-center z-50 shadow-lg-up">
        {/* UPDATED: Added Tagline and updated version */}
        <div className="flex flex-col justify-center items-center max-w-7xl mx-auto px-4 text-xs text-gray-500 gap-1">
           <span className="text-secondary font-bold">منصة تطوير البرامج المسيحية المتخصصة للموبايل</span>
           <div className="flex justify-between w-full font-bold mt-1">
             <span>v2.2.4</span>
             <span>© {new Date().getFullYear()} برامج خورس - Xopoc Store</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
