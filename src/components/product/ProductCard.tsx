import React, { useState } from 'react';
import { useRudrax } from '../../app/StateContext';
import { Product } from '../../models/types';
import { Star, Eye, Percent, CheckCircle, PackageX } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  key?: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, batches, setActivePage, setActiveProductDetailId } = useRudrax();
  const [selectedVarId, setSelectedVarId] = useState<string>(product.variants[0]?.id || '');

  const selectedVariant = product.variants.find(v => v.id === selectedVarId) || product.variants[0];

  // Settle active batch selling price for the chosen variant
  const matchingBatches = batches.filter(b => b.productId === product.id && b.variantId === selectedVariant?.id);
  const activeBatch = matchingBatches.find(b => b.isActive) || matchingBatches[0];
  const aggregateStock = matchingBatches.reduce((s, b) => s + b.quantity, 0);

  const discountPercent = activeBatch 
    ? Math.round(((activeBatch.purchasePrice * 1.4 - activeBatch.sellingPrice) / (activeBatch.purchasePrice * 1.4)) * 100)
    : 15; // Realistic pre-computed margin discount

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedVariant && aggregateStock > 0) {
      addToCart(product.id, selectedVariant.id, 1);
    }
  };

  const handleCardClick = () => {
    setActiveProductDetailId(product.id);
    setActivePage('product-detail');
  };

  return (
    <div
      onClick={handleCardClick}
      className="product-card group bg-white border border-slate-200/80 rounded-2xl p-3.5 flex flex-col justify-between hover:shadow-xl hover:border-teal-500/30 transition-all duration-300 relative cursor-pointer"
    >
      {/* Discount Tag overlay */}
      {discountPercent > 0 && aggregateStock > 0 && (
        <div className="absolute top-3.5 left-3.5 bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm z-10 animate-pulse">
          <Percent size={10} />
          <span>{discountPercent}% OFF</span>
        </div>
      )}

      {/* Product Image section with hover effect */}
      <div className="relative w-full aspect-square rounded-xl bg-slate-50 overflow-hidden mb-3.5 border border-slate-100 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button className="bg-white text-slate-800 p-2 rounded-full shadow-md hover:bg-teal-600 hover:text-white transition-colors">
            <Eye size={16} />
          </button>
        </div>
      </div>

      {/* Brand & Stars */}
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="text-[10px] font-bold text-teal-700 uppercase tracking-widest leading-none bg-teal-50 px-1.5 py-0.5 rounded">
          {product.brand}
        </span>
        <div className="flex items-center gap-0.5 text-amber-500">
          <Star size={11} className="fill-amber-500 stroke-amber-500" />
          <span className="text-[10px] font-bold text-slate-700 leading-none">{product.rating}</span>
        </div>
      </div>

      {/* Main title */}
      <h3 className="text-sm font-semibold text-slate-950 mb-2 group-hover:text-teal-700 transition-colors line-clamp-1">
        {product.name}
      </h3>

      {/* Variant Selector Bubble options */}
      <div className="mb-3.5" onClick={(e) => e.stopPropagation()}>
        <select
          value={selectedVarId}
          onChange={(e) => setSelectedVarId(e.target.value)}
          className="w-full text-xs font-semibold px-2 py-1.5 border border-slate-200 bg-slate-50 text-slate-800 rounded-lg cursor-pointer transition-all"
        >
          {product.variants.map((v) => {
            const vBatches = batches.filter(b => b.productId === product.id && b.variantId === v.id);
            const vStock = vBatches.reduce((sum, b) => sum + b.quantity, 0);
            return (
              <option key={v.id} value={v.id}>
                {v.name} {vStock === 0 ? '(Out of stock)' : ''}
              </option>
            );
          })}
        </select>
      </div>

      {/* Pricing & Cart Action Block */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-slate-100">
        <div className="flex flex-col">
          {activeBatch ? (
            <>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-black text-slate-900">₹{activeBatch.sellingPrice}</span>
                <span className="text-[10px] text-slate-400 line-through">₹{Math.round(activeBatch.purchasePrice * 1.4)}</span>
              </div>
              {aggregateStock <= 3 && aggregateStock > 0 ? (
                <span className="text-[9px] font-bold text-orange-600 font-mono animate-pulse">Low stock: {aggregateStock} pack</span>
              ) : aggregateStock > 0 ? (
                <span className="text-[9px] font-bold text-green-600 font-mono flex items-center justify-start gap-0.5 leading-none mt-0.5">
                  <CheckCircle size={8} /> In Stock
                </span>
              ) : (
                <span className="text-[9px] font-bold text-red-600 font-mono flex items-center justify-start gap-0.5 leading-none mt-0.5">
                  <PackageX size={8} /> Sold Out
                </span>
              )}
            </>
          ) : (
            <span className="text-xs font-bold text-red-500 font-mono">No Active Batches</span>
          )}
        </div>

        {aggregateStock > 0 ? (
          <button
            onClick={handleAddToCart}
            className="px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-600 hover:text-white rounded-lg text-xs font-black transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-sm"
          >
            ADD
            <span className="font-semibold text-sm">+</span>
          </button>
        ) : (
          <button
            disabled
            className="px-2 py-1.5 bg-slate-100 text-slate-400 rounded-lg text-xs font-bold cursor-not-allowed border border-slate-200"
          >
            Out
          </button>
        )}
      </div>
    </div>
  );
}
export { ProductCard as default };
