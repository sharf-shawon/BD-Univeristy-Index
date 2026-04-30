import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { University, UniversityCategory, UniversityApiResponse } from "../types";
import UniversityCard from "../components/UniversityCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  Info, 
  AlertCircle, 
  Search, 
  ShieldCheck, 
  Filter, 
  ArrowUpDown,
  Calendar,
  Layers,
  MapPin
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type SortOption = 'name-asc' | 'name-desc' | 'year-new' | 'year-old' | 'rank-asc' | 'rank-desc';

export default function UniversityList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [universities, setUniversities] = useState<University[]>([]);
  const [categories, setCategories] = useState<UniversityCategory[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "");
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || "");
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'name-asc');
  const [showRankedOnly, setShowRankedOnly] = useState(searchParams.get('ranked') === 'true');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Registry Directory | BD University Index Official List";
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<UniversityApiResponse>("/api/universities", {
          params: {
            q: searchQuery,
            category: selectedCategory,
          },
        });
        setUniversities(response.data.data);
        setCategories(response.data.categories);
        
        // Extract unique districts
        const allDistricts = response.data.data
          .map(u => u.district)
          .filter((d): d is string => !!d);
        setDistricts(Array.from(new Set(allDistricts)).sort());
        
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load university data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const filteredAndSortedUniversities = useMemo(() => {
    let result = [...universities];

    // Additional client-side filtering
    if (selectedDistrict) {
      result = result.filter(u => u.district === selectedDistrict);
    }
    
    if (showRankedOnly) {
      result = result.filter(u => u.rankings && u.rankings.length > 0);
    }

    // Advanced Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rank-asc': {
          const getRank = (u: University) => {
            const rankStr = u.rankings?.[0]?.rank;
            if (!rankStr) return Infinity;
            const match = rankStr.match(/\d+/);
            return match ? parseInt(match[0]) : Infinity;
          };
          return getRank(a) - getRank(b);
        }
        case 'rank-desc': {
          const getRank = (u: University) => {
            const rankStr = u.rankings?.[0]?.rank;
            if (!rankStr) return -1;
            const match = rankStr.match(/\d+/);
            return match ? parseInt(match[0]) : -1;
          };
          return getRank(b) - getRank(a);
        }
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'year-new':
          return (Number(b.yearOfEstablishment) || 0) - (Number(a.yearOfEstablishment) || 0);
        case 'year-old':
          return (Number(a.yearOfEstablishment) || 0) - (Number(b.yearOfEstablishment) || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [universities, selectedDistrict, sortBy, showRankedOnly]);

  const updateFilters = (newParams: Record<string, string>) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) nextParams.set(key, value);
      else nextParams.delete(key);
    });
    setSearchParams(nextParams);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans flex flex-col text-slate-900 overflow-x-hidden">
      <Header />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1600px] mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 bg-white border-r border-slate-200 p-8 flex flex-col gap-10 shrink-0 lg:h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Advanced Filters</h3>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setSelectedDistrict('');
                  setSortBy('name-asc');
                  setShowRankedOnly(false);
                  setSearchParams({});
                }}
                className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline"
              >
                Reset
              </button>
            </div>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  <Search className="h-3 w-3" /> Search Records
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Name, slug, or campus..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      updateFilters({ q: e.target.value });
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  <ArrowUpDown className="h-3 w-3" /> Sorting Preference
                </label>
                <select 
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none font-medium text-slate-700"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as SortOption);
                    updateFilters({ sort: e.target.value });
                  }}
                >
                  <option value="name-asc">Alphabetical (A-Z)</option>
                  <option value="name-desc">Alphabetical (Z-A)</option>
                  <option value="rank-asc">Global Rank (Top First)</option>
                  <option value="rank-desc">Global Rank (Bottom First)</option>
                  <option value="year-new">Established (Newest first)</option>
                  <option value="year-old">Established (Oldest first)</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-2">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider cursor-pointer" htmlFor="ranked-only">
                  Ranked Universities Only
                </label>
                <input 
                  id="ranked-only"
                  type="checkbox" 
                  checked={showRankedOnly}
                  onChange={(e) => {
                    setShowRankedOnly(e.target.checked);
                    updateFilters({ ranked: e.target.checked ? 'true' : '' });
                  }}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  <Layers className="h-3 w-3" /> Institution Type
                </label>
                <div className="grid grid-cols-1 gap-1">
                  <button
                    onClick={() => { setSelectedCategory(''); updateFilters({ category: '' }); }}
                    className={`text-left text-sm py-2 px-3 rounded-lg transition-colors ${
                      selectedCategory === '' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); updateFilters({ category: cat }); }}
                      className={`text-left text-sm py-2 px-3 rounded-lg transition-colors ${
                        selectedCategory === cat ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  <MapPin className="h-3 w-3" /> District
                </label>
                <select 
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 outline-none font-medium text-slate-700"
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    updateFilters({ district: e.target.value });
                  }}
                >
                  <option value="">All Regions</option>
                  {districts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-auto pt-8 border-t border-slate-100 hidden lg:block">
            <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
               <ShieldCheck className="h-8 w-8 text-blue-400 mb-4" />
               <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Verified Data Source</p>
               <p className="text-xs text-slate-300 leading-relaxed">
                 Institutional metadata is strictly cross-referenced from the official Ministry of Education and UGC records.
               </p>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <section className="flex-1 p-6 md:p-12 flex flex-col min-w-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <div className="flex items-center gap-4 mb-2">
                 <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                    Registry Explorer
                 </h2>
                 <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold border border-blue-100">
                    {filteredAndSortedUniversities.length} UNIVERSITIES
                 </span>
              </div>
              <p className="text-slate-500 font-medium max-w-xl">
                Searching for accredited higher education providers in Bangladesh. 
                Our registry provides high-fidelity institutional data points for public and private campuses.
              </p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-bold border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
              >
                Export Report
              </button>
            </div>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white border border-slate-200 h-48 rounded-3xl animate-pulse"></div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-100 rounded-3xl p-12 text-center max-w-lg mx-auto">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-red-900">Catalogue Error</h3>
                <p className="text-red-600 mt-2 text-sm leading-relaxed">{error}</p>
              </div>
            ) : filteredAndSortedUniversities.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-[2.5rem] border border-slate-100 border-dashed max-w-2xl mx-auto w-full">
                <div className="bg-slate-50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Search className="h-10 w-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Zero Matches Found</h3>
                <p className="text-slate-400 mt-3 font-medium max-w-sm mx-auto">
                  Try adjusting your search query or selecting a different institutional category or region.
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    setSelectedDistrict('');
                    setSortBy('name-asc');
                    setShowRankedOnly(false);
                    setSearchParams({});
                  }}
                  className="mt-10 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 relative">
                <AnimatePresence mode="popLayout">
                  {filteredAndSortedUniversities.map((uni) => (
                    <motion.div
                      key={uni.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <UniversityCard university={uni} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
