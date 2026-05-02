// Vithu Marketplace - Premium Navbar
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiUser, FiMenu, FiPackage, FiLogOut, FiActivity } from 'react-icons/fi';
import Logo from './Logo';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [user, setUser] = React.useState(() => {
    const saved = localStorage.getItem('vithu_user');
    return saved ? JSON.parse(saved) : null;
  });

  const userRole = user?.role || null;

  React.useEffect(() => {
    const handleAuthChange = () => {
      const saved = localStorage.getItem('vithu_user');
      setUser(saved ? JSON.parse(saved) : null);
    };
    window.addEventListener('storage', handleAuthChange);
    return () => window.removeEventListener('storage', handleAuthChange);
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    window.dispatchEvent(new CustomEvent('openConfirm', {
      detail: {
        message: "Do you want to logout from വിത്ത്?",
        onConfirm: () => {
          localStorage.removeItem('vithu_token');
          localStorage.removeItem('vithu_user');
          localStorage.removeItem('vithu_role');
          setUser(null);
          window.location.href = '/';
        }
      }
    }));
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-[999] transition-all duration-500">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <Logo />
            <span className="text-2xl font-black text-emerald-600 group-hover:text-emerald-500 transition-colors tracking-tighter">വിത്ത്</span>
            <span className="hidden">v1.2.1-admin-fix</span>
          </Link>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {!userRole ? (
              <>
                <button onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { mode: 'login' } }))} className="text-sm font-black text-gray-500 hover:text-emerald-600 uppercase tracking-widest transition-colors">Login</button>
                <button onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { mode: 'register' } }))} className="bg-emerald-600 text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">Join</button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                {userRole === 'admin' ? (
                   <Link to="/admin" className="text-sm font-black text-emerald-600 uppercase tracking-widest hover:underline">Command Center</Link>
                ) : (
                  <>
                    <button onClick={() => window.location.href = '/my-orders'} className="text-gray-700 hover:text-emerald-600 p-2 transition-all" title="Track Orders"><FiPackage size={22} /></button>
                    <button onClick={() => window.dispatchEvent(new Event('openCart'))} className="text-gray-700 hover:text-emerald-600 p-2 relative transition-all">
                      <FiShoppingBag size={22} />
                      <span className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-black">
                        {JSON.parse(localStorage.getItem('vithu_cart') || '[]').length}
                      </span>
                    </button>
                  </>
                )}
                <div className="relative">
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="text-gray-700 hover:text-emerald-600 p-2 transition-all"><FiUser size={22} /></button>
                  <AnimatePresence>
                    {isProfileOpen && (
                      <>
                        <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)} />
                        <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-4 w-56 bg-white rounded-[30px] shadow-2xl border border-emerald-50 p-3 overflow-hidden z-50">
                           {userRole === 'admin' ? (
                             <button onClick={() => { window.location.href = '/admin'; setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-5 py-4 text-sm font-black text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-2xl transition-all"><FiActivity size={18} /> Admin Panel</button>
                           ) : (
                             <button onClick={() => { window.location.href = '/profile'; setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-5 py-4 text-sm font-black text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-2xl transition-all"><FiUser size={18} /> Edit Profile</button>
                           )}
                           <div className="h-px bg-gray-50 my-1 mx-2" />
                           <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-4 text-sm font-black text-red-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all"><FiLogOut size={18} /> Logout</button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            {userRole && (
              <button onClick={() => window.dispatchEvent(new Event('openCart'))} className="text-gray-700 p-2 relative"><FiShoppingBag size={22} /><span className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-black">{JSON.parse(localStorage.getItem('vithu_cart') || '[]').length}</span></button>
            )}
            <button onClick={() => window.dispatchEvent(new Event('toggleMobileMenu'))} className="text-gray-900 p-2 bg-gray-50 rounded-xl">
              <FiMenu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
