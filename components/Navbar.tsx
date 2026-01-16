import React, { useState, useEffect } from 'react';
import { Search, X, Menu } from 'lucide-react';

interface NavbarProps {
  onSearch: (query: string) => void;
  onCategorySelect: (category: string) => void;
  categories: string[];
  activeCategory: string;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onCategorySelect, categories, activeCategory }) => {
  const [query, setQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md border-b border-gray-100' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer gap-3" onClick={() => window.location.reload()}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-extrabold text-2xl drop-shadow-md">X</span>
            </div>
            <div className="flex flex-col items-start">
                 <span className="text-primary font-bold text-xl tracking-tight font-sans">برامج خورس</span>
                 <span className="text-secondary text-[10px] font-bold -mt-1 hidden sm:block">منصة تطوير البرامج المسيحية المتخصصة للموبايل</span>
            </div>
           
          </div>

          {/* Desktop Categories */}
          <div className="hidden md:flex items-center space-x-1 flex-row-reverse">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategorySelect(cat)}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ml-1 ${
                  activeCategory === cat 
                    ? 'text-white bg-gradient-to-r from-primary to-primary-dark shadow-md' 
                    : 'text-gray-600 hover:text-primary hover:bg-red-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md ml-8 relative group mr-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="بحث..."
                className="block w-full pr-10 pl-4 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 text-text placeholder-gray-400 focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm transition-all duration-300 text-right"
              />
            </form>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text hover:text-primary p-2 rounded-md focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 absolute w-full px-2 pt-2 pb-3 shadow-xl">
           <form onSubmit={handleSearchSubmit} className="mb-4 relative px-2">
              <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="بحث عن برنامج..."
                className="block w-full pr-4 pl-12 py-2 rounded-lg bg-gray-50 text-text border border-gray-200 focus:border-primary outline-none text-right"
              />
           </form>
           <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onCategorySelect(cat);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-right px-3 py-2 rounded-md text-base font-medium ${
                  activeCategory === cat 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-text-muted hover:bg-gray-50 hover:text-text'
                }`}
              >
                {cat}
              </button>
            ))}
           </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;