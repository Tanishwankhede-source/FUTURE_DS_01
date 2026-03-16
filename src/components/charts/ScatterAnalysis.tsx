import React from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { motion } from 'framer-motion';
import type { ScatterPoint } from '../../types/data';
import { SplitSquareHorizontal } from 'lucide-react';

interface ScatterAnalysisProps {
  data: ScatterPoint[];
}

const CustomScatterTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1e293b]/95 backdrop-blur-sm p-4 border border-slate-700/50 rounded-xl shadow-xl z-50 text-sm">
        <p className="text-slate-200 font-medium mb-2 pb-2 border-b border-slate-700/50">
          Order: {data.orderId}
        </p>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400">Category:</span>
            <span className="text-white font-medium">{data.category}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400">Discount:</span>
            <span className="text-amber-400 font-medium">{(data.discount * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400">Profit/Loss:</span>
            <span className={data.profit >= 0 ? "text-emerald-400 font-medium" : "text-rose-400 font-medium"}>
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.profit)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const ScatterAnalysis: React.FC<ScatterAnalysisProps> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all duration-300"
    >
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[60px] -mr-24 -mb-24 transition-opacity group-hover:bg-emerald-500/10 pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
          <SplitSquareHorizontal className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Discount vs Profit Impact</h2>
          <p className="text-xs text-slate-400 mt-0.5">Correlation analysis for selected orders</p>
        </div>
      </div>

      <div className="h-[280px] w-full relative z-10">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis 
                type="number" 
                dataKey="discount" 
                name="Discount" 
                tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                stroke="#64748b" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                type="number" 
                dataKey="profit" 
                name="Profit" 
                tickFormatter={(val) => `$${val}`}
                stroke="#64748b" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomScatterTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#475569' }} />
              <Scatter data={data} fill="#3b82f6" shape="circle" animationDuration={1000}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.profit >= 0 ? 'rgba(52, 211, 153, 0.6)' : 'rgba(244, 63, 94, 0.6)'} 
                    className="hover:opacity-100 cursor-pointer transition-opacity duration-300" 
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500">No data available</div>
        )}
      </div>
    </motion.div>
  );
};

export default ScatterAnalysis;
