/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowLeft, Database, RefreshCcw, ShieldCheck, Globe, Info } from "lucide-react";

export default function About() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 overflow-x-hidden flex flex-col">
      <Header />

      <main className="max-w-4xl mx-auto px-4 md:px-8 mt-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Securing Transparency in Higher Education
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            BD University Index is an open-data initiative providing the most accurate, real-time directory of Bangladesh's higher education institutions. Our mission is to ensure that institutional information is accessible, verifiable, and free from manipulation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <Database className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Official Accountability</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              We operate as a mirror to the <strong>University Grants Commission (UGC)</strong>. By providing a secondary, permanent record of approvals, we ensure that changes to institutional status are documented and searchable by the public, faculty, and international bodies for credit transfer verification.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="h-12 w-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
              <RefreshCcw className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Open Source Integrity</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              The BD University Index platform is fully open source. Anyone can audit our scraping logic, data parsing algorithms, and tracking systems. This architectural honesty guarantees that our directory reflects reality without bias.
            </p>
          </div>
        </div>

        <section className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <ShieldCheck className="h-64 w-64" />
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-8">Why use the Index?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex gap-4">
                <Globe className="h-6 w-6 text-blue-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-lg mb-2">Verified Domains</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Prevent phishing and fraud by verifying the official web presence of any institution.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Info className="h-6 w-6 text-blue-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-lg mb-2">Leadership Directory</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Access officially registered details of Vice Chancellors, Registrars, and Treasurers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-20 text-center border-t border-slate-200 pt-10">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">
            Supporting Open Data standards
          </p>
          <div className="flex justify-center gap-8">
            <img src="https://img.shields.io/badge/API-REST-blue" alt="API" />
            <img src="https://img.shields.io/badge/Sync-Full_Automated-brightgreen" alt="Sync" />
            <img src="https://img.shields.io/badge/Security-UGC_Verified-gold" alt="Security" />
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Global Disclaimer */}
      <div className="bg-slate-100 py-6 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
           <p className="text-[10px] text-slate-400 leading-relaxed text-center italic">
             Disclaimer: BD University Index is an independent data accessibility project. While we strive to maintain perfect accuracy by mirroring official UGC records, this platform is not an official government directory. Users are encouraged to verify critical information directly with the University Grants Commission of Bangladesh.
           </p>
        </div>
      </div>
    </div>
  );
}
