import React from 'react';
import { CustomerHeader } from '../../components/layout/CustomerHeader';
import { Phone } from 'lucide-react';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      <CustomerHeader />

      <main className="flex-grow p-4 md:p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800 mt-12 select-none">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col gap-3">
            <span className="font-black text-white text-lg font-display tracking-wider">RUDRAX SUPERSTORE</span>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Certified premium grocery essentials, packaged snackers, Ayurvedic cosmetics, and sanitizers instantly dispatched to your locale.
            </p>
          </div>
          <div>
            <span className="font-bold text-slate-300 text-xs uppercase block mb-3 font-mono">Company</span>
            <ul className="text-xs font-medium flex flex-col gap-2.5">
              <li><a href="#" className="hover:text-amber-400 transition-colors">About Rudrax Co</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Store Locator</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Press Releases</a></li>
            </ul>
          </div>
          <div>
            <span className="font-bold text-slate-300 text-xs uppercase block mb-3 font-mono">Consumer Policies</span>
            <ul className="text-xs font-medium flex flex-col gap-2.5">
              <li><a href="#" className="hover:text-amber-400 transition-colors">15-Min Refund Policies</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Terms of checkout</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">SSL Encryption Specs</a></li>
            </ul>
          </div>
          <div>
            <span className="font-bold text-slate-300 text-xs uppercase block mb-3 font-mono">Hotline Support</span>
            <ul className="text-xs font-medium flex flex-col gap-2.5">
              <li className="flex items-center gap-1.5"><Phone size={13} /> +1(800) RDX-FRESH</li>
              <li>Email: support@rudrax.com</li>
              <li className="text-[10px] text-slate-500 mt-2 font-mono">© 2026 Rudrax Retail Platform. All rights reserved.</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
