import React from 'react';
import { useRudrax } from '../../app/StateContext';
import { ProductCard } from '../../components/customer/ProductCard';
import { Button } from '../../components/ui/atoms';
import { ShoppingBag, Sparkles, Gift, ChevronRight } from 'lucide-react';

export function HomePage() {
  const { products, setSelectedCategory, setActivePage } = useRudrax();

  return (
    <div className="flex flex-col gap-10 select-none pb-12 animate-fadeIn">
      {/* Bento-style Hero Banner - Ultra Polished Styling */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 text-white rounded-3xl p-6 md:p-12 border border-slate-800 shadow-xl">
        <div className="absolute right-0 top-0 opacity-[0.03] transform scale-150 translate-x-20 translate-y-10 pointer-events-none text-teal-400">
          <ShoppingBag size={450} />
        </div>
        
        {/* Glow Effects */}
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-20 bottom-0 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          <div className="md:col-span-7 flex flex-col items-start gap-5">
            <span className="bg-amber-400/10 border border-amber-400/20 text-amber-300 font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 font-mono">
              <Sparkles size={11} className="fill-amber-300 text-amber-300 animate-pulse" /> 
              Instant Hyperlocal Logistics
            </span>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight leading-[1.08] text-white">
              Sourced Fresh. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-400 to-amber-300">
                Delivered Sustainably.
              </span>
            </h1>
            
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md font-medium">
              Rudrax brings brand-certified native seeds, fresh crop harvests, high-voltage kitchenwares, and premium lifestyle essentials directly to your locale.
            </p>
            
            <div className="flex gap-3 flex-wrap mt-2">
              <Button 
                variant="secondary" 
                size="md" 
                onClick={() => { setSelectedCategory('All'); setActivePage('catalog'); }}
                className="shadow-md shadow-amber-500/10 text-slate-950"
              >
                Explore Mega Store
              </Button>
              <Button 
                variant="outline" 
                size="md" 
                onClick={() => { setSelectedCategory('Grocery'); setActivePage('catalog'); }}
                className="border-slate-700/60 text-slate-200 hover:bg-slate-800/50 hover:text-white"
              >
                Pantry Staples
              </Button>
            </div>
          </div>

          {/* Interactive Bento Promos Column */}
          <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between h-40 hover:border-teal-500/30 transition-all duration-300">
              <div>
                <span className="text-teal-400 font-bold text-[9px] uppercase tracking-widest font-mono block mb-1">FRESH CONGREGATION</span>
                <h3 className="font-bold text-slate-200 text-xs font-display">Hydrated Houseplants</h3>
                <p className="text-[11px] text-slate-400 mt-1 font-sans">Water-misted indoor flora ready for nursery checkout.</p>
              </div>
              <span className="text-amber-400 font-black font-mono text-[11px]">Free delivery above ₹499</span>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between h-40 hover:border-indigo-500/30 transition-all duration-300">
              <div>
                <span className="text-indigo-400 font-bold text-[9px] uppercase tracking-widest font-mono block mb-1">AGRO REFORMS</span>
                <h3 className="font-bold text-slate-200 text-xs font-display">Hybrid Wheat Germs</h3>
                <p className="text-[11px] text-slate-400 mt-1 font-sans">Kalyan Sona elite bags with guaranteed germination.</p>
              </div>
              <span className="text-amber-400 font-black font-mono text-[11px]">Best prices online</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section - Polished with Fluid Flex */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black font-display text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="h-5 w-1 bg-teal-700 rounded-full" />
            Explore Store Sectors
          </h2>
          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest">ESTABLISHED 2026</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { cat: 'Electronics', label: 'Cooling & Electric', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300' },
            { cat: 'Clothing', label: 'Apparels & Wearables', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=300' },
            { cat: 'Grocery', label: 'Staples & Spices', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=300' },
            { cat: 'Seeds', label: 'Crops & Farming', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=300' },
            { cat: 'Plants', label: 'Indoor Foliage', img: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=300' },
            { cat: 'Puja Items', label: 'Festivity & Puja', img: 'https://images.unsplash.com/photo-1609137144814-7d5a5783cedb?auto=format&fit=crop&q=80&w=300' }
          ].map((item) => (
            <div
              key={item.cat}
              onClick={() => { setSelectedCategory(item.cat); setActivePage('catalog'); }}
              className="group relative h-36 rounded-2xl overflow-hidden shadow-xs border border-slate-200 cursor-pointer transition-all duration-300 hover:shadow-md hover:border-teal-400"
            >
              <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors duration-300 z-10" />
              <img src={item.img} referrerPolicy="no-referrer" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 flex flex-col justify-end p-3 z-20">
                <span className="font-extrabold text-white text-xs leading-none tracking-tight block font-display">{item.label}</span>
                <span className="text-[9px] text-teal-300 font-mono font-bold mt-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">Shop Now →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended & Trending Products Rows */}
      <section className="flex flex-col gap-5 pt-2">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-black font-display text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="h-5 w-1 bg-teal-700 rounded-full" />
            Top Recommended Staples
          </h2>
          <button
            onClick={() => { setSelectedCategory('All'); setActivePage('catalog'); }}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer transition-colors"
          >
            Show full catalog <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.slice(0, 5).map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Promotional Loyalty Offer Slider Grid */}
      <section className="bg-amber-400 hover:bg-amber-400/90 hover:shadow-md border border-amber-200 p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-slate-950 rounded-2xl flex items-center justify-center text-amber-400 shadow-md flex-shrink-0">
            <Gift size={22} />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-black text-slate-955 text-sm md:text-base leading-none text-slate-950 font-display">
              Rudrax Premium Cash-back Loyalty Wallet
            </h3>
            <p className="text-slate-800 font-semibold text-xs leading-relaxed max-w-xl">
              Get an instant 5 loyalty privilege credits on every check-out transaction. Accumulate and redeem credits directly to save money on daily harvests.
            </p>
          </div>
        </div>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={() => setActivePage('profile')} 
          className="bg-slate-950 hover:bg-slate-950 border-slate-950 hover:border-slate-950 text-white font-extrabold text-[11px] shadow-sm whitespace-nowrap self-stretch sm:self-auto"
        >
          Check Wallet Profile
        </Button>
      </section>

      {/* New arrivals shelf section */}
      <section className="flex flex-col gap-5 pt-2">
        <h2 className="text-sm font-black font-display text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <span className="h-5 w-1 bg-teal-700 rounded-full" />
          Fresh Arrivals This Week
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.slice(4, 9).map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>
    </div>
  );
}
export { HomePage as Home };
