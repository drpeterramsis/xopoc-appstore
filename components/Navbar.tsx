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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-surface/95 backdrop-blur-md shadow-md border-b border-white/5' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-green-300 flex items-center justify-center mr-2">
              <span className="text-white font-bold text-xl">X</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight font-sans">Xopoc Store</span>
          </div>

          {/* Desktop Categories */}
          <div className="hidden md:flex items-center space-x-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategorySelect(cat)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeCategory === cat 
                    ? 'text-primary bg-primary/10' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md ml-8 relative group">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-500 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Search..."
                className="block w-full pl-10 pr-4 py-2 border border-white/10 rounded-full leading-5 bg-background/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-background focus:border-primary/50 focus:ring-1 focus:ring-primary sm:text-sm transition-all duration-300"
              />
            </form>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-md focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-white/10 absolute w-full px-2 pt-2 pb-3 shadow-xl">
           <form onSubmit={handleSearchSubmit} className="mb-4 relative px-2">
              <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Search..."
                className="block w-full pl-4 pr-12 py-2 rounded-lg bg-background text-white border border-white/10 focus:border-primary outline-none"
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
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  activeCategory === cat 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
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