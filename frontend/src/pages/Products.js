import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiMapPin, FiShoppingBag } from 'react-icons/fi';

// Updated Mock Data for Vithu
const MOCK_PRODUCTS = [
  { id: 1, name: 'Fresh Organic Tomatoes', price: 40, unit: 'kg', farmer: 'Kerala Organic Farm', category: 'Vegetables', rating: 4.8, reviews: 24, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80' },
  { id: 2, name: 'Sweet Malabar Mangoes', price: 120, unit: 'kg', farmer: 'Sunshine Orchards', category: 'Fruits', rating: 4.9, reviews: 56, image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=500&q=80' },
  { id: 3, name: 'Farm Fresh Country Eggs', price: 80, unit: 'dozen', farmer: 'Happy Hens', category: 'Dairy', rating: 4.7, reviews: 12, image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=500&q=80' },
  { id: 4, name: 'Organic Palak Spinach', price: 30, unit: 'bunch', farmer: 'Kerala Organic Farm', category: 'Vegetables', rating: 4.5, reviews: 8, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80' },
  { id: 5, name: 'Stone Ground Wheat', price: 50, unit: 'kg', farmer: 'Golden Fields', category: 'Grains', rating: 4.6, reviews: 31, image: 'https://images.unsplash.com/photo-1627485937980-221c88ce04ea?w=500&q=80' },
  { id: 6, name: 'Wild Forest Honey', price: 250, unit: '500g', farmer: 'Sweet Bees', category: 'Other', rating: 5.0, reviews: 15, image: 'https://images.unsplash.com/photo-1587049352847-4d4b126a575a?w=500&q=80' },
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://vithu.onrender.com';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/products`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        } else {
          setProducts(MOCK_PRODUCTS);
        }
      } catch (err) {
        setProducts(MOCK_PRODUCTS);
      }
    };
    fetchProducts();
  }, [baseUrl]);

  const handleAddToCart = (product, quantity) => {
    const userRole = localStorage.getItem('vithu_role');
    if (!userRole) {
      window.dispatchEvent(new Event('openAuthModal'));
      return;
    }
    
    // Dispatch global event for live update in App.js
    window.dispatchEvent(new CustomEvent('addToCart', { 
      detail: { product, quantity: quantity || 1 } 
    }));
    
    window.dispatchEvent(new CustomEvent('notify', { detail: `${product.name} added to cart! 🛒` }));
  };

  const queryParams = new URLSearchParams(window.location.search);
  const farmerFilter = queryParams.get('farmer');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    const matchesFarmer = !farmerFilter || p.farmer?._id === farmerFilter || p.farmer === farmerFilter;
    return matchesSearch && matchesCategory && matchesFarmer;
  });

  return (
    <div className="py-12 px-2 relative">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">നാടൻ വിപണി</h1>
          <p className="text-gray-500 font-medium">Fresh, organic, and ethically sourced from local farms.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full xl:w-auto gap-4">
          <div className="relative flex-grow min-w-[300px]">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-600 font-bold" />
            <input 
              type="text" 
              placeholder="Search produce..." 
              className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-emerald-50 focus:border-emerald-500 outline-none shadow-sm transition-all bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-600 z-10" />
            <select 
              className="pl-12 pr-10 py-4 rounded-2xl border-2 border-emerald-50 focus:border-emerald-500 outline-none appearance-none shadow-sm bg-white cursor-pointer font-bold text-gray-700 transition-all"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All Produce</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Dairy">Dairy</option>
              <option value="Grains">Grains</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-[40px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group border border-gray-50 flex flex-col h-full">
            <div className="h-64 overflow-hidden relative">
              <img 
                src={product.images && product.images.length > 0 
                  ? (product.images[0].startsWith("http") ? product.images[0] : baseUrl + product.images[0])
                  : (product.image && product.image.startsWith("http") ? product.image : baseUrl + product.image)
                } 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl text-lg font-black text-emerald-700 shadow-xl border border-white/50">
                ₹{product.price}<span className="text-sm text-gray-400 font-bold">/{product.unit}</span>
              </div>
              <div className="absolute top-4 left-4 bg-emerald-600 text-white px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">
                {product.category}
              </div>
            </div>
            
            <div className="p-8 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">{product.name}</h3>
              </div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4 flex items-center gap-1">
                 <FiMapPin className="text-emerald-500" /> {typeof product.farmer === 'object' ? (product.farmer?.farmName || product.farmer?.name) : product.farmer}
              </p>
              
              <div className="mt-auto space-y-6">
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                   <div className="flex flex-col">
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantity ({product.unit})</span>
                     <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1 px-3 mt-1 border border-emerald-50">
                        <input 
                          id={`qty-${product.id}`}
                          type="number" 
                          defaultValue="1" 
                          min="1" 
                          className="w-10 bg-transparent font-black text-gray-800 outline-none text-center"
                        />
                     </div>
                   </div>
                   <div className="text-right">
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subtotal</span>
                     <p className="text-2xl font-black text-emerald-700">₹{product.price}</p>
                   </div>
                </div>

                <button 
                  onClick={() => {
                    const qty = parseInt(document.getElementById(`qty-${product.id}`).value) || 1;
                    handleAddToCart(product, qty);
                  }}
                  className="w-full py-5 rounded-[25px] bg-emerald-600 text-white font-black hover:bg-emerald-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-emerald-100 hover:shadow-emerald-200 active:scale-95"
                >
                  <FiShoppingBag className="text-xl" /> Add to Bucket
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-32 bg-gray-50 rounded-[40px]">
          <p className="text-gray-400 text-xl font-bold">No fresh produce found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Products;
