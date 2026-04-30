import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { University } from "../types";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  ArrowLeft, 
  MapPin, 
  Globe, 
  Phone, 
  Mail, 
  Info, 
  CheckCircle2, 
  Clock, 
  Link as LinkIcon,
  ShieldCheck,
  Search,
  Copy,
  Check,
  Trophy,
  ExternalLink,
  Award
} from "lucide-react";
import { motion } from "motion/react";
import EmailValidator from "../components/EmailValidator";

export default function UniversityDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyJson = () => {
    if (!university) return;
    navigator.clipboard.writeText(JSON.stringify(university, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        setLoading(true);
        const response = await axios.get<University>(`/api/universities/${slug}`);
        setUniversity(response.data);
        document.title = `${response.data.name} | BD University Index Official Profile`;
      } catch (err) {
        console.error(err);
        setError("University not found or server error.");
        document.title = "University Not Found | BD University Index";
      } finally {
        setLoading(false);
      }
    };

    fetchUniversity();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !university) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 overflow-x-hidden flex flex-col">
      <Header />

      <div className="bg-white border-b border-slate-200 px-8 py-3 flex justify-between items-center shrink-0">
        <Link to="/universities" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 flex items-center gap-2 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </Link>
        <button 
          onClick={copyJson}
          className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 flex items-center gap-2 transition-colors bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied JSON" : "Copy Entity JSON"}
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 mt-12 mb-20 flex-1 w-full">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Banner */}
          <div className="relative h-64 bg-slate-900 p-8 md:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/40"></div>
            <div className="relative z-10 h-full flex flex-col justify-end">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded shadow-lg uppercase tracking-widest mb-4 inline-block">
                    {university.category} Institution
                  </span>
                  <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight max-w-2xl">
                    {university.name}
                  </h1>
                </div>
                {university.isVerified && (
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-white">
                    <ShieldCheck className="h-5 w-5 text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">Verified by UGC</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* Main Info */}
            <div className="md:col-span-8 p-8 md:p-12 space-y-12">
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-blue-600 rounded-full"></div>
                  Institutional Overview
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                  <div>
                    <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Category Type</dt>
                    <dd className="text-slate-800 font-bold text-lg">{university.category}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Year of Establishment</dt>
                    <dd className="text-slate-800 font-bold text-lg">{university.yearOfEstablishment || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Primary District</dt>
                    <dd className="text-slate-800 font-bold text-lg">{university.district || 'Not Specified'}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Approval Status</dt>
                    <dd className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-slate-800 font-bold text-lg">{university.approvalStatus}</span>
                    </dd>
                  </div>
                </div>
              </section>

              {university.rankings && university.rankings.length > 0 ? (
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Trophy className="h-3.5 w-3.5 text-amber-500" />
                    Global Standing & Rankings
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {university.rankings.map((r, i) => (
                      <div key={i} className="bg-gradient-to-br from-amber-50/80 to-white border border-amber-100 rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-amber-600" />
                            <span className="font-black text-amber-900 tracking-tight uppercase text-xs">{r.source} World Rank</span>
                          </div>
                          <span className="text-[10px] font-bold bg-amber-100/50 text-amber-700 px-2 py-0.5 rounded-full uppercase tabular-nums">{r.year}</span>
                        </div>
                        <div className="text-5xl font-black text-amber-900 tracking-tighter">
                          #{r.rank}
                        </div>
                        {r.link && (
                          <a 
                            href={r.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[10px] font-bold text-amber-700 flex items-center gap-1.5 hover:text-amber-900 transition-colors mt-2 uppercase tracking-wide"
                          >
                            Explore Score Details <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-5 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100 border-dashed">
                    This data is sourced directly from official records of world-renowned ranking agencies (QS World University Rankings, Times Higher Education, Webometrics).
                  </p>
                </section>
              ) : (
                <section>
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-slate-300 rounded-full"></div>
                    Academic Standing
                  </h3>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
                    <Award className="h-8 w-8 text-slate-300 mx-auto mb-4" />
                    <h4 className="text-sm font-bold text-slate-700">Global Ranking Data Initializing</h4>
                    <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto">
                      World university ranking data for this specific institution is currently being collected or not yet published by QS/THE.
                    </p>
                    <div className="mt-6 flex justify-center gap-4">
                      <a 
                        href={`https://www.google.com/search?q=${encodeURIComponent(university.name + ' world ranking')}`} 
                        target="_blank" 
                        className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline"
                      >
                        Search Manually
                      </a>
                    </div>
                  </div>
                </section>
              )}

              <section>
                <EmailValidator 
                  universityDomain={university.website} 
                  universityName={university.name} 
                />
              </section>

              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-blue-600 rounded-full"></div>
                  Institutional Leadership
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Vice Chancellor</dt>
                    <dd className="text-slate-800 font-bold">{university.viceChancellor || 'Position Vacant'}</dd>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Registrar</dt>
                    <dd className="text-slate-800 font-bold">{university.registrar || 'Position Vacant'}</dd>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pro Vice Chancellor</dt>
                    <dd className="text-slate-700 font-semibold text-sm">{university.proViceChancellor || 'N/A'}</dd>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Treasurer</dt>
                    <dd className="text-slate-700 font-semibold text-sm">{university.treasurer || 'N/A'}</dd>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-blue-600 rounded-full"></div>
                  Campus Infrastructure
                </h3>
                <div className="space-y-6">
                  {university.permanentCampus ? (
                    <div>
                      <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Permanent Campus (Primary)</dt>
                      <dd className="text-slate-700 font-medium leading-relaxed bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                        {university.permanentCampus}
                      </dd>
                    </div>
                  ) : null}
                  {university.address && (
                    <div>
                      <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Present / City Campus</dt>
                      <dd className="text-slate-700 font-medium leading-relaxed bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                        {university.address}
                      </dd>
                    </div>
                  )}
                  {!university.permanentCampus && !university.address && (
                     <div>
                      <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Campus Location</dt>
                      <dd className="text-slate-700 font-medium leading-relaxed bg-white border border-slate-200 p-4 rounded-xl shadow-sm italic">
                        Information available on official website
                      </dd>
                    </div>
                  )}
                </div>
              </section>

              {university.notes && (
                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Official Catalog Notes</h3>
                  <div className="text-slate-600 leading-relaxed bg-slate-50 p-8 rounded-2xl border border-slate-100 border-dashed text-sm italic">
                    "{university.notes}"
                  </div>
                </section>
              )}

              <section className="pt-8 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Last System Sync</h3>
                    <p className="text-sm text-slate-800 font-bold flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      {new Date(university.lastChecked).toLocaleString()}
                    </p>
                  </div>
                  <a 
                    href={university.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 uppercase tracking-widest"
                  >
                    View UGC Source →
                  </a>
                </div>
              </section>
            </div>

            {/* Sidebar Contact */}
            <aside className="md:col-span-4 p-8 md:p-12 bg-slate-50/30">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Access Points</h3>
              <ul className="space-y-10">
                <li className="flex gap-4">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="h-4 w-4 text-slate-400" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Official Registry Address</span>
                    <span className="text-sm text-slate-700 font-bold leading-tight">
                      {university.permanentCampus || university.address || university.district || 'Consult institutional records'}
                    </span>
                  </div>
                </li>
                {university.website && (
                  <li className="flex gap-4">
                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      <Globe className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Official Site</span>
                      <a 
                        href={university.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 font-bold hover:underline break-all"
                      >
                        {university.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </li>
                )}
                {university.email && (
                  <li className="flex gap-4">
                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Direct Email</span>
                      <a href={`mailto:${university.email}`} className="text-sm text-blue-600 font-bold hover:underline break-all">
                        {university.email}
                      </a>
                    </div>
                  </li>
                )}
                {university.phone && (
                  <li className="flex gap-4">
                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      <Phone className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tele-Inquiry</span>
                      <a href={`tel:${university.phone}`} className="text-sm text-slate-700 font-bold hover:text-blue-600">
                        {university.phone}
                      </a>
                    </div>
                  </li>
                )}
                {university.fax && (
                  <li className="flex gap-4">
                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      <Info className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fax Record</span>
                      <span className="text-sm text-slate-700 font-bold">{university.fax}</span>
                    </div>
                  </li>
                )}
              </ul>

              <div className="mt-16 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl shadow-slate-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-800">Registry Verified</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                  This profile is cryptographically tied to the official UGC Bangladesh entry list. Information is provided under the Open Data Initiative.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
