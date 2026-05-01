import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ animate: forcedAnimate }) => {
  return (
    <motion.div 
      className="relative flex items-center justify-center cursor-pointer"
      initial="initial"
      whileHover="hover"
      animate={forcedAnimate || "initial"}
    >
      {/* Immersive glow behind the logo - only on hover */}
      <motion.div 
        className="absolute inset-[-4px] bg-emerald-400/20 rounded-full blur-md opacity-0"
        variants={{
          hover: { scale: 1.5, opacity: 0.6, transition: { duration: 0.4 } },
          initial: { scale: 1, opacity: 0 }
        }}
      />
      
      {/* High-quality SVG Logo */}
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-md"
      >
        {/* Main Seed Shape */}
        <motion.path
          d="M50 20C30 20 15 40 15 65C15 85 30 95 50 95C70 95 85 85 85 65C85 40 70 20 50 20Z"
          fill="url(#seedGradient)"
          variants={{
            hover: { scale: 1.05, transition: { duration: 0.3 } },
            initial: { scale: 1 }
          }}
        />
        
        {/* Sprout Stem */}
        <motion.path
          d="M50 35C50 25 55 15 65 10"
          stroke="#4ADE80"
          strokeWidth="6"
          strokeLinecap="round"
          variants={{
            hover: { pathLength: [0.8, 1], transition: { duration: 0.3 } },
            initial: { pathLength: 1 }
          }}
        />
        
        {/* Little Leaf */}
        <motion.path
          d="M65 10C75 5 85 10 82 20C79 30 70 25 65 10Z"
          fill="#4ADE80"
          variants={{
            hover: { 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1],
              transition: { duration: 0.8, repeat: Infinity } 
            },
            initial: { rotate: 0, scale: 1 }
          }}
          style={{ originX: "65px", originY: "10px" }}
        />

        {/* Shine/Reflection */}
        <path
          d="M40 45C35 50 35 60 40 65"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.3"
        />

        <defs>
          <linearGradient id="seedGradient" x1="50" y1="20" x2="50" y2="95" gradientUnits="userSpaceOnUse">
            <stop stopColor="#059669" />
            <stop offset="1" stopColor="#065F46" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Decorative pulse for the 'living' feel - only on hover */}
      <motion.div 
        className="absolute inset-0 border-2 border-emerald-400 rounded-full opacity-0"
        variants={{
          hover: { 
            scale: [1, 1.8], 
            opacity: [0.5, 0],
            transition: { duration: 1, repeat: Infinity } 
          },
          initial: { scale: 1, opacity: 0 }
        }}
      />
    </motion.div>
  );
};

export default Logo;
