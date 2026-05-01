import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiBriefcase, FiLock, FiMail, FiArrowRight } from 'react-icons/fi';
import Logo from './Logo';

const AuthModal = ({ isOpen, onClose }) => {
  const [role, setRole] = useState('customer');
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-emerald-950/60 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20"
        >
          {/* Left Side: Role Selector & Visual */}
          <div className="w-full md:w-56 bg-emerald-600 p-8 text-white flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-white/20 rounded-2xl mb-6 flex items-center justify-center text-2xl">🌱</div>
              <h2 className="text-2xl font-black mb-2 tracking-tight">Welcome to വിത്ത്</h2>
              <p className="text-xs opacity-70 font-medium leading-relaxed">Choose your persona to start your journey.</p>
            </div>
            
            <div className="space-y-3 mt-8">
              <button 
                onClick={() => setRole('customer')}
                className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${role === 'customer' ? 'bg-white text-emerald-600 shadow-xl' : 'bg-white/10 hover:bg-white/20'}`}
              >
                Customer
              </button>
              <button 
                onClick={() => setRole('farmer')}
                className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${role === 'farmer' ? 'bg-white text-emerald-600 shadow-xl' : 'bg-white/10 hover:bg-white/20'}`}
              >
                Farmer
              </button>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="flex-1 p-8 md:p-10">
            <div className="flex justify-between items-center mb-10">
               <div>
                 <h3 className="text-3xl font-black text-gray-900 mb-1">{isLogin ? 'Login' : 'Sign Up'}</h3>
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Persona: {role}</p>
               </div>
            </div>

            {/* Main Form Section */}
            <div className="flex-1 p-8 sm:p-12">
              <div className="mb-10">
                <div className="lg:hidden flex justify-center mb-6">
                  <Logo />
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-sm font-medium text-gray-400">
                  Join the most trusted farmer network in Kerala.
                </p>
              </div>

              {/* Role Toggle */}
              <div className="flex p-1.5 bg-gray-50 rounded-2xl relative mb-8 border border-gray-100">
                <motion.div 
                  className="absolute h-[calc(100%-12px)] w-[calc(50%-6px)] bg-white rounded-xl shadow-md z-0"
                  animate={{ x: role === 'customer' ? 0 : '100%' }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
                <button 
                  onClick={() => setRole('customer')}
                  className={`relative z-10 w-1/2 py-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${role === 'customer' ? 'text-emerald-600' : 'text-gray-400'}`}
                >
                  <FiUser /> Customer
                </button>
                <button 
                  onClick={() => setRole('farmer')}
                  className={`relative z-10 w-1/2 py-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${role === 'farmer' ? 'text-emerald-600' : 'text-gray-400'}`}
                >
                  <FiBriefcase /> Farmer
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? 'login' : 'signup'}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    {!isLogin && (
                      <div className="relative">
                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" />
                        <input
                          type="text"
                          required
                          className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-emerald-50 focus:border-emerald-500 outline-none font-bold text-sm transition-all"
                          placeholder="Full Name"
                        />
                      </div>
                    )}
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" />
                      <input
                        type="email"
                        required
                        className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-emerald-50 focus:border-emerald-500 outline-none font-bold text-sm transition-all"
                        placeholder="Email address"
                      />
                    </div>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" />
                      <input
                        type="password"
                        required
                        className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-emerald-50 focus:border-emerald-500 outline-none font-bold text-sm transition-all"
                        placeholder="Password"
                      />
                    </div>

                    <button
                      type="submit"
                      onClick={() => {
                        localStorage.setItem('vithu_role', role);
                        if (role === 'farmer') {
                          window.location.href = '/dashboard';
                        } else {
                          window.location.reload();
                        }
                      }}
                      className="w-full py-4 mt-4 bg-emerald-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all transform active:scale-95"
                    >
                      {isLogin ? 'Sign In' : 'Join Now'} <FiArrowRight />
                    </button>

                    <div className="text-center mt-6">
                      <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-500"
                      >
                        {isLogin ? "New to വിത്ത്? Create Account" : "Already a member? Sign In"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
