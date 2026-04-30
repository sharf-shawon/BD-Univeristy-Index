/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02] active:scale-[0.98]">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl ring-4 ring-blue-50/50 shadow-sm group-hover:bg-blue-700 transition-colors">B</div>
        <div className="hidden sm:block">
          <h2 className="text-lg font-bold tracking-tight leading-none text-slate-900">BD University Index</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 text-nowrap">Visualizing Official UGC Data</p>
        </div>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden lg:flex gap-8 text-sm font-bold text-slate-500">
        <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <Link to="/universities" className="hover:text-blue-600 transition-colors">Directory</Link>
        <Link to="/api-docs" className="hover:text-blue-600 transition-colors">API Portal</Link>
        <Link to="/about" className="hover:text-blue-600 transition-colors">About</Link>
      </nav>

      <div className="flex items-center gap-4">
        <Link to="/universities" className="hidden sm:flex bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">
          Access Registry
        </Link>
        
        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[73px] bg-white z-40 lg:hidden p-8 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-slate-900">Home</Link>
          <Link to="/universities" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-slate-900">Directory</Link>
          <Link to="/api-docs" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-slate-900">API Portal</Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-slate-900">About</Link>
          <Link to="/universities" onClick={() => setIsMenuOpen(false)} className="mt-4 bg-blue-600 text-white py-4 rounded-2xl text-center font-bold uppercase tracking-widest">
            Browse Registry
          </Link>
        </div>
      )}
    </header>
  );
}
