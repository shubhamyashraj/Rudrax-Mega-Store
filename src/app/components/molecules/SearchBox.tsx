import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'popular' | 'recent' | 'product';
}

interface SearchBoxProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  popularSearches?: string[];
}

export function SearchBox({
  onSearch,
  placeholder = 'Search for products, brands and more',
  suggestions = [],
  recentSearches = [],
  popularSearches = []
}: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSuggestionClick = (text: string) => {
    setQuery(text);
    handleSearch(text);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className={`flex items-center bg-input-background border-2 rounded-lg overflow-hidden transition-colors ${
          isFocused ? 'border-primary' : 'border-transparent'
        }`}>
          <Search className="w-5 h-5 text-muted-foreground ml-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            placeholder={placeholder}
            className="flex-1 px-3 py-2.5 bg-transparent outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mr-3 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (isFocused || query) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {/* Recent Searches */}
          {query === '' && recentSearches.length > 0 && (
            <div className="p-3 border-b border-border">
              <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Recent Searches
              </h4>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm"
                >
                  {search}
                </button>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          {query === '' && popularSearches.length > 0 && (
            <div className="p-3">
              <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Popular Searches
              </h4>
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm"
                >
                  {search}
                </button>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {query && suggestions.length > 0 && (
            <div className="p-3">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <span dangerouslySetInnerHTML={{
                    __html: suggestion.text.replace(
                      new RegExp(query, 'gi'),
                      (match) => `<strong>${match}</strong>`
                    )
                  }} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
