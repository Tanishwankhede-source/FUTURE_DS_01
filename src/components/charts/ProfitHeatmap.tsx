import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { DashboardData } from '../../types/data';
import { Grid3X3 } from 'lucide-react';

interface ProfitHeatmapProps {
  data: DashboardData;
}

const categories = ['Furniture', 'Office Supplies', 'Technology'];
const regions = ['Central', 'East', 'South', 'West'];

const ProfitHeatmap: React.FC<ProfitHeatmapProps> = ({ data }) => {
  const matrix = useMemo(() => {
    const m: Record<string, Record<string, { profit: number; sales: number }>> = {};
    categories.forEach(cat => {
      m[cat] = {};
      regions.forEach(reg => {
        m[cat][reg] = { profit: 0, sales: 0 };
      });
    });

    data.raw.forEach((row: any) => {
      const cat = row['Category'];
      const reg = row['Region'];
      if (!cat || !reg || !m[cat] || !m[cat][reg]) return;
      m[cat][reg].profit += row['Profit'] || 0;
      m[cat][reg].sales += row['Sales'] || 0;
    });

    return m;
  }, [data.raw]);

  // Normalize profit for color intensity
  let minP = 0, maxP = 0;
  categories.forEach(cat => regions.forEach(reg => {
    const val = matrix[cat][reg].profit;
    if (val < minP) minP = val;
    if (val > maxP) maxP = val;
  }));

  const getColor = (profit: number) => {
    if (profit < 0) {
      const intensity = Math.min(Math.abs(profit / minP), 1);
      return `rgba(244, 63, 94, ${0.15 + intensity * 0.7})`;
    } else {
      const intensity = Math.min(profit / maxP, 1);
      return `rgba(52, 211, 153, ${0.1 + intensity * 0.7})`;
    }
  };

  const borderColor = (profit: number) => profit >= 0 ? 'rgba(52,211,153,0.3)' : 'rgba(244,63,94,0.3)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-panel p-6 rounded-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
          <Grid3X3 className="w-5 h-5 text-rose-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Profit Heatmap</h2>
          <p className="text-xs text-slate-400 mt-0.5">Category × Region profit distribution</p>
        </div>
        <div className="ml-auto flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-rose-500/70" />
            <span>Loss</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-400/70" />
            <span>Profit</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-auto">
        <table className="w-full text-sm border-separate" style={{ borderSpacing: '5px' }}>
          <thead>
            <tr>
              <th className="p-2 text-left text-slate-500 font-medium text-xs uppercase tracking-wider w-32">Category</th>
              {regions.map(reg => (
                <th key={reg} className="p-2 text-center text-slate-400 font-semibold text-xs tracking-wide">{reg}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, catIdx) => (
              <tr key={cat}>
                <td className="p-3 text-slate-300 font-semibold text-sm">{cat}</td>
                {regions.map((reg, regIdx) => {
                  const cell = matrix[cat][reg];
                  return (
                    <motion.td
                      key={reg}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: catIdx * 0.1 + regIdx * 0.05 }}
                      className="rounded-xl p-3 text-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg group"
                      style={{
                        backgroundColor: getColor(cell.profit),
                        border: `1px solid ${borderColor(cell.profit)}`,
                      }}
                      title={`${cat} / ${reg}\nSales: $${cell.sales.toFixed(0)}\nProfit: $${cell.profit.toFixed(0)}`}
                    >
                      <p className={`font-bold text-sm ${cell.profit >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                        {cell.profit >= 0 ? '+' : ''}${(cell.profit / 1000).toFixed(1)}k
                      </p>
                      <p className="text-[10px] text-slate-400 group-hover:text-slate-300 transition-colors mt-0.5">
                        ${(cell.sales / 1000).toFixed(1)}k sales
                      </p>
                    </motion.td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ProfitHeatmap;
