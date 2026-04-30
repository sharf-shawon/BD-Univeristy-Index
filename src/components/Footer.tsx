/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-16 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:bg-blue-600 transition-colors">B</div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-slate-900">BD University Index</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© 2026 Data Accessibility Initiative</p>
          </div>
        </Link>
        <nav className="flex gap-10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <Link to="/universities" className="hover:text-blue-600 transition-colors">Directory Index</Link>
          <Link to="/api-docs" className="hover:text-blue-600 transition-colors">Developer Console</Link>
          <Link to="/about" className="hover:text-blue-600 transition-colors">Legal & Compliance</Link>
          <a href="https://ugc.gov.bd" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">UGC Official</a>
        </nav>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          Data Integrity: <span className="text-green-500 flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Synchronized</span>
        </div>
      </div>
    </footer>
  );
}
