/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  Search, 
  Map as MapIcon, 
  ShieldCheck, 
  ArrowRight, 
  GraduationCap, 
  Globe, 
  Zap,
  ChevronRight,
  Database,
  CheckCircle2
} from "lucide-react";
import { motion } from "motion/react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { University, UniversityApiResponse } from "../types";
import { DISTRICT_COORDS } from "../constants";

// Fix for Leaflet default icon issues in React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  return null;
}

export default function Home() {
  const [stats, setStats] = useState({ total: 0, public: 0, private: 0, international: 0 });
  const [universities, setUniversities] = useState<University[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [validationEmail, setValidationEmail] = useState("");
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; message: string } | null>(null);

  useEffect(() => {
    document.title = "BD University Index | Official UGC Approved University Directory & Verification";
    const fetchStats = async () => {
      try {
        const response = await axios.get<UniversityApiResponse>("/api/universities");
        const data = response.data.data;
        setUniversities(data);
        setStats({
          total: data.length,
          public: data.filter(u => u.category === 'Public').length,
          private: data.filter(u => u.category === 'Private').length,
          international: data.filter(u => u.category === 'International').length,
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  const handleValidate = async () => {
    if (!validationEmail) return;
    try {
      const response = await axios.get(`/api/validate/email?email=${validationEmail}`);
      setValidationResult({
        isValid: response.data.isValid,
        message: response.data.match 
          ? `Verified institution: ${response.data.match.name}` 
          : "No matching institutional record found."
      });
    } catch (err) {
      setValidationResult({ isValid: false, message: "Validation service error." });
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 overflow-x-hidden">
      {/* SEO Header - Hidden from users but visible to crawlers */}
      <h1 className="sr-only">BD University Index - Official UGC Approved Universities List Bangladesh - Verified Directory & API</h1>

      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-8 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Zap className="h-3 w-3" /> Real-time UGC Data Sync
            </div>
            <h2 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[0.95] mb-8">
              Verify Bangladesh's <span className="text-blue-600">Academic</span> Infrastructure.
            </h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl mb-12">
              The premier open-data registry for all 170+ approved universities in Bangladesh. 
              Search by domain, validate academic emails, and access authoritative institutional data via a production-grade API.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Ex: North South University"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (window.location.href=`/universities?q=${searchQuery}`)}
                />
              </div>
              <button 
                onClick={() => window.location.href=`/universities?q=${searchQuery}`}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
              >
                Find Institution <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-slate-100 pt-10">
              <div>
                <dt className="text-2xl font-black text-slate-900">{stats.total}+</dt>
                <dd className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Universities</dd>
              </div>
              <div>
                <dt className="text-2xl font-black text-slate-900">{stats.public}</dt>
                <dd className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Public Unis</dd>
              </div>
              <div>
                <dt className="text-2xl font-black text-slate-900">{stats.private}</dt>
                <dd className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Private Unis</dd>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-4 shadow-2xl shadow-slate-200 overflow-hidden group">
              <div className="h-[500px] w-full rounded-[2rem] overflow-hidden bg-slate-100 relative grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700">
                <MapContainer 
                  center={[23.6850, 90.3563]} 
                  zoom={7} 
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                  <MapResizer />
                  {universities.filter(u => u.district && DISTRICT_COORDS[u.district]).map((u) => (
                    <Marker 
                      key={u.id} 
                      position={[DISTRICT_COORDS[u.district!].lat + (Math.random() - 0.5) * 0.1, DISTRICT_COORDS[u.district!].lng + (Math.random() - 0.5) * 0.1]}
                    >
                      <Popup>
                        <div className="p-1">
                          <h4 className="font-bold text-slate-900 text-sm leading-tight mb-1">{u.name}</h4>
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{u.category}</span>
                          <Link to={`/universities/${u.slug}`} className="block text-[10px] font-bold text-slate-400 mt-2 hover:text-blue-600">View Registry Profile →</Link>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
              <div className="absolute bottom-10 left-10 right-10 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl p-4 shadow-xl">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          <MapIcon className="h-4 w-4" />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Academic Standing</p>
                          <p className="text-xs font-bold text-slate-800">Visualizing 170+ Accredited Campuses</p>
                       </div>
                    </div>
                    <div className="h-8 w-24 bg-blue-600/10 rounded-lg flex items-center justify-center">
                       <span className="text-[10px] font-bold text-blue-600">Map Live</span>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section: Identity Validator */}
      <section className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600 px-3 py-1.5 rounded-full text-white text-[10px] font-bold uppercase tracking-widest mb-10">
            <ShieldCheck className="h-3.5 w-3.5" /> Institutional Security
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            Instant Domain <span className="text-blue-400">Verification.</span>
          </h2>
          <p className="text-slate-400 font-medium max-w-2xl mx-auto mb-16">
            Prevent impersonation and academic fraud. Our validator cross-references IDs against 
            the official registered institutional domains of universities.
          </p>

          <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
             <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="student@institution.edu"
                  className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  value={validationEmail}
                  onChange={(e) => setValidationEmail(e.target.value)}
                />
                <button 
                  onClick={handleValidate}
                  className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all shadow-xl"
                >
                  Verify Now
                </button>
             </div>
             {validationResult && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className={`mt-8 p-4 rounded-2xl flex items-center gap-3 border ${
                   validationResult.isValid ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                 }`}
                >
                  {validationResult.isValid ? <CheckCircle2 className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                  <span className="text-sm font-bold">{validationResult.message}</span>
                </motion.div>
             )}
          </div>
        </div>
      </section>

      {/* Categories & Insights */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-center md:text-left">
          <div className="max-w-xl">
             <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Registry Categories</h3>
             <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none mb-6">
                Institutional Diversity, <br/>Verified Accountability.
             </h2>
             <p className="text-slate-500 font-medium">Categorized by the University Grants Commission, each institution in our registry holds a distinct legal status in the higher education landscape.</p>
          </div>
          <Link to="/universities" className="group flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest">
            Explore All 170+ <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
           {[
             { title: 'Public Universities', count: stats.public, icon: <GraduationCap className="h-6 w-6"/>, color: 'bg-blue-600', desc: 'State-funded flagship research and academic institutions leading the nation.', slug: 'Public' },
             { title: 'Private Institutions', count: stats.private, icon: <ShieldCheck className="h-6 w-6"/>, color: 'bg-indigo-600', desc: 'Approved private higher education providers offering specialized degrees.', slug: 'Private' },
             { title: 'International Centers', count: stats.international, icon: <Globe className="h-6 w-6"/>, color: 'bg-emerald-600', desc: 'Intergovernmental and multinational universities operating in Bangladesh.', slug: 'International' }
           ].map((cat) => (
             <div key={cat.title} className="bg-white border border-slate-200 rounded-[2.5rem] p-10 hover:shadow-xl hover:shadow-slate-200 transition-all group">
                <div className={`${cat.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-200`}>
                  {cat.icon}
                </div>
                <h4 className="text-2xl font-extrabold text-slate-900 mb-4">{cat.title}</h4>
                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">{cat.desc}</p>
                <div className="flex items-center justify-between mt-auto pt-8 border-t border-slate-50">
                   <span className="text-3xl font-black text-slate-900">{cat.count}</span>
                   <Link to={`/universities?category=${cat.slug}`} className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ChevronRight className="h-5 w-5" />
                   </Link>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* API Teaser */}
      <section className="pb-32 px-8 max-w-7xl mx-auto">
         <div className="bg-slate-50 rounded-[3rem] p-8 md:p-20 grid lg:grid-cols-2 gap-16 items-center">
            <div>
               <div className="inline-flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full text-white text-[10px] font-bold uppercase tracking-widest mb-8">
                  <Database className="h-3.5 w-3.5" /> High-Performance API
               </div>
               <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none mb-8">
                  Build with <span className="text-blue-600">Authority</span> Data.
               </h2>
               <p className="text-slate-500 font-medium leading-relaxed mb-10">
                  Integrate Bangladesh's educational directory directly into your products. 
                  Our RESTful API provides machine-readable JSON data for verification platforms, search engines, and research tools.
               </p>
               <Link to="/api-docs" className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-blue-600 transition-all">
                  Access API Key <ArrowRight className="h-4 w-4" />
               </Link>
            </div>
            <div className="bg-slate-900 rounded-[2rem] p-1 shadow-2xl overflow-hidden">
               <div className="bg-slate-800/50 rounded-[1.8rem] p-8 overflow-x-auto text-blue-400 font-mono text-sm leading-relaxed">
                  <p className="text-slate-500 mb-2"># Fetch official university detail</p>
                  <p className="mb-4">curl https://unibd.registry.gov/api/v1/validation/email \</p>
                  <p className="pl-4">{"-d 'email=dean@nsu.edu'"}</p>
                  <p className="text-green-400 mt-8">{"{"}</p>
                  <p className="pl-6 text-slate-300">{"\"isValid\": true,"}</p>
                  <p className="pl-6 text-slate-300">{"\"institution\": \"North South University\","}</p>
                  <p className="pl-6 text-slate-300">{"\"verification\": \"UGC SECURE\""}</p>
                  <p className="text-green-400">{"}"}</p>
               </div>
            </div>
         </div>
      </section>

      <Footer />
      
      {/* Global Disclaimer */}
      <div className="bg-slate-100 py-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
           <p className="text-[10px] text-slate-400 leading-relaxed text-center italic">
             Disclaimer: BD University Index is an independent data accessibility project. While we strive to maintain perfect accuracy by mirroring official UGC records, this platform is not an official government directory. Users are encouraged to verify critical information directly with the University Grants Commission of Bangladesh.
           </p>
        </div>
      </div>
    </div>
  );
}
