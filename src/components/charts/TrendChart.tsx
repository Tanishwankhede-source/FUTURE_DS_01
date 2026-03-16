import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import type { MonthlyTrend } from '../../types/data';

interface TrendChartProps {
  data: MonthlyTrend[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e293b]/95 backdrop-blur-sm p-4 border border-slate-700/50 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50">
        <p className="text-slate-300 font-medium mb-3 pb-2 border-b border-slate-700/50">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-3 my-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color, boxShadow: `0 0 10px ${entry.color}80` }} 
            />
            <span className="text-slate-400 capitalize">{entry.name}:</span>
            <span className="text-white font-semibold flex-1 text-right ml-2">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-panel p-6 rounded-2xl col-span-1 lg:col-span-2 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -mr-32 -mt-32 transition-opacity group-hover:bg-blue-500/10 pointer-events-none" />
      
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Revenue & Profit Trends
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />
          </h2>
          <p className="text-sm text-slate-400 mt-1">Monthly performance analysis</p>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <span className="text-xs text-slate-300 font-medium">Sales</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            <span className="text-xs text-slate-300 font-medium">Profit</span>
          </div>
        </div>
      </div>

      <div className="h-[350px] w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
              <XAxis 
                dataKey="month" 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area 
                type="monotone" 
                dataKey="sales" 
                name="Sales"
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorSales)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6', style: { filter: 'drop-shadow(0px 0px 5px rgba(59,130,246,0.8))' } }}
              />
              <Area 
                type="monotone" 
                dataKey="profit" 
                name="Profit"
                stroke="#34d399" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorProfit)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#34d399', style: { filter: 'drop-shadow(0px 0px 5px rgba(52,211,153,0.8))' } }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500">
            No data available for the selected filters
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TrendChart;
