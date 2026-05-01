import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiCreditCard, FiMapPin, FiTruck, FiChevronRight, FiShoppingBag } from 'react-icons/fi';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('Razorpay (UPI/Card)');
  
  const cart = JSON.parse(localStorage.getItem('vithu_cart') || '[]');
  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate Razorpay/Payment Gateway processing
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
      // In a real app, we would send the order to the backend here
      localStorage.removeItem('vithu_cart');
    }, 2500);
  };

  if (orderComplete) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-xl p-12 rounded-[50px] shadow-2xl border border-white text-center max-w-lg"
        >
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full mx-auto mb-8 flex items-center justify-center text-5xl">
            <FiCheckCircle />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">ഓർഡർ വിജയിച്ചു!</h2>
          <p className="text-gray-500 font-bold mb-8 italic">Order Placed Successfully! Your fresh produce will be on its way soon.</p>
          <button 
            onClick={() => window.location.href = '/my-orders'}
            className="w-full py-5 bg-emerald-600 text-white rounded-[25px] font-black shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all"
          >
            Track My Order
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Side: Forms */}
        <div className="flex-1 space-y-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">ചെക്കൗട്ട്</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-4 mb-10">
             {[1, 2, 3].map((s) => (
               <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${step >= s ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{s}</div>
                  {s < 3 && <div className={`w-12 h-1 rounded-full ${step > s ? 'bg-emerald-600' : 'bg-gray-100'}`} />}
               </div>
             ))}
          </div>

          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/80 backdrop-blur-xl p-10 rounded-[40px] shadow-xl border border-white space-y-6">
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3"><FiMapPin className="text-emerald-600" /> Delivery Address</h3>
              <div className="space-y-4">
                <input placeholder="Full Name" className="w-full bg-gray-50/50 border-2 border-emerald-50 rounded-2xl px-6 py-4 font-bold outline-none focus:border-emerald-500 transition-all" />
                <input placeholder="Phone Number" className="w-full bg-gray-50/50 border-2 border-emerald-50 rounded-2xl px-6 py-4 font-bold outline-none focus:border-emerald-500 transition-all" />
                <textarea placeholder="Complete Address" rows="3" className="w-full bg-gray-50/50 border-2 border-emerald-50 rounded-2xl px-6 py-4 font-bold outline-none focus:border-emerald-500 transition-all" />
              </div>
              <button 
                onClick={() => setStep(2)}
                className="w-full py-5 bg-emerald-600 text-white rounded-[25px] font-black shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
              >
                Proceed to Payment <FiChevronRight />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/80 backdrop-blur-xl p-10 rounded-[40px] shadow-xl border border-white space-y-6">
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3"><FiCreditCard className="text-emerald-600" /> Payment Method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {['Razorpay (UPI/Card)', 'Cash on Delivery'].map((m) => (
                   <div 
                      key={m} 
                      onClick={() => setSelectedMethod(m)}
                      className={`p-6 border-2 rounded-3xl cursor-pointer transition-all bg-emerald-50/20 group ${selectedMethod === m ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-50 hover:border-emerald-200'}`}
                    >
                      <p className={`font-black ${selectedMethod === m ? 'text-emerald-600' : 'text-emerald-800'}`}>{m}</p>
                   </div>
                 ))}
              </div>
              <div className="pt-4 flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black">Back</button>
                <button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-[2] py-5 bg-emerald-600 text-white rounded-[25px] font-black shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
                >
                  {isProcessing ? 'Processing...' : `Pay ₹${total} via ${selectedMethod.split(' ')[0]}`}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-white/90 backdrop-blur-xl p-10 rounded-[40px] shadow-xl border border-white sticky top-24">
             <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3"><FiShoppingBag className="text-emerald-600" /> Order Summary</h3>
             <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-bold">{item.name} <span className="text-gray-400 font-medium">x{item.quantity || 1}</span></span>
                    <span className="font-black text-gray-900">₹{item.price * (item.quantity || 1)}</span>
                  </div>
                ))}
                {cart.length === 0 && <p className="text-gray-400 italic">No items in summary.</p>}
             </div>
             
             <div className="space-y-4 pt-6 border-t border-gray-100">
               <div className="flex justify-between text-gray-500 font-bold">
                 <span>Subtotal</span>
                 <span>₹{total}</span>
               </div>
               <div className="flex justify-between text-gray-500 font-bold">
                 <span>Delivery Fee</span>
                 <span className="text-emerald-600">FREE</span>
               </div>
               <div className="flex justify-between items-center pt-4 border-t-2 border-emerald-50">
                 <span className="text-lg font-black text-gray-900">Total</span>
                 <span className="text-2xl font-black text-emerald-700">₹{total}</span>
               </div>
             </div>

             <div className="mt-8 p-4 bg-emerald-50 rounded-2xl flex items-center gap-3 border border-emerald-100">
               <FiTruck className="text-emerald-600 text-xl" />
               <p className="text-[10px] text-emerald-800 font-black uppercase tracking-wider">Fast delivery to your location</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
