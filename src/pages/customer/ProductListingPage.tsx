import React from 'react';
import { useRudrax } from '../../app/StateContext';
import { ProductCard } from '../../components/product/ProductCard';
import { ShoppingBag } from 'lucide-react';

export function ProductListingPage() {
  const {
    products,
    batches,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy
  } = useRudrax();

  const allCategories = [
    "All", "Electronics", "Clothing", "Stationery", "Grocery", "Seeds", "Plants", "Puja Items", "Manufacturing Products", "Daily Essentials", "Household", "Personal Care", "Packaged Foods"
  ];

  // Filter products by search keywords and selectedCategory
  const filteredProducts = products.filter(p => {
    const matchesSearch = searchQuery === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.seoKeywords.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.variants.some(v => v.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    
    if (sortBy === 'price-asc') {
      const pA = batches.find(bt => bt.productId === a.id && bt.isActive)?.sellingPrice || 100;
      const pB = batches.find(bt => bt.productId === b.id && bt.isActive)?.sellingPrice || 100;
      return pA - pB;
    }
    if (sortBy === 'price-desc') {
      const pA = batches.find(bt => bt.productId === a.id && bt.isActive)?.sellingPrice || 100;
      const pB = batches.find(bt => bt.productId === b.id && bt.isActive)?.sellingPrice || 100;
      return pB - pA;
    }
    return 0; // Default recommended
  });

  return (
    <div className="py-2 select-none animate-fadeIn font-sans max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Left-Aligned Sidebar Filters */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 pb-2 border-b border-slate-100 font-mono">
              Refine by Category
            </h3>
            <div className="flex flex-col gap-1 max-h-80 overflow-y-auto pr-1">
              {allCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'bg-teal-50 text-teal-800 border-l-4 border-teal-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 pb-2 border-b border-slate-100 font-mono">
              Sort Settings
            </h3>
            <div className="flex flex-col gap-1.5">
              {[
                { id: 'recommended', label: 'Featured Recommendations' },
                { id: 'rating', label: 'Highest Rated Stars' },
                { id: 'price-asc', label: 'Pricing: Low to High' },
                { id: 'price-desc', label: 'Pricing: High to Low' }
              ].map(sortOpt => (
                <button
                  key={sortOpt.id}
                  onClick={() => setSortBy(sortOpt.id)}
                  className={`w-full text-left py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
                    sortBy === sortOpt.id
                      ? 'text-teal-800 bg-teal-50/50 font-bold border-l-4 border-teal-700'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {sortOpt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Catalog Grid Area */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <div className="bg-white px-5 py-4 border border-slate-200 rounded-2xl flex justify-between items-center flex-wrap gap-2 shadow-xs">
            <span className="text-xs text-slate-500 font-bold font-mono">
              FOUND {sortedProducts.length} PREMIUM ITEMS IN "{selectedCategory.toUpperCase()}"
            </span>
            {searchQuery && (
              <span className="text-xs text-slate-600 font-medium font-sans">
                Active search: <strong className="text-teal-700">"{searchQuery}"</strong>
              </span>
            )}
          </div>

          {sortedProducts.length === 0 ? (
            <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-12 text-center flex flex-col items-center">
              <ShoppingBag className="text-slate-300 mb-3" size={36} />
              <h3 className="text-slate-800 font-black font-display text-sm mb-1">Catalog Stash Unresolved</h3>
              <p className="text-xs text-slate-500 max-w-xs font-semibold leading-relaxed">
                No store deliverables match the active criteria. Clear your keywords or switch category segments.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
export { ProductListingPage as default };
export { ProductListingPage as Catalog };
