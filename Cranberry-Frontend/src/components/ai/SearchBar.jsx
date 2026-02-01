import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, ArrowRight, X } from 'lucide-react';
import { useAISearch } from '../../hooks/useAI';
import { formatPrice, getProductImage } from '../../lib/utils';

const AISearchBar = ({ variant = 'hero', onSearch }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { results, search, isSearching, aiInsights } = useAISearch();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length >= 2) {
        search(query);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsFocused(false);
      navigate(`/shop?search=${encodeURIComponent(query)}`);
      if (onSearch) onSearch(query);
    }
  };

  const handleProductClick = (productId) => {
    setIsFocused(false);
    setQuery('');
    navigate(`/product/${productId}`);
  };

  const isHero = variant === 'hero';

  return (
    <div className="relative w-full" data-testid="ai-search-bar">
      <form onSubmit={handleSubmit}>
        <div className={`relative ${isHero ? 'max-w-2xl mx-auto' : ''}`}>
          <div className={`
            relative flex items-center
            ${isHero
              ? 'h-16 px-6 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100'
              : 'h-12 px-4 bg-slate-50 rounded-xl border border-transparent focus-within:bg-white focus-within:border-[#0071E3]'
            }
            transition-all
          `}>
            <Search className={`h-5 w-5 text-slate-400 ${isHero ? 'mr-4' : 'mr-3'}`} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder={isHero ? 'Search for anything... Try "wireless headphones" or "laptop for coding"' : 'Search products...'}
              className={`
                flex-1 bg-transparent outline-none text-slate-900 placeholder:text-slate-400
                ${isHero ? 'text-lg' : 'text-sm'}
              `}
              data-testid="ai-search-input"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1.5 hover:bg-slate-100 rounded-full transition-colors mr-2"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            )}
            {isHero && (
              <button
                type="submit"
                className="flex items-center space-x-2 px-5 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl transition-colors"
                data-testid="ai-search-submit"
              >
                <Sparkles className="h-4 w-4" />
                <span className="font-medium">Search</span>
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Search results dropdown */}
      {isFocused && query.length >= 2 && (
        <div
          ref={dropdownRef}
          className={`
            absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-dropdown border border-slate-100 overflow-hidden
            ${isHero ? 'max-w-2xl left-1/2 -translate-x-1/2' : ''}
          `}
          data-testid="ai-search-results"
        >
          {isSearching ? (
            <div className="p-6 text-center">
              <div className="inline-flex items-center space-x-2 text-slate-500">
                <div className="w-4 h-4 border-2 border-[#0071E3] border-t-transparent rounded-full animate-spin" />
                <span>AI is searching...</span>
              </div>
            </div>
          ) : results.length > 0 ? (
            <>
              {/* AI Insights */}
              {aiInsights && (
                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-100">
                  <div className="flex items-center space-x-2 text-sm">
                    <Sparkles className="h-4 w-4 text-[#0071E3]" />
                    <span className="text-slate-600">{aiInsights.suggestion}</span>
                  </div>
                </div>
              )}

              {/* Results */}
              <div className="max-h-80 overflow-y-auto">
                {results.slice(0, 5).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="w-full flex items-center space-x-4 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                    data-testid={`search-result-${product.id}`}
                  >
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg bg-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{product.name}</p>
                      <p className="text-sm text-slate-500">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">₹{formatPrice(product.price)}</p>
                      {product.aiScore && (
                        <span className="text-xs text-[#0071E3]">AI Match</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* View all */}
              <button
                onClick={handleSubmit}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-t border-slate-100 hover:bg-slate-50 transition-colors text-[#0071E3]"
                data-testid="view-all-results"
              >
                <span className="font-medium">View all {results.length} results</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="p-6 text-center text-slate-500">
              <p>No products found for "{query}"</p>
              <p className="text-sm mt-1">Try searching for categories like Electronics, Fashion, or Beauty</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AISearchBar;
