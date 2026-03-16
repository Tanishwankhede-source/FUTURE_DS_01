import React from 'react';
import { motion } from 'framer-motion';
import type { DashboardData } from '../types/data';
import { Download, FileText, ImageIcon } from 'lucide-react';

interface ExportToolbarProps {
  data: DashboardData;
}

const ExportToolbar: React.FC<ExportToolbarProps> = ({ data }) => {

  const downloadCSV = () => {
    const rows = [
      ['State', 'Total Sales', 'Total Profit', 'Profit Margin %'],
      ...data.stateSales.map(s => [
        s.state,
        s.sales.toFixed(2),
        s.profit.toFixed(2),
        s.sales > 0 ? ((s.profit / s.sales) * 100).toFixed(2) : '0'
      ])
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'superstore_state_summary.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadTopProducts = () => {
    const rows = [
      ['Product', 'Revenue'],
      ...data.topProducts.map(p => [p.name, p.sales.toFixed(2)])
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'superstore_top_products.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadScreenshot = () => {
    // Save as PNG using print, since html2canvas may not be installed
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex flex-wrap gap-2 items-center"
    >
      <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold mr-1">Export:</span>
      <button
        onClick={downloadCSV}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-200 group"
        title="Export state summary CSV"
      >
        <FileText className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
        State Summary
      </button>
      <button
        onClick={downloadTopProducts}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 hover:border-blue-500/40 transition-all duration-200 group"
        title="Export top products CSV"
      >
        <Download className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
        Top Products
      </button>
      <button
        onClick={downloadScreenshot}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-lg hover:bg-violet-500/20 hover:border-violet-500/40 transition-all duration-200 group"
        title="Print / save as PDF"
      >
        <ImageIcon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
        Print / PDF
      </button>
    </motion.div>
  );
};

export default ExportToolbar;
