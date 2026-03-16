import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DashboardData } from '../types/data';
import { Table2, Search, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface DataTableProps {
  data: DashboardData;
}

type SortKey = 'state' | 'sales' | 'profit';
type SortDir = 'asc' | 'desc';

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('sales');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(0);
  const pageSize = 8;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(0);
  };

  const sorted = useMemo(() => {
    const filtered = data.stateSales.filter(s =>
      s.state.toLowerCase().includes(search.toLowerCase())
    );
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [data.stateSales, search, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const page_ = Math.min(page, totalPages - 1);
  const visible = sorted.slice(page_ * pageSize, (page_ + 1) * pageSize);

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronsUpDown className="w-3.5 h-3.5 text-slate-500" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3.5 h-3.5 text-blue-400" />
      : <ChevronDown className="w-3.5 h-3.5 text-blue-400" />;
  };

  const fmtCur = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-panel p-6 rounded-2xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
            <Table2 className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">State Performance Table</h2>
            <p className="text-xs text-slate-400 mt-0.5">Sortable, paginated sales data by state</p>
          </div>
        </div>
        {/* Search */}
        <div className="relative sm:ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search state..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            className="bg-slate-800/60 border border-slate-700/50 text-slate-200 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full sm:w-48 hover:bg-slate-700/60 transition-colors placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="overflow-auto rounded-xl border border-slate-800/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/60 border-b border-slate-700/50">
              {[
                { key: 'state' as SortKey, label: 'State' },
                { key: 'sales' as SortKey, label: 'Revenue' },
                { key: 'profit' as SortKey, label: 'Profit' },
              ].map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-200 transition-colors select-none"
                >
                  <div className="flex items-center gap-1.5">
                    {col.label} <SortIcon col={col.key} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Margin</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Performance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            <AnimatePresence mode="wait">
              {visible.map((row, i) => {
                const margin = row.sales > 0 ? (row.profit / row.sales) * 100 : 0;
                const barWidth = Math.min(Math.abs(margin) / 30 * 100, 100);
                const good = row.profit >= 0;
                return (
                  <motion.tr
                    key={row.state}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-200 font-medium">{row.state}</td>
                    <td className="px-4 py-3 text-slate-300">{fmtCur(row.sales)}</td>
                    <td className={`px-4 py-3 font-semibold ${good ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {fmtCur(row.profit)}
                    </td>
                    <td className={`px-4 py-3 text-sm font-medium ${good ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {margin >= 0 ? '+' : ''}{margin.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${barWidth}%` }}
                          transition={{ duration: 0.5, delay: i * 0.04 }}
                          className={`h-full rounded-full ${good ? 'bg-emerald-500' : 'bg-rose-500'}`}
                          style={{ boxShadow: good ? '0 0 6px rgba(52,211,153,0.5)' : '0 0 6px rgba(244,63,94,0.5)' }}
                        />
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-slate-400">
        <span>{sorted.length} states — showing {Math.min((page_ + 1) * pageSize, sorted.length)} of {sorted.length}</span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page_ === 0}
            className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-slate-300"
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-8 h-8 rounded-lg border transition-all text-xs font-semibold ${
                i === page_
                  ? 'bg-blue-600/40 border-blue-500/40 text-white'
                  : 'bg-slate-800/60 border-slate-700/50 hover:bg-slate-700/60 text-slate-400'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page_ >= totalPages - 1}
            className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-slate-300"
          >
            Next →
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DataTable;
