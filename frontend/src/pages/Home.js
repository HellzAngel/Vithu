import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiShield, FiHeart } from 'react-icons/fi';
import FarmerMap from '../components/FarmerMap';

const Home = () => {
  const userRole = localStorage.getItem('vithu_role');

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto px-4 py-16 bg-white/60 backdrop-blur-md rounded-3xl shadow-xl border border-white/50 mb-16 relative overflow-hidden">
        <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-50px] left-20 w-32 h-32 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-6 relative z-10 leading-[1.3] md:leading-[1.1] tracking-tight">
          വിത്ത്: <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400">മണ്ണിൽ നിന്ന് നേരിട്ട്,</span> <br/>
          നിങ്ങളുടെ വീട്ടിലേക്ക്.
        </h1>
        <p className="text-2xl text-gray-700 mb-10 max-w-2xl mx-auto relative z-10 font-medium leading-relaxed">
          The heartbeat of Kerala's agriculture. Connecting local farmers to your table with zero middlemen.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          {userRole === 'farmer' ? (
            <Link to="/dashboard" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              Go to Farmer Panel <FiArrowRight />
            </Link>
          ) : userRole === 'admin' ? (
            <Link to="/admin" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              Command Center <FiArrowRight />
            </Link>
          ) : (
            <Link to="/products" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              Start Shopping <FiArrowRight />
            </Link>
          )}
          
          {!userRole && (
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { mode: 'register', role: 'farmer' } }))} 
              className="bg-white hover:bg-gray-50 text-emerald-800 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-md hover:shadow-lg border border-gray-200"
            >
              Join as a Farmer
            </button>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl px-4">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-white">
          <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center text-emerald-600 mb-6">
            <FiTruck size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">Direct Delivery</h3>
          <p className="text-gray-600">Cut out the middleman. Farmers deliver straight to you, ensuring maximum freshness and fair prices.</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-white">
          <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center text-emerald-600 mb-6">
            <FiShield size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">Quality Assured</h3>
          <p className="text-gray-600">All our farmers are vetted. Review systems keep quality high and communities safe.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-white">
          <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center text-emerald-600 mb-6">
            <FiHeart size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">Support Local</h3>
          <p className="text-gray-600">Every purchase helps a local family. Build a stronger, healthier community together.</p>
        </div>
      </div>

      {/* Map Section */}
      <div className="w-full max-w-6xl px-4 mt-24 mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">നിങ്ങൾക്കടുത്തുള്ള കർഷകർ</h2>
          <p className="text-gray-500 font-bold italic">Find local farmers near you in Kerala</p>
        </div>
        <FarmerMap />
      </div>
    </div>
  );
};

export default Home;
