/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowLeft, Code, Terminal, Globe, Server, Cpu } from "lucide-react";

export default function ApiDocs() {
  const baseUrl = window.location.origin;

  const endpoints = [
    {
      method: "GET",
      path: "/api/validate/email",
      desc: "Verify if a specific email address belongs to a registered university domain.",
      params: [
        { name: "email", type: "string", desc: "The full email address to validate (e.g., student@du.ac.bd)" }
      ]
    },
    {
      method: "GET",
      path: "/api/validate/domain",
      desc: "Check if a domain name is officially registered to a university in Bangladesh.",
      params: [
        { name: "domain", type: "string", desc: "The domain name to check (e.g., nsu.edu)" }
      ]
    },
    {
      method: "GET",
      path: "/api/universities",
      desc: "Retrieve a list of all verified universities.",
      params: [
        { name: "q", type: "string", desc: "Search query (names, slugs, or districts)" },
        { name: "category", type: "string", desc: "Filter by 'Public', 'Private', or 'International'" }
      ]
    },
    {
      method: "GET",
      path: "/api/universities/:slug",
      desc: "Get detailed institutional data, leadership info, and campus locations.",
      params: [
        { name: "slug", type: "string", desc: "The unique slug identifier (e.g., 'university-of-dhaka')" }
      ]
    },
    {
      method: "GET",
      path: "/api/categories",
      desc: "List all active institutional classifications.",
      params: []
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 overflow-x-hidden flex flex-col">
      <Header />

      <main className="max-w-5xl mx-auto px-4 md:px-8 mt-16 flex-1 w-full">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="h-8 w-8 text-blue-600" />
            <h2 className="text-4xl font-extrabold tracking-tight">API Documentation</h2>
          </div>
          <p className="text-xl text-slate-500 max-w-3xl leading-relaxed">
            Build specialized applications, search engines, or academic tools using our high-performance REST API. 
            Our endpoints serve cryptographically verified data refreshed daily from official UGC records.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-16">
            {endpoints.map((ep) => (
              <section key={ep.path} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded uppercase">{ep.method}</span>
                  <code className="text-lg font-mono font-bold text-slate-800">{ep.path}</code>
                </div>
                <p className="text-slate-600 mb-6">{ep.desc}</p>
                
                {ep.params.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Query Parameters</h4>
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-3 font-bold text-slate-700">Parameter</th>
                            <th className="px-6 py-3 font-bold text-slate-700">Type</th>
                            <th className="px-6 py-3 font-bold text-slate-700">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {ep.params.map(p => (
                            <tr key={p.name}>
                              <td className="px-6 py-4 font-mono text-blue-600 font-bold">{p.name}</td>
                              <td className="px-6 py-4 text-slate-500">{p.type}</td>
                              <td className="px-6 py-4 text-slate-600">{p.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Example Request (cURL)</h4>
                  </div>
                  <div className="bg-slate-900 rounded-2xl p-6 overflow-x-auto shadow-xl">
                    <pre className="text-blue-400 font-mono text-sm">
                      {`curl -X GET "${baseUrl}${ep.path.replace(':slug', 'north-south-university')}" \\
  -H "Accept: application/json"`}
                    </pre>
                  </div>
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sticky top-24 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">API Specifications</h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <Globe className="h-5 w-5 text-slate-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">CORS Support</h4>
                    <p className="text-xs text-slate-500 mt-1">Enabled for all domains to support client-side integrations.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Cpu className="h-5 w-5 text-slate-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Response Format</h4>
                    <p className="text-xs text-slate-500 mt-1">Standard JSON (UTF-8). Status codes follow REST conventions.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Server className="h-5 w-5 text-slate-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Rate Limiting</h4>
                    <p className="text-xs text-slate-500 mt-1">100 requests / minute per IP for public endpoints.</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-10 pt-8 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 font-medium italic">
                  Looking for a custom data export? Check our sitemap for full institutional coverage.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
