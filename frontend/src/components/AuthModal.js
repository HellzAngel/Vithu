import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiLock, FiMail, FiArrowRight } from 'react-icons/fi';


const AuthModal = ({ isOpen, onClose, initialRole = 'customer' }) => {
  const [role, setRole] = React.useState(initialRole);
  const [isLogin, setIsLogin] = useState(true);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', farmName: '', address: '', city: '', pincode: '', otp: ''
  });

  React.useEffect(() => {
    if (isOpen) {
      setRole(initialRole);
      setIsOtpStep(false);
      setFormData({ name: '', email: '', password: '', phone: '', farmName: '', address: '', city: '', pincode: '', otp: '' });
    }
  }, [isOpen, initialRole]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Get geolocation if possible
    let lat = null, lng = null;
    if (navigator.geolocation) {
      await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            lat = pos.coords.latitude;
            lng = pos.coords.longitude;
            resolve();
          },
          () => resolve(),
          { timeout: 5000 }
        );
      });
    }

    try {
      if (isLogin) {
        const res = await fetch('https://vithu.onrender.com/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        const data = await res.json();
        if (data.success) {
          localStorage.setItem('vithu_token', data.token);
          localStorage.setItem('vithu_user', JSON.stringify(data.user));
          window.location.reload();
        } else {
          alert(data.message);
        }
      } else {
        // Register
        const res = await fetch('https://vithu.onrender.com/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, role, lat, lng })
        });
        const data = await res.json();
        if (data.success) {
          setIsOtpStep(true);
        } else {
          alert(data.message);
        }
      }
    } catch (err) {
      alert("Something went wrong");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('https://vithu.onrender.com/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: formData.otp })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('vithu_token', data.token);
        localStorage.setItem('vithu_user', JSON.stringify(data.user));
        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("OTP verification failed");
    }
    setLoading(false);
  };

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
          className="relative w-full max-w-2xl bg-white rounded-3xl md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20"
        >
          {/* Left Side: Role Selector & Visual */}
          <div className="w-full md:w-56 bg-emerald-600 p-4 md:p-8 text-white flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl mb-4 md:mb-6 flex items-center justify-center text-xl md:text-2xl">🌱</div>
              <h2 className="text-xl md:text-2xl font-black mb-1 md:mb-2 tracking-tight">Welcome to വിത്ത്</h2>
              <p className="text-xs opacity-70 font-medium leading-relaxed">Choose your persona to start your journey.</p>
            </div>
            
            {!isOtpStep && (
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
            )}
          </div>

          {/* Right Side: Form */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex-1 p-2 sm:p-4">
              <div className="mb-4 text-center md:text-left">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-1">
                  {isOtpStep ? 'Verify OTP' : (isLogin ? 'Welcome Back' : 'Create Account')}
                </h2>
                <p className="text-xs font-medium text-gray-400">
                  {isOtpStep ? `Enter the code sent to ${formData.email}` : (isLogin ? 'Sign in to your account' : 'Join the most trusted farm network')}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {isOtpStep ? (
                  <motion.form key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" />
                      <input name="otp" value={formData.otp} onChange={handleInputChange} required className="w-full pl-12 pr-6 py-3 rounded-2xl border-2 border-emerald-50 focus:border-emerald-500 outline-none font-bold text-sm text-center tracking-[1em]" placeholder="000000" maxLength="6" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-3 bg-emerald-600 text-white rounded-2xl font-black shadow-xl hover:bg-emerald-700 transition-all disabled:opacity-50">
                      {loading ? 'Verifying...' : 'Verify & Finish'}
                    </button>
                  </motion.form>
                ) : (
                  <motion.form key="auth" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} onSubmit={handleAuth} className="space-y-3">
                    {!isLogin && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="relative col-span-2">
                          <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" />
                          <input name="name" value={formData.name} onChange={handleInputChange} required className="w-full pl-12 pr-6 py-3 rounded-2xl border-2 border-emerald-50 focus:border-emerald-500 outline-none font-bold text-sm" placeholder="Full Name" />
                        </div>
                        <div className="relative col-span-2 md:col-span-1">
                          <input name="address" value={formData.address} onChange={handleInputChange} required className="w-full px-6 py-3 rounded-2xl border-2 border-emerald-50 focus:border-emerald-500 outline-none font-bold text-sm" placeholder="Address" />
                        </div>
                        <div className="relative col-span-2 md:col-span-1">
                          <input name="city" value={formData.city} onChange={handleInputChange} required className="w-full px-6 py-3 rounded-2xl border-2 border-emerald-50 focus:border-emerald-500 outline-none font-bold text-sm" placeholder="City / District" />
                        </div>
                        <div className="relative col-span-2 md:col-span-1">
                          <input name="pincode" value={formData.pincode} onChange={handleInputChange} required className="w-full px-6 py-3 rounded-2xl border-2 border-emerald-50 focus:border-emerald-500 outline-none font-bold text-sm" placeholder="Pincode" maxLength="6" />
                        </div>
                        {role === 'farmer' && (
                          <>
                            <div className="relative col-span-2 md:col-span-1">
                              <input name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-6 py-3 rounded-2xl border-2 border-emerald-50 focus:border-emerald-500 outline-none font-bold text-sm" placeholder="Phone Number" />
                            </div>
                            <div className="relative col-span-2 md:col-span-1">
                              <input name="farmName" value={formData.farmName} onChange={handleInputChange} required className="w-full px-6 py-3 rounded-2xl border-2 border-emerald-50 focus:border-emerald-500 outline-none font-bold text-sm" placeholder="Farm / Store Name" />
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" />
                      <input name="email" type="email" value={formData.email} onChange={handleInputChange} required className="w-full pl-12 pr-6 py-3 rounded-2xl border-2 border-emerald-50 focus:border-emerald-500 outline-none font-bold text-sm" placeholder="Email address" />
                    </div>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" />
                      <input name="password" type="password" value={formData.password} onChange={handleInputChange} required className="w-full pl-12 pr-6 py-3 rounded-2xl border-2 border-emerald-50 focus:border-emerald-500 outline-none font-bold text-sm" placeholder="Password" />
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-3 mt-2 bg-emerald-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all transform active:scale-95 disabled:opacity-50">
                      {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Send OTP')} <FiArrowRight />
                    </button>

                    <div className="text-center mt-4">
                      <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-500">
                        {isLogin ? "New to വിത്ത്? Create Account" : "Already a member? Sign In"}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
