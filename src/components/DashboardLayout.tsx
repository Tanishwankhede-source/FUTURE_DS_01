import React from 'react';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen relative bg-[#050a14] text-white overflow-x-hidden">
      {/* === Background Layers === */}

      {/* 1. Aurora animated gradient orbs */}
      <div className="aurora-bg" aria-hidden="true">
        {/* Main blue orb */}
        <div
          style={{
            position: 'absolute',
            width: '80vw',
            height: '80vh',
            background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.09) 0%, transparent 70%)',
            top: '-20vh',
            left: '-20vw',
            animation: 'aurora-float 20s ease-in-out infinite alternate',
            filter: 'blur(80px)',
          }}
        />
        {/* Purple/violet orb */}
        <div
          style={{
            position: 'absolute',
            width: '70vw',
            height: '70vh',
            background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.07) 0%, transparent 70%)',
            bottom: '-15vh',
            right: '-15vw',
            animation: 'aurora-float 25s ease-in-out infinite alternate-reverse',
            filter: 'blur(100px)',
          }}
        />
        {/* Teal midsection orb */}
        <div
          style={{
            position: 'absolute',
            width: '50vw',
            height: '50vh',
            background: 'radial-gradient(ellipse at center, rgba(20,184,166,0.05) 0%, transparent 70%)',
            top: '40vh',
            left: '25vw',
            animation: 'aurora-float 30s ease-in-out infinite alternate',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* 2. Animated dot grid */}
      <div className="dot-grid" aria-hidden="true" />

      {/* 3. Subtle top gradient bar */}
      <div
        className="fixed top-0 left-0 right-0 h-px z-50"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.7) 30%, rgba(139,92,246,0.7) 70%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* === Main Content === */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 space-y-6"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default DashboardLayout;
