/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/90 px-8 py-12 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white shadow-lg shadow-slate-200 transition-transform group-hover:-translate-y-0.5">
            B
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-900">BD University Index</p>
            <p className="text-xs text-slate-500">Official UGC-approved university registry</p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          <Link to="/universities" className="transition-colors hover:text-blue-600">Directory</Link>
          <Link to="/api-docs" className="transition-colors hover:text-blue-600">API</Link>
          <Link to="/about" className="transition-colors hover:text-blue-600">About</Link>
          <a href="https://ugc.gov.bd" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-blue-600">UGC</a>
        </nav>

        <div className="text-sm text-slate-500">
          <span className="font-medium text-slate-900">Built by </span>
          <a href="https://shawon.me" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 transition-colors hover:text-blue-700">
            Sharfuddin Shawon
          </a>
          <span className="mx-2 text-slate-300">·</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Always in sync</span>
        </div>
      </div>
    </footer>
  );
}
