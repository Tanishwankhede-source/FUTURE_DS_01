import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import type { TopProduct, CategoryData } from '../../types/data';
import { PackageSearch, PieChart as PieChartIcon } from 'lucide-react';

interface CategoryAnalysisProps {
  topProducts: TopProduct[];
  categorySales: CategoryData[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#06b6d4'];

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e293b]/95 backdrop-blur-sm p-4 border border-slate-700/50 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 max-w-xs">
        <p className="text-slate-200 font-medium mb-2 pb-2 border-b border-slate-700/50 text-sm">{label}</p>
        <div className="flex items-center justify-between mb-1">
          <span className="text-slate-400 text-sm">Sales:</span>
          <span className="text-white font-semibold flex-1 text-right ml-4">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payload[0].value)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e293b]/95 backdrop-blur-sm p-3 border border-slate-700/50 rounded-xl shadow-xl z-50 min-w-[150px]">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700/50">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
          <p className="text-slate-200 font-medium text-sm">{payload[0].name}</p>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-slate-400 text-sm">Revenue:</span>
          <span className="text-white font-semibold text-right ml-4 text-sm">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payload[0].value)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const CategoryAnalysis: React.FC<CategoryAnalysisProps> = ({ topProducts, categorySales }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      
      {/* Top Products Bar Chart */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300"
      >
        <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-[60px] -ml-16 -mt-16 transition-opacity group-hover:bg-purple-500/10 pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
            <PackageSearch className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Top Products by Revenue</h2>
            <p className="text-xs text-slate-400 mt-0.5">Top 5 performers across selected filters</p>
          </div>
        </div>

        <div className="h-[280px] w-full relative z-10">
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topProducts}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} opacity={0.3} />
                <XAxis 
                  type="number" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="#cbd5e1" 
                  fontSize={11} 
                  tickLine={false}
                  axisLine={false}
                  width={140}
                  // Truncate long names for Y-axis
                  tickFormatter={(value) => value.length > 20 ? value.substring(0, 18) + '...' : value}
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#334155', opacity: 0.3 }} />
                <Bar dataKey="sales" radius={[0, 4, 4, 0]} barSize={20}>
                  {topProducts.map((_entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      className="hover:brightness-110 transition-all duration-300"
                      style={{ filter: `drop-shadow(0 0 4px ${COLORS[index % COLORS.length]}80)` }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500">No data available</div>
          )}
        </div>
      </motion.div>

      {/* Category Donut Chart */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[60px] -mr-16 -mt-16 transition-opacity group-hover:bg-amber-500/10 pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-2 relative z-10">
          <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
            <PieChartIcon className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Revenue Breakdown</h2>
            <p className="text-xs text-slate-400 mt-0.5">Sales distribution by product category</p>
          </div>
        </div>

        <div className="h-[280px] w-full relative z-10 flex items-center justify-center">
          {categorySales.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend 
                  verticalAlign="middle" 
                  align="right" 
                  layout="vertical"
                  iconType="circle"
                  wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }}
                />
                <Pie
                  data={categorySales}
                  cx="45%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="sales"
                  nameKey="category"
                  stroke="transparent"
                >
                  {categorySales.map((_entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      className="hover:scale-[1.03] transition-transform duration-300 cursor-pointer outline-none"
                      style={{ filter: `drop-shadow(0 0 6px ${COLORS[index % COLORS.length]}40)` }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500">No data available</div>
          )}
        </div>
      </motion.div>

    </div>
  );
};

export default CategoryAnalysis;
