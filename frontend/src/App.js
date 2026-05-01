import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FiShoppingBag, FiX, FiCheckCircle, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import ThreeBackground from './components/ThreeBackground';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/Home';
import Products from './pages/Products';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import AuthModal from './components/AuthModal';
import Logo from './components/Logo';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('vithu_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [notification, setNotification] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  useEffect(() => {
    localStorage.setItem('vithu_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Global listeners for modals
  useEffect(() => {
    const handleOpenAuth = () => setIsAuthModalOpen(true);
    const handleOpenCart = () => setIsCartOpen(true);
    const handleToggleMenu = () => setIsMenuOpen(prev => !prev);
    const handleNotify = (e) => setNotification(e.detail);
    const handleConfirm = (e) => setConfirmModal(e.detail);
    
    const handleAddToCartGlobal = (e) => {
      const { product, quantity } = e.detail;
      setCart(prev => {
        // Check if item already in cart
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
          return prev.map(item => item.id === product.id 
            ? { ...item, quantity: item.quantity + (quantity || 1) } 
            : item
          );
        }
        return [...prev, { ...product, quantity: quantity || 1 }];
      });
      setIsCartOpen(true);
    };

    window.addEventListener('openAuthModal', handleOpenAuth);
    window.addEventListener('openCart', handleOpenCart);
    window.addEventListener('toggleMobileMenu', handleToggleMenu);
    window.addEventListener('notify', handleNotify);
    window.addEventListener('addToCart', handleAddToCartGlobal);
    window.addEventListener('openConfirm', handleConfirm);

    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuth);
      window.removeEventListener('openCart', handleOpenCart);
      window.removeEventListener('toggleMobileMenu', handleToggleMenu);
      window.removeEventListener('notify', handleNotify);
      window.removeEventListener('addToCart', handleAddToCartGlobal);
      window.removeEventListener('openConfirm', handleConfirm);
    };
  }, []);

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  const handleUpdateQuantity = (index, delta) => {
    setCart(prev => prev.map((item, i) => {
      if (i === index) {
        const newQty = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const showNotification = (msg) => {
    setNotification(msg);
    // Auto-close success modal after 3s
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <Router>
      <AnimatePresence>
        {isLoading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Global Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[40px] p-10 shadow-2xl border border-white text-center max-w-sm w-full"
            >
               <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl mx-auto mb-6 flex items-center justify-center text-2xl shadow-inner">
                 ⚠️
               </div>
               <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">നിറപ്പകിട്ടാർന്ന...</h3>
               <p className="text-gray-500 font-bold mb-8 text-sm">{confirmModal.message}</p>
               <div className="flex gap-4">
                  <button 
                    onClick={() => setConfirmModal(null)}
                    className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black hover:bg-gray-100 transition-all"
                  >
                    ഒഴിവാക്കുക
                  </button>
                  <button 
                    onClick={() => {
                      confirmModal.onConfirm();
                      setConfirmModal(null);
                    }}
                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
                  >
                    ഉറപ്പാണ്
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsMenuOpen(false)} 
              className="fixed inset-0 bg-emerald-950/40 backdrop-blur-md z-[500]" 
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: 'spring', damping: 30, stiffness: 300 }} 
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[510] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-8 pb-12">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-xl font-black">V</div>
                    <span className="text-xl font-black text-emerald-600 tracking-tighter">വിത്ത്</span>
                  </div>
                  <button onClick={() => setIsMenuOpen(false)} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:bg-gray-100 transition-all">
                    <FiX size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {!localStorage.getItem('vithu_role') ? (
                    <div className="bg-emerald-50 p-8 rounded-[40px] mb-8">
                        <h4 className="text-2xl font-black text-emerald-900 mb-2 leading-tight">Join Vithu</h4>
                        <p className="text-emerald-700/60 font-bold text-sm mb-6 italic">Support local farmers.</p>
                        <button onClick={() => { setIsMenuOpen(false); setIsAuthModalOpen(true); }} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-100">Get Started</button>
                    </div>
                  ) : (
                    <>
                      <div className="bg-emerald-600 p-8 rounded-[40px] mb-10 relative overflow-hidden group">
                         <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">🌱</div>
                         <div className="relative z-10 text-white">
                            <p className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.2em] mb-1">Welcome back</p>
                            <h4 className="text-2xl font-black tracking-tight">{localStorage.getItem('vithu_role') === 'farmer' ? 'Farmer Panel' : 'My Account'}</h4>
                         </div>
                      </div>

                      <div className="grid gap-3">
                        <button onClick={() => { window.location.href = '/profile'; setIsMenuOpen(false); }} className="flex items-center gap-4 p-5 bg-gray-50 rounded-3xl font-black text-gray-700 hover:bg-emerald-50 transition-all">
                           <FiUser className="text-emerald-600" /> Edit Profile
                        </button>
                        <button onClick={() => { window.location.href = '/my-orders'; setIsMenuOpen(false); }} className="flex items-center gap-4 p-5 bg-gray-50 rounded-3xl font-black text-gray-700 hover:bg-emerald-50 transition-all">
                           <FiShoppingBag className="text-emerald-600" /> Track Orders
                        </button>
                        <button onClick={() => { setIsMenuOpen(false); setIsCartOpen(true); }} className="flex items-center gap-4 p-5 bg-gray-50 rounded-3xl font-black text-gray-700 hover:bg-emerald-50 transition-all">
                           <FiShoppingBag className="text-emerald-600" /> My Bucket
                        </button>
                        
                        <div className="pt-8 border-t border-gray-100 mt-4">
                          <button 
                            onClick={() => {
                              setIsMenuOpen(false);
                              setConfirmModal({
                                message: "Do you want to logout from വിത്ത്?",
                                onConfirm: () => {
                                  localStorage.removeItem('vithu_role');
                                  window.location.href = '/';
                                }
                              });
                            }}
                            className="flex items-center gap-4 p-5 w-full text-red-400 font-black hover:bg-red-50 rounded-3xl transition-all"
                          >
                             <FiX /> Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-auto p-8 bg-gray-50/50">
                 <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] text-center">© 2026 VITHU</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Success Popup */}
      <AnimatePresence>
        {notification && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-emerald-950/20 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="bg-white rounded-[50px] p-10 shadow-2xl border border-emerald-50 text-center max-w-sm w-full"
            >
               <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl shadow-inner">
                 <FiCheckCircle />
               </div>
               <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">സക്സസ്സ്!</h3>
               <p className="text-gray-500 font-bold mb-8 italic">{notification}</p>
               <button 
                onClick={() => setNotification(null)}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
               >
                 Awesome
               </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[350] flex items-center justify-end">
             <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col z-10"
            >
               <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                 <h3 className="text-2xl font-black text-gray-900 tracking-tight">നിങ്ങളുടെ കുട്ട</h3>
                 <button onClick={() => setIsCartOpen(false)} className="p-3 bg-white rounded-2xl hover:bg-gray-100 shadow-sm"><FiX /></button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-8 space-y-6">
                 {cart.length === 0 ? (
                   <div className="text-center py-20 flex flex-col items-center">
                     <motion.div 
                       initial={{ y: 20, opacity: 0 }}
                       animate={{ y: 0, opacity: 1 }}
                       transition={{ type: 'spring', damping: 15 }}
                       className="relative mb-8"
                     >
                        <div className="w-40 h-40 bg-emerald-50 rounded-full flex items-center justify-center relative">
                          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-300 drop-shadow-xl">
                            <path d="M19 11H5L3 19H21L19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5 11L7 5H17L19 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="15" r="1.5" fill="currentColor"/>
                          </svg>
                          <motion.div 
                            animate={{ y: [0, -10, 0] }} 
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute -top-2 -right-2 text-4xl"
                          >
                            🍃
                          </motion.div>
                        </div>
                     </motion.div>
                     <h4 className="text-xl font-black text-gray-900 mb-2">കുട്ട കാലിയാണ്!</h4>
                     <p className="text-gray-400 font-bold italic text-sm">Your basket is waiting for some fresh produce.</p>
                     <button 
                        onClick={() => {
                          setIsCartOpen(false);
                          window.location.href = '/products';
                        }}
                        className="mt-8 px-8 py-3 bg-emerald-100 text-emerald-700 rounded-2xl font-black hover:bg-emerald-200 transition-all"
                     >
                       Start Shopping
                     </button>
                   </div>
                 ) : (
                   cart.map((item, i) => (
                     <div key={i} className="flex gap-4 items-center bg-gray-50/50 p-5 rounded-[30px] border border-emerald-50 hover:border-emerald-200 transition-all group">
                        <img src={item.image} className="w-20 h-20 rounded-2xl object-cover shadow-sm border-2 border-white" />
                        <div className="flex-1">
                          <p className="font-black text-gray-800 text-sm mb-1">{item.name}</p>
                          <p className="text-xs text-emerald-600 font-black mb-3">₹{item.price}/{item.unit}</p>
                          
                          <div className="flex items-center gap-3">
                             <button 
                               onClick={() => handleUpdateQuantity(i, -1)}
                               className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all font-black"
                             >
                               -
                             </button>
                             <span className="text-sm font-black text-gray-800 w-4 text-center">{item.quantity || 1}</span>
                             <button 
                               onClick={() => handleUpdateQuantity(i, 1)}
                               className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all font-black"
                             >
                               +
                             </button>
                          </div>
                        </div>
                        <div className="text-right flex flex-col justify-between h-20 py-1">
                          <button onClick={() => handleRemoveFromCart(i)} className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl self-end transition-all opacity-0 group-hover:opacity-100"><FiX /></button>
                          <p className="font-black text-gray-900 text-sm">₹{item.price * (item.quantity || 1)}</p>
                        </div>
                     </div>
                   ))
                 )}
               </div>

               {cart.length > 0 && (
                 <div className="p-10 bg-emerald-950 text-white space-y-6">
                    <div className="flex justify-between items-center px-2">
                       <span className="text-emerald-300 font-bold uppercase text-xs tracking-widest">Total Payable</span>
                       <span className="text-3xl font-black">₹{totalAmount}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setIsCartOpen(false);
                        window.location.href = '/checkout';
                      }}
                      className="w-full py-5 bg-emerald-500 text-white rounded-3xl font-black shadow-xl shadow-emerald-900/50 hover:bg-emerald-400 transition-all active:scale-95 text-lg"
                    >
                      Proceed to Checkout
                    </button>
                 </div>
               )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="relative min-h-screen">
        {/* Immersive 3D Background */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <ThreeBackground />
        </div>
        
        {/* App Content */}
        <div className="relative z-10 flex flex-col min-h-screen backdrop-blur-sm bg-white/30">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/products" element={<Products />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          
          <footer className="bg-emerald-950 text-white text-center py-10 mt-auto backdrop-blur-md">
            <p className="text-xl font-black mb-2 tracking-tighter">വിത്ത്</p>
            <p className="text-xs opacity-60 font-medium uppercase tracking-widest">&copy; {new Date().getFullYear()} Vithu Marketplace. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;
