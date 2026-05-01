import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiShoppingBag, FiX } from "react-icons/fi";
import OrderMap from '../components/OrderMap';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user orders from backend
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('vithu_token');
        const res = await fetch('https://vithu.onrender.com/api/orders/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          // Mock data for demo
          setOrders([
            { _id: '1', items: 'Fresh Organic Tomatoes (2kg)', total: 80, status: 'out for delivery', date: 'Oct 24, 2026' },
            { _id: '2', items: 'Sweet Malabar Mangoes (3kg)', total: 360, status: 'delivered', date: 'Oct 20, 2026' }
          ]);
        }
      } catch (err) {
        setOrders([
          { _id: '1', items: 'Fresh Organic Tomatoes (2kg)', total: 80, status: 'out for delivery', date: 'Oct 24, 2026' },
          { _id: '2', items: 'Sweet Malabar Mangoes (3kg)', total: 360, status: 'delivered', date: 'Oct 20, 2026' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const [trackingOrder, setTrackingOrder] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock className="text-orange-500" />;
      case 'confirmed': return <FiPackage className="text-blue-500" />;
      case 'packed': return <FiPackage className="text-emerald-500" />;
      case 'out for delivery': return <FiTruck className="text-emerald-500" />;
      case 'delivered': return <FiCheckCircle className="text-emerald-600" />;
      default: return <FiClock />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <AnimatePresence>
        {trackingOrder && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[50px] p-10 shadow-2xl border border-white max-w-2xl w-full relative overflow-hidden"
            >
               <button onClick={() => setTrackingOrder(null)} className="absolute top-8 right-8 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 z-10"><FiX /></button>
               
               <h3 className="text-3xl font-black text-gray-900 mb-2">ലൈവ് ട്രാക്കിംഗ്</h3>
               <p className="text-gray-400 font-bold mb-8 uppercase tracking-widest text-xs">Tracking Order #VITHU-{trackingOrder._id.slice(-4)}</p>

               {/* Real Interactive Map */}
               <div className="relative h-64 bg-emerald-50 rounded-[40px] mb-8 overflow-hidden border border-emerald-100">
                  <OrderMap status={trackingOrder.status} />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-6 py-2 rounded-2xl shadow-xl border border-white z-[1001]">
                     <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest whitespace-nowrap">Status: {trackingOrder.status}</p>
                  </div>
               </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                     <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center"><FiTruck /></div>
                     <div>
                        <p className="text-xs font-black text-gray-900">Estimated Delivery</p>
                        <p className="text-[10px] font-bold text-emerald-600">Arriving in 25 - 40 mins</p>
                     </div>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-emerald-600 tracking-tight">എന്റെ ഓർഡറുകൾ</h1>
          <p className="text-gray-500 font-bold italic text-sm">My Orders & Tracking</p>
        </div>
        <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center text-3xl shadow-inner">
          🛍️
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <motion.div 
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl p-8 rounded-[40px] shadow-xl border border-white hover:shadow-2xl transition-all group"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
               <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${
                    order.status === 'delivered' ? 'bg-emerald-100' : 'bg-orange-50 animate-pulse'
                  }`}>
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order #VITHU-{order._id.slice(-4)}</p>
                    <h3 className="text-xl font-black text-gray-900 mb-1">{order.items}</h3>
                    <p className="text-sm font-bold text-gray-400">{order.date} • ₹{order.total}</p>
                  </div>
               </div>
               
               <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                  <span className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-sm ${
                    order.status === 'delivered' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {order.status}
                  </span>
                  <button 
                    onClick={() => setTrackingOrder(order)}
                    className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline flex items-center gap-1"
                  >
                    Track on Map <FiMapPin />
                  </button>
               </div>
            </div>
            
            {/* Simple Track Progress */}
            <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between px-2">
               {['Pending', 'Confirmed', 'Out for Delivery', 'Delivered'].map((step, i) => {
                 const isActive = ['pending', 'confirmed', 'packed', 'out for delivery', 'delivered'].indexOf(order.status) >= i;
                 return (
                   <div key={step} className="flex flex-col items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-emerald-600' : 'bg-gray-200'}`} />
                      <span className={`text-[8px] font-black uppercase tracking-wider ${isActive ? 'text-emerald-700' : 'text-gray-300'}`}>{step}</span>
                   </div>
                 );
               })}
            </div>
          </motion.div>
        ))}

        {orders.length === 0 && !loading && (
          <div className="text-center py-20 bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-200">
             <FiShoppingBag className="text-6xl text-gray-200 mx-auto mb-6" />
             <p className="text-gray-400 font-bold italic">You haven't placed any orders yet.</p>
             <button 
              onClick={() => window.location.href = '/products'}
              className="mt-6 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
             >
               Start Shopping
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
