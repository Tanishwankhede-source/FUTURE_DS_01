import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, TrendingUp, Map, BarChart3, Table2, Lightbulb, ChevronLeft
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview', href: '#overview' },
  { id: 'insights', icon: Lightbulb, label: 'AI Insights', href: '#insights' },
  { id: 'trends', icon: TrendingUp, label: 'Trends', href: '#trends' },
  { id: 'categories', icon: BarChart3, label: 'Categories', href: '#categories' },
  { id: 'geo', icon: Map, label: 'Geography', href: '#geo' },
  { id: 'table', icon: Table2, label: 'Data Table', href: '#data-table' },
];

const SidebarNav: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState('overview');

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`fixed left-0 top-0 h-screen z-40 flex flex-col bg-[#0a0f1c]/95 backdrop-blur-md border-r border-slate-800/50 shadow-2xl shadow-black/40 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Logo area */}
      <div className={`flex items-center gap-3 p-4 mb-4 border-b border-slate-800/50 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
          <BarChart3 className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="text-sm font-bold text-white whitespace-nowrap">Analytics</span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <a
            key={item.id}
            href={item.href}
            onClick={() => setActive(item.id)}
            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
              active === item.id
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
            }`}
          >
            {active === item.id && (
              <motion.div
                layoutId="sidebar-active-indicator"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded-full"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <item.icon className={`w-4 h-4 shrink-0 transition-all group-hover:scale-110 ${collapsed ? 'mx-auto' : ''}`} />
            {!collapsed && (
              <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
            )}
            {/* Tooltip when collapsed */}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                {item.label}
              </div>
            )}
          </a>
        ))}
      </nav>

      {/* Collapse Button */}
      <div className="p-3 border-t border-slate-800/50">
        <button
          onClick={() => setCollapsed(c => !c)}
          className="w-full flex items-center justify-center p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 transition-all text-slate-400 hover:text-slate-200"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.div>
          {!collapsed && <span className="text-xs ml-2">Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default SidebarNav;
