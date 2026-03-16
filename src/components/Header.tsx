import React from 'react';
import { motion } from 'framer-motion';
import { Filter, BarChart3, TrendingUp, Calendar, MapPin, Tag } from 'lucide-react';

interface FilterProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  options: (string | number)[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FilterSelect: React.FC<FilterProps> = ({ label, icon, value, options, onChange }) => (
  <div className="flex flex-col gap-1.5 min-w-[140px] flex-1">
    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1">
      {icon} {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none bg-slate-800/80 border border-slate-700/50 text-slate-200 text-sm rounded-lg pl-4 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all cursor-pointer hover:bg-slate-700/80 shadow-inner"
      >
        <option value="All">All {label}s</option>
        {options.map((opt) => (
          <option key={String(opt)} value={String(opt)}>
            {opt}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);

interface HeaderProps {
  filterYear: string;
  setFilterYear: (val: string) => void;
  filterRegion: string;
  setFilterRegion: (val: string) => void;
  filterCategory: string;
  setFilterCategory: (val: string) => void;
  years: number[];
  regions: string[];
  categories: string[];
  isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({
  filterYear, setFilterYear,
  filterRegion, setFilterRegion,
  filterCategory, setFilterCategory,
  years, regions, categories,
  isLoading
}) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col xl:flex-row gap-6 xl:gap-12 justify-between items-start xl:items-center w-full z-10"
    >
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-white/10 shrink-0">
          <BarChart3 className="text-white w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            Business Sales Intelligence
            {isLoading && (
               <span className="flex h-3 w-3 relative">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
               </span>
            )}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Performance & Insights for Superstore Data
          </p>
        </div>
      </div>

      <div className="flex flex-wrap md:flex-nowrap items-center gap-4 w-full xl:w-auto bg-slate-900/50 p-4 rounded-xl border border-white/5">
        <div className="flex items-center gap-2 mr-2 shrink-0">
          <Filter className="w-5 h-5 text-amber-500" />
          <span className="text-sm font-semibold text-white tracking-wide">FILTERS</span>
        </div>
        <div className="flex flex-1 gap-3 sm:gap-4 flex-wrap md:flex-nowrap">
          <FilterSelect 
            label="Year" 
            icon={<Calendar className="w-3.5 h-3.5" />} 
            value={filterYear} 
            options={years} 
            onChange={(e) => setFilterYear(e.target.value)} 
          />
          <FilterSelect 
            label="Region" 
            icon={<MapPin className="w-3.5 h-3.5" />} 
            value={filterRegion} 
            options={regions} 
            onChange={(e) => setFilterRegion(e.target.value)} 
          />
          <FilterSelect 
            label="Category" 
            icon={<Tag className="w-3.5 h-3.5" />} 
            value={filterCategory} 
            options={categories} 
            onChange={(e) => setFilterCategory(e.target.value)} 
          />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
