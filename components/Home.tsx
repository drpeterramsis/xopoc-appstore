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

  // Featured app for Hero (first app marked as featured)
  const featuredApp = useMemo(() => APPS_DATA.find(app => app.featured) || APPS_DATA[0], []);

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
      app.description.toLowerCase().includes(lowerQuery) ||
      app.category.toLowerCase().includes(lowerQuery)
    );
    setFilteredApps(results);
  };

  return (
    <div className="min-h-screen bg-background text-gray-100 font-sans selection:bg-primary/30 selection:text-white pb-20">
      
      <Navbar 
        onSearch={handleSearch} 
        onCategorySelect={handleCategorySelect}
        categories={categories}
        activeCategory={activeCategory}
      />

      <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Show Hero only if not searching and on "All" category */}
        {activeCategory === AppCategory.ALL && !isSearching && filteredApps.length === APPS_DATA.length && (
          <Hero featuredApp={featuredApp} />
        )}

        {/* Category Title */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isSearching ? 'Search Results' : activeCategory === AppCategory.ALL ? 'Popular Apps' : activeCategory}
          </h2>
          <span className="text-gray-500 text-sm">
            {filteredApps.length} {filteredApps.length === 1 ? 'result' : 'results'}
          </span>
        </div>

        {/* Empty State */}
        {filteredApps.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Frown size={64} className="mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No apps found</h3>
            <p>Try adjusting your search.</p>
            <button 
              onClick={() => {
                handleCategorySelect(AppCategory.ALL);
                // You might want to trigger a search clear here in a real app
              }}
              className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
            >
              View All Apps
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
      
      {/* Footer */}
      <footer className="mt-20 border-t border-white/5 py-10 text-center">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Xopoc Store. All rights reserved.
        </p>
        <p className="text-gray-600 text-xs mt-2">
          Google Play and the Google Play logo are trademarks of Google LLC.
        </p>
      </footer>
    </div>
  );
};

export default Home;