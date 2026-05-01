import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiLock, FiMail, FiArrowRight } from 'react-icons/fi';
import Logo from './Logo';

const AuthModal = ({ isOpen, onClose, initialRole = 'customer' }) => {
  const [role, setRole] = React.useState(initialRole);
  const [isLogin, setIsLogin] = useState(true);

  React.useEffect(() => {
    if (isOpen) {
      setRole(initialRole);
    }
  }, [isOpen, initialRole]);

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
          className="relative w-full max-w-lg bg-white rounded-3xl md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20"
        >
          {/* Left Side: Role Selector & Visual */}
          <div className="w-full md:w-56 bg-emerald-600 p-4 md:p-8 text-white flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl mb-4 md:mb-6 flex items-center justify-center text-xl md:text-2xl">🌱</div>
              <h2 className="text-xl md:text-2xl font-black mb-1 md:mb-2 tracking-tight">Welcome to വിത്ത്</h2>
              <p className="text-xs opacity-70 font-medium leading-relaxed">Choose your persona to start your journey.</p>
            </div>
            
            <div className="space-y-2 mt-4 md:mt-8">
              <button 
                onClick={() => setRole('customer')}
                className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${role === 'customer' ? 'bg-white text-emerald-600 shadow-xl' : 'bg-white/10 hover:bg-white/20'}`}
              >
                Customer
              </button>
              <button 
                onClick={() => setRole('farmer')}
                className={`w-full py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${role === 'farmer' ? 'bg-white text-emerald-600 shadow-xl' : 'bg-white/10 hover:bg-white/20'}`}
              >
                Farmer
              </button>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="flex-1 p-4 md:p-6">


            {/* Main Form Section */}
            <div className="flex-1 p-2 sm:p-4">
              <div className="mb-4">
                <div className="lg:hidden flex justify-center mb-2">
                  <Logo />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-sm font-medium text-gray-400">
                  Join the most trusted farmer network in Kerala.
                </p>
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
                          className="w-full pl-12 pr-6 py-3 rounded-2xl border-2 border-emerald-50 focus:border-emerald-500 outline-none font-bold text-sm transition-all"
                          placeholder="Full Name"
                        />
                      </div>
                    )}
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" />
                      <input
                        type="email"
                        required
                        className="w-full pl-12 pr-6 py-3 rounded-2xl border-2 border-emerald-50 focus:border-emerald-500 outline-none font-bold text-sm transition-all"
                        placeholder="Email address"
                      />
                    </div>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" />
                      <input
                        type="password"
                        required
                        className="w-full pl-12 pr-6 py-3 rounded-2xl border-2 border-emerald-50 focus:border-emerald-500 outline-none font-bold text-sm transition-all"
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
                      className="w-full py-3 mt-2 bg-emerald-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all transform active:scale-95"
                    >
                      {isLogin ? 'Sign In' : 'Join Now'} <FiArrowRight />
                    </button>

                    <div className="text-center mt-4">
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
