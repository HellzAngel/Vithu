import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiBriefcase, FiLock, FiMail, FiArrowRight } from 'react-icons/fi';

const Login = () => {
  const [role, setRole] = useState('customer'); // 'customer' or 'farmer'
  const [isLogin, setIsLogin] = useState(true);

  const toggleRole = (newRole) => {
    setRole(newRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-lime-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-sm w-full space-y-6 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 z-10"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Welcome back to വിത്ത്' : 'Join the വിത്ത് Community'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connecting farmers directly to your doorstep
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex p-1 bg-gray-100 rounded-xl relative">
          <motion.div 
            className="absolute h-full w-1/2 bg-white rounded-lg shadow-sm z-0"
            animate={{ x: role === 'customer' ? 0 : '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 300 }}
          />
          <button 
            onClick={() => toggleRole('customer')}
            className={`relative z-10 w-1/2 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${role === 'customer' ? 'text-emerald-600' : 'text-gray-500'}`}
          >
            <FiUser /> Customer
          </button>
          <button 
            onClick={() => toggleRole('farmer')}
            className={`relative z-10 w-1/2 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${role === 'farmer' ? 'text-emerald-600' : 'text-gray-500'}`}
          >
            <FiBriefcase /> Farmer
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'signup'}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div>
              <h2 className="mt-6 text-center text-3xl font-black text-gray-900 tracking-tight">
                {isLogin ? 'Welcome back to വിത്ത്' : 'Join the വിത്ത് Community'}
              </h2>
              <p className="mt-2 text-center text-sm font-medium text-gray-500">
                {isLogin ? 'Continuing the journey of fresh produce' : 'Connecting farmers directly to your doorstep'}
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                {!isLogin && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="relative"
                  >
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" />
                    <input
                      type="text"
                      required
                      className="appearance-none relative block w-full px-12 py-4 border-2 border-emerald-50 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:border-emerald-500 sm:text-sm bg-white/50 transition-all"
                      placeholder="Full Name"
                    />
                  </motion.div>
                )}
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" />
                  <input
                    type="email"
                    required
                    className="appearance-none relative block w-full px-12 py-4 border-2 border-emerald-50 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:border-emerald-500 sm:text-sm bg-white/50 transition-all"
                    placeholder="Email address"
                  />
                </div>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" />
                  <input
                    type="password"
                    required
                    className="appearance-none relative block w-full px-12 py-4 border-2 border-emerald-50 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:border-emerald-500 sm:text-sm bg-white/50 transition-all"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  onClick={() => {
                    localStorage.setItem('vithu_role', role);
                    window.location.href = role === 'farmer' ? '/dashboard' : '/products';
                  }}
                  className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform hover:scale-[1.02] shadow-lg shadow-emerald-200"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                    <FiArrowRight className="h-5 w-5 text-emerald-400 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </span>
                  {isLogin ? 'Sign In' : 'Create Account'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm font-black text-emerald-600 hover:text-emerald-500 uppercase tracking-widest"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </form>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Login;
