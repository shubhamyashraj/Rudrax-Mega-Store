import React, { useState, useEffect } from 'react';
import { useRudrax } from '../../app/StateContext';
import { Star, ArrowLeft, Heart, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/atoms';

export function ProductDetailPage() {
  const {
    products,
    batches,
    activeProductDetailId,
    setActiveProductDetailId,
    setActivePage,
    addToCart
  } = useRudrax();

  const targetProduct = products.find(p => p.id === activeProductDetailId);
  
  // State for chosen variant
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');

  // Auto-set first variant on load or change
  useEffect(() => {
    if (targetProduct && targetProduct.variants.length > 0) {
      setSelectedVariantId(targetProduct.variants[0].id);
    }
  }, [activeProductDetailId, targetProduct]);

  if (!targetProduct) {
    return (
      <div className="py-12 text-center max-w-lg mx-auto">
        <p className="text-slate-600 font-bold">Unresolved retail product identification.</p>
        <button 
          onClick={() => setActivePage('catalog')}
          className="text-teal-700 hover:underline mt-2 font-bold font-mono text-xs block mx-auto cursor-pointer"
        >
          ← Return to catalogue
        </button>
      </div>
    );
  }

  const currentVariant = targetProduct.variants.find(v => v.id === selectedVariantId) || targetProduct.variants[0];
  const variantBatches = batches.filter(b => b.productId === targetProduct.id && b.variantId === currentVariant?.id);
  const activeBatchRow = variantBatches.find(b => b.isActive) || variantBatches[0];
  const aggregateStockQty = variantBatches.reduce((sum, b) => sum + b.quantity, 0);

  return (
    <div className="py-4 select-none animate-fadeIn font-sans max-w-4xl mx-auto w-full">
      {/* Navigation link */}
      <button
        onClick={() => { setActiveProductDetailId(null); setActivePage('catalog'); }}
        className="flex items-center gap-1.5 text-slate-500 hover:text-teal-700 font-semibold text-xs mb-6 cursor-pointer group transition-colors"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
        Back to Catalog Index
      </button>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Pictures panel with grid thumbnails */}
        <div className="flex flex-col gap-4">
          <div className="h-80 w-full bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden flex items-center justify-center relative">
            <img src={targetProduct.image} alt={targetProduct.name} className="w-full h-full object-cover" />
            <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md border border-slate-100 p-2 rounded-xl text-slate-500 hover:text-rose-500 cursor-pointer shadow-xs transition-colors">
              <Heart size={16} />
            </span>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 opacity-90 hover:opacity-100 transition-opacity animate-pulse">
                <img src={targetProduct.image} alt={targetProduct.name} className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform" />
              </div>
            ))}
          </div>
        </div>

        {/* Configurations column */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-teal-50 text-teal-800 font-extrabold text-[10px] tracking-widest uppercase px-2.5 py-0.5 rounded-md border border-teal-100 font-mono">
              {targetProduct.brand}
            </span>
            <span className="bg-slate-100 text-slate-600 font-extrabold text-[10px] tracking-widest uppercase px-2.5 py-0.5 rounded-md font-mono">
              {targetProduct.category}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black font-display text-slate-900 tracking-tight leading-none">
            {targetProduct.name}
          </h1>

          <div className="flex items-center gap-1.5 text-xs">
            <Star size={14} className="fill-amber-500 text-amber-500" />
            <span className="font-extrabold text-slate-800">{targetProduct.rating || 4.8}</span>
            <span className="text-slate-400 font-bold font-mono">({targetProduct.reviewsCount || 42} user reviews)</span>
          </div>

          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            {targetProduct.description}
          </p>

          {/* Quantity Pack Variants picker */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
              Available Quantity & Size Formats
            </span>
            <div className="flex gap-2 flex-wrap">
              {targetProduct.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`px-3 py-2 border rounded-xl text-xs font-bold cursor-pointer transition-all duration-200 ${
                    currentVariant?.id === v.id
                      ? 'border-teal-700 bg-teal-50/50 text-teal-800 shadow-sm font-extrabold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing, Aggregates, Add-to-cart block */}
          <div className="border-y border-slate-150 py-4 flex justify-between items-center mt-2 flex-wrap gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
                Aggregated price
              </span>
              {activeBatchRow ? (
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-slate-900">₹{activeBatchRow.sellingPrice}</span>
                  <span className="text-xs text-slate-400 line-through font-bold">
                    ₹{Math.round(activeBatchRow.purchasePrice * 1.4)}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-rose-600 font-bold font-mono mt-1 block">Out of Lot Stocks</span>
              )}
            </div>

            <div className="flex flex-col items-end">
              {aggregateStockQty > 0 ? (
                <>
                  <button
                    onClick={() => { if (currentVariant) addToCart(targetProduct.id, currentVariant.id, 1); }}
                    className="bg-teal-700 hover:bg-teal-800 text-white font-extrabold font-display text-xs px-5 py-3 rounded-xl transition-all cursor-pointer shadow-md shadow-teal-700/10 active:scale-95"
                  >
                    Add to Basket
                  </button>
                  <span className="text-[9px] text-emerald-600 font-bold block mt-1 font-mono">
                    IN STOCK ({aggregateStockQty} items)
                  </span>
                </>
              ) : (
                <button 
                  disabled 
                  className="bg-slate-100 text-slate-400 border border-slate-200 text-xs font-bold px-5 py-3 rounded-xl cursor-not-allowed"
                >
                  Sold Out
                </button>
              )}
            </div>
          </div>

          {/* Specification list */}
          <div className="flex flex-col gap-3 font-sans">
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
              <Sparkles size={13} className="text-teal-600" />
              Dynamic Specifications
            </h3>
            {targetProduct.specifications && Object.keys(targetProduct.specifications).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(targetProduct.specifications).map(([key, val]) => (
                  <div key={key} className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase font-bold font-mono tracking-wider">{key}</span>
                    <span className="text-slate-800 font-semibold mt-0.5 truncate">{val}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">No special specifications listed under this batch catalog. Sourced freely.</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
export { ProductDetailPage as default };
export { ProductDetailPage as ProductDetail };
