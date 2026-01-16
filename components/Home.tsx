import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Hero from './Hero';
import AppCard from './AppCard';
import { APPS_DATA } from '../constants';
import { AppCategory, AppData } from '../types';
import { Frown } from 'lucide-react';

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>(AppCategory.ALL);
  const [filteredApps, setFilteredApps] = useState<AppData[]>(APPS_DATA);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  // Derive categories from Enum
  const categories = Object.values(AppCategory);

  // Get all apps marked as featured for the Hero Slider
  const featuredApps = useMemo(() => {
    const featured = APPS_DATA.filter(app => app.featured);
    return featured.length > 0 ? featured : [APPS_DATA[0]];
  }, []);

  // Standard filter logic
  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    if (category === AppCategory.ALL) {
      setFilteredApps(APPS_DATA);
    } else {
      setFilteredApps(APPS_DATA.filter(app => app.category === category));
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search Logic (Local Only)
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setIsSearching(false);
      // Re-apply category filter if search is cleared
      if (activeCategory === AppCategory.ALL) {
        setFilteredApps(APPS_DATA);
      } else {
        setFilteredApps(APPS_DATA.filter(app => app.category === activeCategory));
      }
      return;
    }

    setIsSearching(true);
    // Basic Local Search
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
        
        {/* Show Hero only if not searching and on "All" category */}
        {activeCategory === AppCategory.ALL && !isSearching && (
          <Hero featuredApps={featuredApps} />
        )}

        {/* Category Title */}
        <div className="flex items-center justify-between mb-6 flex-row-reverse">
          <h2 className="text-2xl font-bold text-text">
            {isSearching ? 'نتائج البحث' : activeCategory === AppCategory.ALL ? 'الأكثر رواجاً' : activeCategory}
          </h2>
          <span className="text-text-muted text-sm font-medium">
            {filteredApps.length} {filteredApps.length === 1 ? 'برنامج' : 'برامج'}
          </span>
        </div>

        {/* Empty State */}
        {filteredApps.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <Frown size={64} className="mb-4 opacity-50 text-gray-400" />
            <h3 className="text-xl font-bold mb-2">لا توجد نتائج</h3>
            <p>حاول استخدام كلمات بحث مختلفة</p>
            <button 
              onClick={() => {
                handleCategorySelect(AppCategory.ALL);
              }}
              className="mt-6 px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-full text-text transition-colors font-bold"
            >
              عرض كل البرامج
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
      
      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 text-center z-50 shadow-lg-up">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4 text-xs font-bold text-gray-500">
           <span>v2.0.0</span>
           <span>© {new Date().getFullYear()} برامج خورس - Xopoc Store</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;