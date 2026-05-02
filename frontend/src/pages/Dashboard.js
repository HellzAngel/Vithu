import React, { useState, useEffect } from 'react';
import { FiPackage, FiSettings, FiLogOut, FiPlus, FiShoppingCart, FiTrendingUp, FiDollarSign, FiClock, FiMapPin } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add', 'edit', 'delete'
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://vithu.onrender.com';

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('vithu_token');
      try {
        const pRes = await fetch(`${baseUrl}/api/products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const pData = await pRes.json();
        if (pData.success) setProducts(pData.products);

        const oRes = await fetch(`${baseUrl}/api/orders/farmer-orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const oData = await oRes.json();
        if (oData.success) setOrders(oData.orders);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, [baseUrl]);

  const showNotification = (msg) => {
    window.dispatchEvent(new CustomEvent('notify', { detail: msg }));
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('vithu_token');
    try {
      const res = await fetch(`${baseUrl}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => (o.id || o._id) === orderId ? { ...o, status: newStatus } : o));
        showNotification(`Order status updated to ${newStatus}! 🚚`);
      }
    } catch (err) {
      showNotification("Error updating status");
    }
  };

  const handleAcceptOrder = (id) => {
    handleUpdateOrderStatus(id, 'confirmed');
  };

  const openModal = (type, product = null) => {
    setModalType(type);
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async () => {
    const token = localStorage.getItem('vithu_token');
    try {
      const res = await fetch(`${baseUrl}/api/products/${selectedProduct.id || selectedProduct._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setProducts(products.filter(p => (p.id || p._id) !== (selectedProduct.id || selectedProduct._id)));
        setIsModalOpen(false);
        showNotification(`${selectedProduct.name} removed from inventory.`);
      }
    } catch (err) {
      showNotification("Error removing product");
    }
  };

  const [uploading, setUploading] = useState(false);

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const token = localStorage.getItem('vithu_token');
    
    setUploading(true);
    let imagePath = selectedProduct?.image || selectedProduct?.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80';

    // Handle Image Upload
    const imageFile = formData.get('imageFile');
    if (imageFile && imageFile.name) {
      const imgFormData = new FormData();
      imgFormData.append('images', imageFile);
      try {
        const uploadRes = await fetch(`${baseUrl}/api/upload`, {
          method: 'POST',
          body: imgFormData,
          // Multer handles multipart, don't set Content-Type
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          imagePath = uploadData.paths[0];
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    const productData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: Number(formData.get('price')),
      unit: formData.get('unit'),
      quantityAvailable: Number(formData.get('stock')),
      category: formData.get('category'),
      images: [imagePath]
    };

    try {
      const method = modalType === 'add' ? 'POST' : 'PUT';
      const url = modalType === 'add' 
        ? `${baseUrl}/api/products` 
        : `${baseUrl}/api/products/${selectedProduct.id || selectedProduct._id}`;

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      
      const data = await res.json();
      if (data.success) {
        if (modalType === 'add') {
          setProducts([...products, data.product]);
          showNotification(`${productData.name} added to inventory! 🌱`);
        } else {
          setProducts(products.map(p => (p.id || p._id) === (selectedProduct.id || selectedProduct._id) ? data.product : p));
          showNotification(`${productData.name} updated successfully!`);
        }
        setIsModalOpen(false);
      } else {
        showNotification(data.message || "Error saving product");
      }
    } catch (err) {
      showNotification("Error saving product");
    } finally {
      setUploading(false);
    }
  };

  const stats = [
    { label: 'Total Sales', value: '₹12,450', icon: <FiDollarSign />, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Orders', value: orders.length.toString(), icon: <FiPackage />, color: 'bg-blue-100 text-blue-600' },
    { label: 'Revenue', value: '₹8,920', icon: <FiTrendingUp />, color: 'bg-orange-100 text-orange-600' },
    { label: 'Pending', value: orders.filter(o => o.status === 'pending').length.toString(), icon: <FiClock />, color: 'bg-red-100 text-red-600' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[80vh] relative">
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-10 z-10 border border-emerald-50"
            >
              {modalType === 'delete' ? (
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl mx-auto mb-6 flex items-center justify-center text-3xl">⚠️</div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Are you sure?</h3>
                  <p className="text-gray-500 font-medium mb-8 text-sm">Do you really want to remove <span className="font-black text-gray-800">{selectedProduct?.name}</span>? This action cannot be undone.</p>
                  <div className="flex gap-4">
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-2xl bg-gray-50 text-gray-500 font-black hover:bg-gray-100 transition-all">Cancel</button>
                    <button onClick={handleDeleteProduct} className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-black hover:bg-red-600 shadow-xl shadow-red-200 transition-all">Delete Item</button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-3xl font-black text-gray-900 mb-2">{modalType === 'add' ? 'Add New Item' : 'Edit Product'}</h3>
                  <p className="text-sm font-medium text-gray-400 mb-8 tracking-tight">Keep your farm inventory updated and fresh.</p>
                  <form onSubmit={handleSaveProduct} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">Product Name</label>
                      <input name="name" defaultValue={selectedProduct?.name} required className="w-full bg-gray-50 border-2 border-emerald-50 rounded-2xl px-6 py-4 font-bold outline-none focus:border-emerald-500 transition-all"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">Price (₹)</label>
                        <input name="price" defaultValue={selectedProduct?.price} required className="w-full bg-gray-50 border-2 border-emerald-50 rounded-2xl px-6 py-4 font-bold outline-none focus:border-emerald-500 transition-all"/>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">Unit (kg/bunch)</label>
                        <input name="unit" defaultValue={selectedProduct?.unit || 'kg'} required className="w-full bg-gray-50 border-2 border-emerald-50 rounded-2xl px-6 py-4 font-bold outline-none focus:border-emerald-500 transition-all"/>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">Stock Level</label>
                        <input name="stock" defaultValue={selectedProduct?.stock} placeholder="e.g. 50kg" required className="w-full bg-gray-50 border-2 border-emerald-50 rounded-2xl px-6 py-4 font-bold outline-none focus:border-emerald-500 transition-all"/>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">Category</label>
                        <select name="category" defaultValue={selectedProduct?.category} className="w-full bg-gray-50 border-2 border-emerald-50 rounded-2xl px-6 py-4 font-bold outline-none focus:border-emerald-500 transition-all">
                          <option>Vegetables</option>
                          <option>Fruits</option>
                          <option>Dairy</option>
                          <option>Grains</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">Description</label>
                      <textarea name="description" defaultValue={selectedProduct?.description} required rows="2" className="w-full bg-gray-50 border-2 border-emerald-50 rounded-2xl px-6 py-3 font-bold outline-none focus:border-emerald-500 transition-all resize-none"/>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">Product Image</label>
                      <input type="file" name="imageFile" accept="image/*" className="w-full bg-gray-50 border-2 border-emerald-50 rounded-2xl px-6 py-2 font-bold outline-none focus:border-emerald-500 transition-all text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"/>
                    </div>
                    <button 
                      type="submit" 
                      disabled={uploading}
                      className="w-full py-4 bg-emerald-600 text-white rounded-3xl font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50 mt-4"
                    >
                      {uploading ? 'Processing...' : (modalType === 'add' ? 'Launch Product' : 'Save Changes')}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar / Mobile Tab Bar */}
      <div className="w-full lg:w-72 bg-white/90 backdrop-blur-xl rounded-[30px] lg:rounded-[40px] shadow-xl border border-white/50 p-6 lg:p-8 flex flex-col h-max lg:sticky top-24 z-20">
        <div className="mb-8 lg:mb-10 text-center hidden lg:block">
          <div className="w-24 h-24 bg-emerald-100 rounded-3xl mx-auto mb-4 flex items-center justify-center text-4xl shadow-inner rotate-3">
            👨‍🌾
          </div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Kerala Organic Farm</h2>
          <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Farmer Verified</p>
        </div>

        <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 lg:overflow-visible no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: <FiTrendingUp /> },
            { id: 'products', label: 'My Products', icon: <FiPackage /> },
            { id: 'orders', label: 'Orders', icon: <FiShoppingCart />, badge: orders.filter(o => o.status === 'pending').length },
            { id: 'settings', label: 'Settings', icon: <FiSettings /> },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 lg:gap-4 px-4 lg:px-5 py-3 lg:py-4 rounded-2xl font-bold transition-all whitespace-nowrap lg:whitespace-normal shrink-0 ${
                activeTab === item.id 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-600'
              }`}
            >
              <span className="text-lg lg:text-xl">{item.icon}</span>
              <span className="text-sm lg:text-base">{item.label}</span>
              {item.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <button 
          onClick={() => {
            window.dispatchEvent(new CustomEvent('openConfirm', {
              detail: {
                message: "Do you want to logout from വിത്ത് Farmer Panel?",
                onConfirm: () => {
                  localStorage.removeItem('vithu_role');
                  window.location.href = '/';
                }
              }
            }));
          }}
          className="mt-6 lg:mt-12 hidden lg:flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all"
        >
          <FiLogOut className="text-xl" /> Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-8">
        
        {/* Stats Row */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50 hover:translate-y-[-4px] transition-all cursor-default">
                <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm`}>
                  {stat.icon}
                </div>
                <p className="text-xs font-black text-gray-400 mb-1 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white/90 backdrop-blur-xl rounded-[40px] shadow-xl border border-white/50 p-8 md:p-12">
          
          {activeTab === 'overview' && (
            <div>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-gray-900">Incoming Orders</h2>
                <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest">Real-time Feed</span>
              </div>
              <div className="space-y-6">
                {orders.filter(o => o.status === 'pending').map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row items-center gap-6 p-8 rounded-[30px] border border-gray-50 bg-gray-50/50 hover:bg-white hover:shadow-2xl transition-all">
                    <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-3xl shadow-inner">📦</div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="text-xl font-black text-gray-900">Order #VITHU-{order.id}</h4>
                      <p className="text-gray-400 font-medium">{order.items} • ₹{order.total} • {order.time}</p>
                    </div>
                    <button 
                      onClick={() => handleAcceptOrder(order.id)}
                      className="w-full sm:w-auto bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all active:scale-95"
                    >
                      Accept Order
                    </button>
                  </div>
                ))}
                {orders.filter(o => o.status === 'pending').length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-gray-400 font-bold italic">All caught up! No pending orders.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-gray-900">Inventory Management</h2>
                <button 
                  onClick={() => openModal('add')}
                  className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
                >
                  <FiPlus className="text-2xl" /> Add New Item
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-4">
                  <thead>
                    <tr className="text-gray-400 uppercase text-[10px] font-black tracking-[0.2em] px-4">
                      <th className="px-6 py-2">Item Details</th>
                      <th className="px-6 py-2">Price</th>
                      <th className="px-6 py-2">Stock Level</th>
                      <th className="px-6 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="bg-gray-50/50 rounded-3xl hover:bg-white hover:shadow-2xl transition-all group">
                        <td className="px-6 py-6 rounded-l-[30px] flex items-center gap-6 border-l border-t border-b border-transparent group-hover:border-emerald-100">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-gray-50 flex items-center justify-center">
                             {product.images && product.images.length > 0 ? (
                               <img 
                                 src={product.images[0].startsWith("http") ? product.images[0] : baseUrl + product.images[0]} 
                                 alt={product.name} 
                                 className="w-full h-full object-cover"
                               />
                             ) : (
                               <span className="text-2xl opacity-20">🌱</span>
                             )}
                          </div>
                          <div>
                            <p className="font-black text-gray-900 text-lg">{product.name}</p>
                            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">{product.category}</p>
                          </div>
                        </td>
                        <td className="px-6 py-6 font-black text-gray-600 border-t border-b border-transparent group-hover:border-emerald-100 text-lg">₹{product.price} <span className="text-sm font-bold text-gray-400">/{product.unit}</span></td>
                        <td className="px-6 py-6 border-t border-b border-transparent group-hover:border-emerald-100">
                          <span className="bg-emerald-100 text-emerald-700 px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider">{product.stock} Available</span>
                        </td>
                        <td className="px-6 py-6 rounded-r-[30px] text-right border-r border-t border-b border-transparent group-hover:border-emerald-100">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openModal('edit', product)} className="p-4 text-emerald-600 hover:bg-emerald-50 rounded-2xl font-black transition-all">Edit</button>
                            <button onClick={() => openModal('delete', product)} className="p-4 text-red-500 hover:bg-red-50 rounded-2xl font-black transition-all">Remove</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-3xl">
              <h2 className="text-3xl font-black text-gray-900 mb-10">Account Settings</h2>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Farm Name</label>
                    <input type="text" defaultValue="Kerala Organic Farm" className="w-full bg-gray-50 border-2 border-emerald-50 rounded-2xl px-6 py-4 font-bold text-gray-800 outline-none focus:border-emerald-500 transition-all shadow-sm"/>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <input type="text" defaultValue="+91 98765 43210" className="w-full bg-gray-50 border-2 border-emerald-50 rounded-2xl px-6 py-4 font-bold text-gray-800 outline-none focus:border-emerald-500 transition-all shadow-sm"/>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Farm Address</label>
                  <textarea rows="3" defaultValue="Kuttanad, Alappuzha, Kerala - 688504" className="w-full bg-gray-50 border-2 border-emerald-50 rounded-2xl px-6 py-4 font-bold text-gray-800 outline-none focus:border-emerald-500 transition-all shadow-sm"></textarea>
                </div>

                <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                         <FiMapPin size={24} />
                      </div>
                      <div>
                        <p className="font-black text-emerald-900">Map Coordinates</p>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Pin your farm on the live map</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        if (navigator.geolocation) {
                          showNotification("Fetching location... 🛰️");
                          navigator.geolocation.getCurrentPosition(async (pos) => {
                            try {
                              const token = localStorage.getItem('vithu_token');
                              const res = await fetch(`${baseUrl}/api/auth/profile`, {
                                method: 'PUT',
                                headers: { 
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({ 
                                  lat: pos.coords.latitude, 
                                  lng: pos.coords.longitude 
                                })
                              });
                              if (res.ok) {
                                showNotification("GPS Location Updated! 📍");
                              } else {
                                showNotification("Failed to update profile.");
                              }
                            } catch (err) {
                              showNotification("Network error. Try again.");
                            }
                          }, (err) => {
                            showNotification("GPS Blocked. Use manual entry below.");
                          });
                        } else {
                          showNotification("GPS not supported.");
                        }
                      }}
                      className="w-full md:w-auto px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-100"
                    >
                      Use Live GPS
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-1">Latitude</label>
                      <input 
                        type="number" 
                        step="0.000001"
                        placeholder="e.g. 9.4981" 
                        id="manual-lat"
                        className="w-full bg-white border border-emerald-100 rounded-xl px-4 py-3 font-bold text-gray-800 outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-1">Longitude</label>
                      <input 
                        type="number" 
                        step="0.000001"
                        placeholder="e.g. 76.3388" 
                        id="manual-lng"
                        className="w-full bg-white border border-emerald-100 rounded-xl px-4 py-3 font-bold text-gray-800 outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>
                    <button 
                      onClick={async () => {
                        const lat = document.getElementById('manual-lat').value;
                        const lng = document.getElementById('manual-lng').value;
                        if (!lat || !lng) return showNotification("Enter both coordinates!");
                        
                        const token = localStorage.getItem('vithu_token');
                        const res = await fetch(`${baseUrl}/api/auth/profile`, {
                          method: 'PUT',
                          headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({ lat: parseFloat(lat), lng: parseFloat(lng) })
                        });
                        if (res.ok) showNotification("Manual Location Saved! 📍");
                      }}
                      className="col-span-2 py-3 bg-white text-emerald-600 border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all mt-2"
                    >
                      Save Manual Coordinates
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h4 className="text-lg font-black text-gray-900 mb-4">Payout Settings</h4>
                  <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-emerald-800">Bank Account Linked</p>
                      <p className="text-sm text-emerald-600 font-medium">State Bank of India • **** 4321</p>
                    </div>
                    <button className="text-emerald-700 font-black text-xs uppercase tracking-widest hover:underline">Change</button>
                  </div>
                </div>

                <button className="bg-emerald-600 text-white px-10 py-5 rounded-[20px] font-black hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all active:scale-95">
                  Save All Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
