import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import DashboardLayout from './components/DashboardLayout';
import Header from './components/Header';
import KPIGrid from './components/KPIGrid';
import TrendChart from './components/charts/TrendChart';
import CategoryAnalysis from './components/charts/CategoryAnalysis';
import ScatterAnalysis from './components/charts/ScatterAnalysis';
import MapSection from './components/MapSection';
import AIInsights from './components/AIInsights';
import BreakdownCharts from './components/charts/BreakdownCharts';
import ProfitHeatmap from './components/charts/ProfitHeatmap';
import DataTable from './components/DataTable';
import ExportToolbar from './components/ExportToolbar';
import SidebarNav from './components/SidebarNav';
import { loadData, processDashboardData } from './utils/dataParser';
import type { DashboardData } from './types/data';
import { Loader2, BarChart3, Activity } from 'lucide-react';

// ── Section divider component ───────────────────────────────────────
const SectionDivider = ({ label, icon: Icon, color = 'blue' }: {
  label: string;
  icon: React.ComponentType<any>;
  color?: string;
}) => {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500/30 via-blue-500/10 to-transparent text-blue-400 border-blue-500/30',
    emerald: 'from-emerald-500/30 via-emerald-500/10 to-transparent text-emerald-400 border-emerald-500/30',
    violet: 'from-violet-500/30 via-violet-500/10 to-transparent text-violet-400 border-violet-500/30',
    amber: 'from-amber-500/30 via-amber-500/10 to-transparent text-amber-400 border-amber-500/30',
    rose: 'from-rose-500/30 via-rose-500/10 to-transparent text-rose-400 border-rose-500/30',
    cyan: 'from-cyan-500/30 via-cyan-500/10 to-transparent text-cyan-400 border-cyan-500/30',
  };
  const cls = colorMap[color] || colorMap.blue;
  return (
    <div className="flex items-center gap-3 py-1">
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-black/20 backdrop-blur-sm ${cls.split(' ').filter(c => c.startsWith('text-') || c.startsWith('border-')).join(' ')}`}>
        <Icon className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className={`h-px flex-1 bg-gradient-to-r ${cls.split(' ').filter(c => c.startsWith('from-') || c.startsWith('via-') || c.startsWith('to-')).join(' ')}`} />
    </div>
  );
};

// ── Live Clock component ────────────────────────────────────────────
const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2 text-slate-400 text-xs font-mono bg-slate-900/40 px-3 py-1.5 rounded-lg border border-slate-800/50"
    >
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      <span>LIVE</span>
      <span className="text-slate-300 font-medium">{time.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
      <span className="text-slate-500">IST</span>
    </motion.div>
  );
};

// ── Scroll Progress Bar ─────────────────────────────────────────────
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-px">
      <motion.div
        className="h-full origin-left"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #f59e0b)',
          boxShadow: '0 0 8px rgba(59,130,246,0.8)',
        }}
      />
    </div>
  );
};

// ── Main Loading Screen ─────────────────────────────────────────────
const LoadingScreen = () => {
  const [dots, setDots] = useState('');
  useEffect(() => {
    const id = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="min-h-screen bg-[#050a14] flex flex-col justify-center items-center text-white relative overflow-hidden">
      {/* Aurora orbs */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-violet-500/8 rounded-full blur-[120px]" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/40 border border-white/10">
          <BarChart3 className="w-10 h-10 text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Business Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">Initializing dashboard{dots}</p>
        </div>
        <div className="flex gap-2 items-center">
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
          <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
              initial={{ width: '15%' }}
              animate={{ width: '80%' }}
              transition={{ duration: 3, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ── Main App ────────────────────────────────────────────────────────
function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterYear, setFilterYear] = useState<string>('All');
  const [filterRegion, setFilterRegion] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const [rawData, setRawData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const text = await fetch('/dataset.csv').then(res => {
          if (!res.ok) throw new Error("Failed to fetch dataset.csv");
          return res.text();
        });
        const parsed = await loadData(text);
        setRawData(parsed);
      } catch (err: any) {
        setError(err.message || 'Error loading data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (rawData.length === 0) return;
    setLoading(true);
    const timeoutId = setTimeout(() => {
      try {
        const processed = processDashboardData(rawData, filterYear, filterRegion, filterCategory);
        setData(processed);
      } catch (e) {
        console.error("Processing error:", e);
      } finally {
        setLoading(false);
      }
    }, 50);
    return () => clearTimeout(timeoutId);
  }, [rawData, filterYear, filterRegion, filterCategory]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#050a14] flex flex-col justify-center items-center text-white">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl text-center max-w-md">
          <Activity className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">Dashboard Error</h2>
          <p className="text-slate-300 text-sm">{error}</p>
          <p className="text-xs text-slate-500 mt-4">Make sure dataset.csv is in the public/ folder.</p>
        </div>
      </div>
    );
  }

  if (!data && loading) return <LoadingScreen />;
  if (!data) return null;

  // ── Stagger variants for section animation ──────────────────────
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  return (
    <>
      <ScrollProgress />
      <SidebarNav />

      <DashboardLayout>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${filterYear}-${filterRegion}-${filterCategory}`}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            className="space-y-6"
          >
            {/* ── Top bar: Header + Export + Clock ── */}
            <motion.section variants={sectionVariants} id="overview">
              <Header
                filterYear={filterYear} setFilterYear={setFilterYear}
                filterRegion={filterRegion} setFilterRegion={setFilterRegion}
                filterCategory={filterCategory} setFilterCategory={setFilterCategory}
                years={data.years} regions={data.regions} categories={data.categories}
                isLoading={loading}
              />
              <div className="flex flex-wrap items-center justify-between gap-3 mt-3 px-1">
                <ExportToolbar data={data} />
                <LiveClock />
              </div>
            </motion.section>

            {/* ── AI Insights ── */}
            <motion.section variants={sectionVariants} id="insights">
              <SectionDivider label="AI Insights" icon={Activity} color="violet" />
              <div className="mt-4">
                <AIInsights data={data} />
              </div>
            </motion.section>

            {/* ── KPI Cards ── */}
            <motion.section variants={sectionVariants} id="kpis">
              <SectionDivider label="Key Metrics" icon={BarChart3} color="blue" />
              <div className="mt-4">
                <KPIGrid data={data.kpi} />
              </div>
            </motion.section>

            {/* ── Trend Charts + Scatter ── */}
            <motion.section variants={sectionVariants} id="trends">
              <SectionDivider label="Performance Trends" icon={BarChart3} color="emerald" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                <TrendChart data={data.monthlyTrends} />
                <div className="col-span-1">
                  <ScatterAnalysis data={data.scatterData} />
                </div>
              </div>
            </motion.section>

            {/* ── Profit Heatmap + Breakdown Charts ── */}
            <motion.section variants={sectionVariants} id="categories">
              <SectionDivider label="Category Deep-Dive" icon={BarChart3} color="amber" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                <ProfitHeatmap data={data} />
                <BreakdownCharts data={data} />
              </div>
            </motion.section>

            {/* ── Category Analysis (Bar + Donut) ── */}
            <motion.section variants={sectionVariants}>
              <CategoryAnalysis topProducts={data.topProducts} categorySales={data.categorySales} />
            </motion.section>

            {/* ── Map ── */}
            <motion.section variants={sectionVariants} id="geo">
              <SectionDivider label="Geographic Performance" icon={BarChart3} color="cyan" />
              <div className="mt-4">
                <MapSection data={data.stateSales} />
              </div>
            </motion.section>

            {/* ── Data Table ── */}
            <motion.section variants={sectionVariants} id="data-table">
              <SectionDivider label="State Data Table" icon={BarChart3} color="rose" />
              <div className="mt-4">
                <DataTable data={data} />
              </div>
            </motion.section>

          </motion.div>
        </AnimatePresence>
      </DashboardLayout>
    </>
  );
}

export default App;
