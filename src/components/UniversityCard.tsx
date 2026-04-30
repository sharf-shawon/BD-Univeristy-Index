import { University, Ranking } from "../types";
import { GraduationCap, MapPin, ExternalLink, Calendar, UserCheck, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

interface UniversityCardProps {
  university: University;
}

export default function UniversityCard({ university }: UniversityCardProps) {
  const topRanking = university.rankings?.[0];

  return (
    <div
      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col relative overflow-hidden"
    >
      {/* Category Indicator */}
      <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-bl-xl z-10 ${
        university.category === 'Public' ? 'bg-blue-600 text-white' : 
        university.category === 'Private' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
      }`}>
        {university.category}
      </div>

      <div className="flex items-start gap-4 mb-4">
        <div className="shrink-0 w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
          <GraduationCap className="h-6 w-6 text-slate-400 group-hover:text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-1">
            {topRanking && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border border-amber-100">
                <Trophy className="h-2 w-2" /> Global #{topRanking.rank}
              </span>
            )}
          </div>
          <h3 className="font-bold text-slate-800 leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-blue-600 transition-colors">
            {university.name}
          </h3>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <MapPin className="h-3 w-3" />
            Location
          </div>
          <span className="text-xs font-bold text-slate-700 truncate block">
            {university.district || (university.permanentCampus ? university.permanentCampus.split(',').pop()?.trim() : (university.address ? university.address.split(',').pop()?.trim() : 'Official Records'))}
          </span>
        </div>
        <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <Calendar className="h-3 w-3" />
            Established
          </div>
          <span className="text-xs font-bold text-slate-700 truncate block">
            {university.yearOfEstablishment || 'UGC Record'}
          </span>
        </div>
      </div>

      {university.viceChancellor && (
        <div className="mb-6 flex items-center gap-3 bg-blue-50/30 p-3 rounded-xl border border-blue-100/30">
          <div className="bg-blue-100 text-blue-600 p-1.5 rounded-lg shrink-0">
            <UserCheck className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <span className="block text-[8px] font-bold text-blue-400 uppercase tracking-widest leading-none mb-1">Vice Chancellor</span>
            <span className="block text-xs font-bold text-slate-700 truncate whitespace-nowrap">
              {university.viceChancellor}
            </span>
          </div>
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-4">
        <Link 
          to={`/universities/${university.slug}`}
          className="flex-1 bg-slate-900 hover:bg-blue-600 text-white text-center py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2"
        >
          Institutional Data
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
