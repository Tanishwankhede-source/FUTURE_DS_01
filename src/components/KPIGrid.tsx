import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { KPIData } from '../types/data';
import { DollarSign, ShoppingCart, TrendingUp, Activity } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface KPICardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  trend?: number;
  colorClass: string;
  delay: number;
  isCurrency?: boolean;
}

// Custom Counter hook for smooth number animation
const useCounter = (end: number, duration: number = 2) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(end * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
};

const KPICard: React.FC<KPICardProps> = ({ 
  title, value, prefix = "", suffix = "", icon, trend, colorClass, delay, isCurrency 
}) => {
  const animatedValue = useCounter(value, 2);
  
  const formattedValue = isCurrency 
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(animatedValue).replace('$', '')
    : new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(animatedValue);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-panel rounded-2xl p-6 relative overflow-hidden group card-hover-effect"
    >
      {/* Background glow effect colored by the specific KPI category */}
      <div className={cn("absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[40px] opacity-20 transition-opacity duration-500 group-hover:opacity-40", colorClass)} />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-slate-400 font-medium text-sm tracking-wide uppercase">{title}</h3>
        <div className={cn("p-2 rounded-lg bg-slate-800/50 border border-white/5", colorClass.replace('bg-', 'text-'))}>
          {icon}
        </div>
      </div>
      
      <div className="space-y-1 relative z-10">
        <div className="flex items-baseline gap-1">
          {prefix && <span className="text-2xl font-bold text-slate-300">{prefix}</span>}
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {formattedValue}
          </h2>
          {suffix && <span className="text-xl font-bold text-slate-300 ml-1">{suffix}</span>}
        </div>
        
        {trend !== undefined && (
          <div className="flex items-center gap-2 mt-2">
            <span className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1",
              trend >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
            )}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
            </span>
            <span className="text-xs text-slate-500">vs last period</span>
          </div>
        )}
      </div>

      {/* Modern decorative bottom line */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-slate-800">
        <div className={cn("h-full", colorClass)} style={{ width: '40%' }} />
      </div>
    </motion.div>
  );
};

interface KPIGridProps {
  data: KPIData;
}

const KPIGrid: React.FC<KPIGridProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-2">
      <KPICard 
        title="Total Revenue" 
        value={data.totalSales} 
        prefix="$" 
        icon={<DollarSign className="w-5 h-5 text-blue-400" />}
        colorClass="bg-blue-500"
        delay={0.1}
        isCurrency={true}
        trend={12.5}
      />
      <KPICard 
        title="Total Profit" 
        value={data.totalProfit} 
        prefix="$" 
        icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
        colorClass="bg-emerald-500"
        delay={0.2}
        isCurrency={true}
        trend={8.2}
      />
      <KPICard 
        title="Profit Margin" 
        value={data.profitMargin} 
        suffix="%" 
        icon={<Activity className="w-5 h-5 text-amber-400" />}
        colorClass="bg-amber-500"
        delay={0.3}
        trend={-1.4}
      />
      <KPICard 
        title="Total Units Sold" 
        value={data.totalUnits} 
        icon={<ShoppingCart className="w-5 h-5 text-purple-400" />}
        colorClass="bg-purple-500"
        delay={0.4}
        trend={5.7}
      />
    </div>
  );
};

export default KPIGrid;
