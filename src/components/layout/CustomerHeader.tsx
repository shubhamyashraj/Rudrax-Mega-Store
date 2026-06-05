import { useRudrax } from '../../app/StateContext';
import { ShoppingCart, Search, User, Sparkles } from 'lucide-react';

export function CustomerHeader() {
  const {
    cart,
    currentRole,
    setRole,
    activePage,
    setActivePage,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    currentUser,
    orders,
    batches
  } = useRudrax();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = batches.filter(b => b.quantity <= 5 && b.quantity > 0).length;

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (activePage !== 'catalog' && activePage !== 'home') {
      setActivePage('catalog');
    }
  };

  const categoriesList = ["All", "Grocery", "Daily Essentials", "Household", "Personal Care", "Packaged Foods"];

  return (
    <header className="header flex flex-col w-full bg-white shadow-sm border-b border-slate-100 z-30 sticky top-0">
      {/* Top Announcement Bar */}
      <div className="bg-teal-900 text-white text-xs py-2 px-4 flex justify-between items-center font-medium md:flex-row flex-col gap-1.5 font-sans">
        <div className="flex items-center gap-1.5">
          <BadgeHighlight>Dhamaka Offer</BadgeHighlight>
          <span>Flat 30% OFF on dynamic weekly staples! Code <strong className="text-amber-300">FRESH30</strong></span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-300 font-mono">
          <span>⏰ Delivery within 15 Minutes</span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline">🚚 Free Shipping above ₹499</span>
        </div>
      </div>

      {/* Role Switcher Toolbar for Playtesting/Evaluation */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-2 flex md:justify-between justify-center items-center flex-wrap gap-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-slate-300">Simulating Live Firebase Environment:</span>
          <span className="bg-slate-850 text-slate-350 px-2 py-0.5 rounded text-[10px]">d8bbeae6-applet-run</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-xs font-semibold">Current View:</span>
          <div className="inline-flex gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => { setRole('Customer'); setActivePage('home'); }}
              className={`px-3 py-1 rounded-md transition-all text-xs cursor-pointer font-medium flex items-center gap-1 ${
                currentRole === 'Customer'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingCart size={13} /> Customer Shop
            </button>
            {currentUser && (currentUser.role === 'Admin' || currentUser.role === 'SuperAdmin') && (
              <button
                onClick={() => { setRole('Admin'); }}
                className={`px-3 py-1 rounded-md transition-all text-xs cursor-pointer font-medium flex items-center gap-1 ${
                  currentRole === 'Admin'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User size={13} /> Admin Portal
                {lowStockCount > 0 && (
                  <span className="bg-red-600 text-white font-bold h-4 px-1.5 rounded-full text-[9px] flex items-center justify-center">
                    {lowStockCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary Utility Header */}
      <div className="max-w-7xl mx-auto w-full px-4 md:py-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActivePage('home'); setSearchQuery(''); }}>
          <div className="h-10 w-10 bg-gradient-to-tr from-teal-800 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-teal-800/20">
            <span className="font-extrabold text-xl font-sans tracking-tight">R</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-slate-900 font-sans tracking-tight leading-none flex items-center gap-1">
              RUDRAX <span className="text-teal-700 text-[10px] font-black tracking-widest border border-teal-200 bg-teal-50 px-1.5 py-0.5 rounded leading-none">MEGA STORE</span>
            </span>
            <span className="text-[9px] text-slate-500 font-semibold tracking-widest uppercase mt-0.5 font-mono">Multi-Category Platform</span>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl relative hidden md:block">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search Basmati Rice, Fresh Whole Milk, Detergents..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:bg-white text-slate-800 transition-all font-medium"
          />
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-5">
          {/* Loyalty Score Card */}
          {currentUser ? (
            <div className="hidden lg:flex flex-col items-end border-r border-slate-100 pr-5">
              <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-mono">
                <Sparkles size={11} className="fill-amber-500 text-amber-500" />
                <span>{currentUser.loyaltyPoints} loyalty pts</span>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex flex-col items-end border-r border-slate-100 pr-5">
              <div className="flex items-center gap-1 text-[11px] text-teal-600 font-bold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 font-mono">
                <Sparkles size={11} className="text-teal-600" />
                <span>Guest Loyalty</span>
              </div>
            </div>
          )}

          {/* User profile toggle */}
          <button
            onClick={() => setActivePage('profile')}
            className={`flex items-center gap-2 font-medium text-sm transition-colors text-slate-700 hover:text-teal-600 cursor-pointer ${
              activePage === 'profile' ? 'text-teal-600 font-bold' : ''
            }`}
          >
            <User size={19} className="text-slate-700" />
            <span className="hidden md:inline truncate max-w-[120px]">
              {currentUser ? currentUser.name : 'Sign In'}
            </span>
          </button>

          {/* Cart Icon trigger */}
          <button
            onClick={() => setActivePage('cart')}
            className="relative p-2.5 bg-slate-50 text-slate-700 hover:text-teal-600 rounded-xl transition-all hover:bg-teal-50/50 cursor-pointer border border-slate-100 flex items-center justify-center"
          >
            <ShoppingCart size={20} className="stroke-2" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-650 text-white font-bold h-5 min-w-[20px] px-1 rounded-full text-[10px] flex items-center justify-center shadow-md shadow-red-200 animate-bounce">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Input */}
      <div className="px-4 pb-3 flex md:hidden w-full">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search Basmati Rice, Fresh Whole Milk, Detergents..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:bg-white text-slate-800 font-medium"
          />
        </div>
      </div>

      {/* Categorized Quick Nav Menu */}
      <div className="border-t border-slate-100 bg-slate-50/70 py-2.5 overflow-x-auto w-full scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-xs font-semibold">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setActivePage('catalog');
              }}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/10'
                  : 'text-slate-600 bg-white hover:bg-slate-100/80 border border-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function BadgeHighlight({ children }: { children: string }) {
  return (
    <span className="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wide inline-block mr-1 font-mono">
      {children}
    </span>
  );
}
