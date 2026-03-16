import React from 'react';
import { motion } from 'framer-motion';
import type { DashboardData } from '../types/data';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

interface AIInsightsProps {
  data: DashboardData;
}

const AIInsights: React.FC<AIInsightsProps> = ({ data }) => {
  // Generate dynamic insights
  
  // 1. Most profitable category
  const topCategory = [...data.categorySales].sort((a, b) => b.profit - a.profit)[0]?.category || 'N/A';
  
  // 2. Best performing region/state
  const topState = [...data.stateSales].sort((a, b) => b.sales - a.sales)[0];
  
  // 3. Discount impact analysis
  const hasDiscountIssue = data.scatterData.some(d => d.discount > 0.4 && d.profit < 0);
  const discountWarning = hasDiscountIssue 
    ? "High discounts (>40%) are consistently leading to negative profit margins in several orders."
    : "Discount strategy appears stable with minimal negative impact on overall profit.";

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 1.0 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="glass-panel p-6 rounded-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
          <Sparkles className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            AI Business Insights
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 uppercase tracking-widest border border-indigo-500/30">Auto-Generated</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        
        {/* Insight 1 */}
        <motion.div variants={itemVariants} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex gap-4 hover:bg-slate-800/60 transition-colors">
          <div className="mt-1 shrink-0">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-1">Top Growth Driver</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="text-white font-medium">{topCategory}</span> currently drives the highest overall profit margin. Consider allocating more marketing budget to this segment.
            </p>
          </div>
        </motion.div>

        {/* Insight 2 */}
        <motion.div variants={itemVariants} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex gap-4 hover:bg-slate-800/60 transition-colors">
          <div className="mt-1 shrink-0">
            <AlertTriangle className={hasDiscountIssue ? "w-5 h-5 text-amber-400" : "w-5 h-5 text-emerald-400"} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-1">Pricing Strategy</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {discountWarning}
            </p>
          </div>
        </motion.div>

        {/* Insight 3 */}
        <motion.div variants={itemVariants} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex gap-4 hover:bg-slate-800/60 transition-colors">
          <div className="mt-1 shrink-0">
            <Lightbulb className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-1">Regional Focus</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {topState ? (
                <>
                  <span className="text-white font-medium">{topState.state}</span> leads sales volume at <span className="text-blue-300">${(topState.sales / 1000).toFixed(1)}k</span>. Replicating adoption strategies in adjacent states could drive growth.
                </>
              ) : "Insufficient regional data to form a conclusion."}
            </p>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default AIInsights;
