import React from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';

const LoadingScreen = () => {
  return (
    <motion.div 
      className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      {/* Background soft glow */}
      <div className="absolute w-[500px] h-[500px] bg-emerald-100/50 rounded-full filter blur-[120px] animate-pulse" />
      
      {/* Centered Logo with specialized loading animation */}
      <div className="relative z-10 scale-[2]">
        <Logo animate="hover" />
      </div>

      {/* Progress Text */}
      <div className="mt-20 text-center relative z-10">
        <motion.h2 
          className="text-3xl font-black text-emerald-900 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          വിത്ത്
        </motion.h2>
        <motion.p 
          className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-[10px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Sprouting Excellence...
        </motion.p>
      </div>

      {/* Animated loading bar */}
      <div className="mt-8 w-48 h-1 bg-emerald-50 rounded-full overflow-hidden relative z-10">
        <motion.div 
          className="absolute inset-y-0 left-0 bg-emerald-600 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
        />
      </div>

      {/* Decorative floating seeds */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-emerald-400 rounded-full opacity-20"
          initial={{ 
            x: Math.random() * window.innerWidth - window.innerWidth/2, 
            y: window.innerHeight/2 + 100 
          }}
          animate={{ 
            y: -window.innerHeight/2 - 100,
            rotate: 360,
            opacity: [0, 0.2, 0]
          }}
          transition={{ 
            duration: 3 + Math.random() * 2, 
            repeat: Infinity, 
            delay: Math.random() * 2 
          }}
        />
      ))}
    </motion.div>
  );
};

export default LoadingScreen;
