import React from 'react';
import { AdminSidebar } from '../../components/common/Sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      <AdminSidebar />
      <main className="flex-grow p-6 md:p-8 max-w-7xl w-full mx-auto md:max-h-screen md:overflow-y-auto">
        
        {/* Synchronized alert banner */}
        <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 text-amber-900 border border-amber-500/20 px-4 py-3 rounded-2xl text-xs font-semibold mb-6 flex justify-between items-center leading-relaxed">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
            <span>Store Database Synchronized: Local state changes mapped to simulated Firestore entities.</span>
          </div>
          <span className="hidden sm:inline bg-white px-2 py-0.5 rounded border text-[10px] text-slate-400 font-bold font-mono">v1.2.0-live-sync</span>
        </div>

        {children}
      </main>
    </div>
  );
}
