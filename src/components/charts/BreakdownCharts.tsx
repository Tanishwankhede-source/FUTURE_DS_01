import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DashboardData } from '../../types/data';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import { ShoppingBag } from 'lucide-react';

interface BreakdownChartsProps {
  data: DashboardData;
}

const PALETTE = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#ec4899', '#14b8a6'];

const SubCategoryTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e293b]/95 backdrop-blur-sm p-3 border border-slate-700/50 rounded-xl shadow-xl z-50">
        <p className="text-slate-200 font-bold text-sm mb-2">{label}</p>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400 text-xs">Sales:</span>
          <span className="text-white text-xs font-semibold">
            ${(payload[0].value / 1000).toFixed(1)}k
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400 text-xs">Profit:</span>
          <span className={`text-xs font-semibold ${payload[1]?.value >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            ${(payload[1]?.value / 1000).toFixed(1)}k
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const BreakdownCharts: React.FC<BreakdownChartsProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'subcategory' | 'segment'>('subcategory');

  // Compute sub-category breakdown
  const subCatMap = new Map<string, { subCat: string; sales: number; profit: number }>();
  data.raw.forEach((row: any) => {
    const s = row['Sub-Category'];
    if (!s) return;
    if (!subCatMap.has(s)) subCatMap.set(s, { subCat: s, sales: 0, profit: 0 });
    const cur = subCatMap.get(s)!;
    cur.sales += row['Sales'] || 0;
    cur.profit += row['Profit'] || 0;
  });
  const subCatData = Array.from(subCatMap.values()).sort((a, b) => b.sales - a.sales).slice(0, 10);

  // Compute segment breakdown
  const segMap = new Map<string, { segment: string; sales: number }>();
  data.raw.forEach((row: any) => {
    const s = row['Segment'];
    if (!s) return;
    if (!segMap.has(s)) segMap.set(s, { segment: s, sales: 0 });
    segMap.get(s)!.sales += row['Sales'] || 0;
  });
  const segData = Array.from(segMap.values()).sort((a, b) => b.sales - a.sales);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-panel p-6 rounded-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Sales Breakdown</h2>
            <p className="text-xs text-slate-400 mt-0.5">Sub-category performance & customer segments</p>
          </div>
        </div>
        <div className="flex bg-slate-800/60 rounded-lg p-1 border border-slate-700/30 gap-1">
          {(['subcategory', 'segment'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                activeTab === tab ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-indicator-breakdown"
                  className="absolute inset-0 bg-blue-600/40 border border-blue-500/40 rounded-md"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab === 'subcategory' ? 'Sub-Categories' : 'Segments'}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'subcategory' && (
          <motion.div
            key="subcategory"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subCatData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
                <XAxis dataKey="subCat" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<SubCategoryTooltip />} cursor={{ fill: '#334155', opacity: 0.3 }} />
                <Bar dataKey="sales" name="Sales" radius={[4, 4, 0, 0]} barSize={18}>
                  {subCatData.map((_e, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} style={{ filter: `drop-shadow(0 0 4px ${PALETTE[i % PALETTE.length]}60)` }} />
                  ))}
                </Bar>
                <Bar dataKey="profit" name="Profit" radius={[4, 4, 0, 0]} barSize={18} fill="#34d399" opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
        {activeTab === 'segment' && (
          <motion.div
            key="segment"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
            className="h-[300px] flex items-center"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={6}
                  dataKey="sales"
                  nameKey="segment"
                  stroke="transparent"
                >
                  {segData.map((_e, i) => (
                    <Cell key={i} fill={['#3b82f6', '#8b5cf6', '#f59e0b'][i % 3]} style={{ filter: `drop-shadow(0 0 6px ${['#3b82f6', '#8b5cf6', '#f59e0b'][i % 3]}50)` }} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`$${(val/1000).toFixed(1)}k`, 'Sales']} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} labelStyle={{ color: '#f8fafc' }} itemStyle={{ color: '#94a3b8' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BreakdownCharts;
