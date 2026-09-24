import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from "../../Context/axiosInstance";
import { ShoppingBag, Sparkles, Clock, X, Plus, Minus, ShoppingCart } from 'lucide-react';
import greencoinIcon from '../../assets/peng.svg';
import { toastError, toastSuccess } from "../utils/toastCustom";

const customAnimationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes modalSlideIn {
    from { 
      opacity: 0; 
      transform: scale(0.9) translateY(20px); 
    }
    to { 
      opacity: 1; 
      transform: scale(1) translateY(0); 
    }
  }

  @keyframes modalSlideOut {
    from { 
      opacity: 1; 
      transform: scale(1) translateY(0); 
    }
    to { 
      opacity: 0; 
      transform: scale(0.9) translateY(20px); 
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }

  .animate-fade-out {
    animation: fadeOut 0.3s ease-in forwards;
  }

  .animate-modal-slide-in {
    animation: modalSlideIn 0.3s ease-out forwards;
  }

  .animate-modal-slide-out {
    animation: modalSlideOut 0.3s ease-in forwards;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes pingCustom {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.75; }
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .animate-ping-slow {
    animation: pingCustom 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`;

const GardenShop = ({ isOpen, onClose, user, setUser, onPurchase }) => {
  const [animateItems, setAnimateItems] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inventory, setInventory] = useState({});
  const [itemQuantities, setItemQuantities] = useState({});
  const [shopItems, setShopItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef(null);
  const backgroundRef = useRef(null);

  // Add dynamic animation styles
  useEffect(() => {
    // Create a style element to add custom animations
    const styleElement = document.createElement('style');
    styleElement.textContent = customAnimationStyles;
    document.head.appendChild(styleElement);

    // Cleanup function to remove the style element
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Fetch shop items from API
  useEffect(() => {
    const fetchShopItems = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/game/items/');
        const data = response.data;
        
        if (data.success && Array.isArray(data.items)) {
          setShopItems(data.items);
          
          // Initialize quantities for all items
          const initialQuantities = {};
          data.items.forEach(item => {
            initialQuantities[item.id] = 1;
          });
          setItemQuantities(initialQuantities);
          
          // Update user coins/points from the API response
          if (data.points !== undefined) {
            setUser(prevUser => ({
              ...prevUser,
              coins: data.points
            }));
          }
        } else {
          setError('Failed to load shop items');
        }
      } catch (err) {
        setError('Error connecting to the shop service');
        console.error('Shop fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchShopItems();
    }
  }, [isOpen]);

  // Initialize inventory on component mount
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axiosInstance.get('/game/inventory/');
        const inventoryData = {};
        response.data.forEach(item => {
          inventoryData[item.item.id] = item.quantity;
        });
        setInventory(inventoryData);
      } catch (err) {
        console.error('Inventory fetch error:', err);
        toastError('Failed to load inventory');
      }
    };

    if (isOpen && shopItems.length > 0) {
      fetchInventory();
    }
  }, [isOpen, shopItems]);

  // Use effect for open/close animations
  useEffect(() => {
    if (isOpen) {
      setAnimateItems(true);
      document.body.style.overflow = 'hidden';
    } else {
      setAnimateItems(false);
      setSelectedItem(null);
    }
  }, [isOpen]);

  // Update item quantity
  const updateItemQuantity = (itemId, change) => {
    setItemQuantities(prev => {
      const newQuantity = Math.max(1, (prev[itemId] || 1) + change);
      return { ...prev, [itemId]: newQuantity };
    });
  };
  
  // Handle purchase
  const handlePurchase = async (item) => {
    const quantity = itemQuantities[item.id] || 1;
    const totalPrice = item.price * quantity;
    
    if (user.coins >= totalPrice) {
      const button = document.getElementById(`buy-btn-${item.id}`);
      if (button) {
        button.classList.add("scale-90");
        setTimeout(() => {
          button.classList.remove("scale-90");
        }, 150);
      }
      
      try {
        const response = await axiosInstance.post(`/game/items/${item.id}/purchase/`, {
          quantity: quantity
        });
        
        const result = response.data;
        
        if (result.success) {
          // Update user coins
          setUser(prevUser => ({
            ...prevUser,
            coins: result.remaining_points,
            points_balance: result.remaining_points
          }));
          
          // Call the callback to update parent's inventory
          if (onPurchase) {
            onPurchase();
          }
          
          toastSuccess(`Successfully purchased ${quantity} ${item.name}!`);
        } else {
          toastError(result.message || "Purchase failed. Please try again.");
        }
      } catch (err) {
        toastError("Purchase failed. Please try again.");
        console.error('Purchase error:', err);
      }
    } else {
      toastError("Not enough coins!");
    }
  };

  // Handle item selection
  const handleItemSelect = (item) => {
    setSelectedItem(item);
  };

  // Enhanced close shop method with animation
  const handleCloseShop = () => {
    if (modalRef.current && backgroundRef.current) {
      // Trigger closing animations
      setIsClosing(true);
      modalRef.current.classList.add('animate-modal-slide-out');
      backgroundRef.current.classList.add('animate-fade-out');

      // Wait for animation to complete before actually closing
      setTimeout(() => {
        setIsClosing(false);
        onClose();
      }, 300); // Match this with animation duration
    } else {
      onClose();
    }
  };

  // Get item effects display
  const getItemEffectsDisplay = (item) => {
    if (!item.effects || item.effects.length === 0) {
      return "No special effects";
    }
    
    return item.effects.map(effect => effect.name).join(", ");
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div 
      ref={backgroundRef}
      className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-0 overflow-y-auto 
      ${isOpen ? 'animate-fade-in' : ''}`}
    >
      <div 
        ref={modalRef}
        className={`bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl max-h-full md:max-h-[90vh] flex flex-col transform transition-all duration-300 
        ${isOpen ? 'animate-modal-slide-in' : ''}`}
      >
        {/* Header */}
         <div className="bg-gradient-to-r from-emerald-300 to-green-600 p-4 flex justify-between items-center">
           <div className="flex items-center space-x-3">
             <div className="bg-white/20 p-2 rounded-lg">
               <ShoppingBag className="text-white" size={22} />
             </div>
             <h2 className="text-xl text-white tracking-wide">Garden Shop</h2>
           </div>
           <div className="flex items-center space-x-2">
             <button 
              onClick={handleCloseShop}
              className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-200"
              aria-label="Close shop"
            >
              <X size={18} color="white" />
            </button>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="p-4 md:p-6 bg-white overflow-y-auto flex-grow">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {shopItems.map((item, index) => (
                <div 
                  key={item.id}
                  className={`rounded-xl overflow-hidden shadow-md hover:shadow-xl transform transition-all duration-500 ${
                    animateItems ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  } hover:scale-103 cursor-pointer group`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                  onClick={() => handleItemSelect(item)}
                >
                  <div className="relative">
                    <div className="h-1 bg-gradient-to-r from-emerald-400 to-green-500"></div>
                    <div className="h-40 sm:h-44 md:h-52 flex items-center justify-center bg-gradient-to-b from-gray-50 to-emerald-50 relative">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-24 h-24 md:w-28 md:h-28 object-contain animate-float transform transition-transform duration-500 group-hover:scale-110 drop-shadow-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                        }}
                      />
                      {item.item_type === "NEW" && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          NEW!
                        </div>
                      )}
                      {item.item_type === "POPULAR" && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                          <Sparkles size={12} /> POPULAR
                        </div> 
                      )}
                      {inventory[item.id] > 0 && (
                        <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-1 py-1 rounded-lg shadow-md">
                          Owned: {inventory[item.id]}
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/30 via-black/20 to-transparent p-3 md:p-4">
                      <h3 className="text-green-700 font text-base md:text-lg">{item.name}</h3>
                      <p className="text-white/90 text-xs md:text-sm truncate">{item.description}</p>
                    </div>
                  </div>
                  <div className="bg-white p-2 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-1 truncate">
                      {item.effects && item.effects.length > 0 ? 
                        `Effects: ${getItemEffectsDisplay(item)}` : 
                        `Type: ${item.item_type}`
                      }
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center ">
                        <span className="text-gray-700 font-bold">{item.price}</span>
                        <img 
                          src={greencoinIcon} 
                          className="w-6 h-6 object-contain"
                          alt="Coins"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              updateItemQuantity(item.id, -1);
                            }}
                            className="p-1 hover:bg-gray-200 text-gray-700"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-0.5 text-black font-small">{itemQuantities[item.id] || 1}</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              updateItemQuantity(item.id, 1);
                            }}
                            className="p-1 hover:bg-gray-200 text-gray-700"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          id={`buy-btn-${item.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePurchase(item);
                          }}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
                          disabled={item.price === 0}
                        >
                          {item.price === 0 ? 'FREE' : 'BUY'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-emerald-50 p-4 flex justify-between items-center border-t border-gray-200">
          <div>
            <p className="text-gray-500 text-sm">Your balance:</p>
            <p className="text-emerald-600 flex items-center text-base font-semibold">
              <span>{user?.coins || 0}</span>
              <img 
                src={greencoinIcon} 
                className="w-7 h-7 object-contain"
              />
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 shadow-md"
              onClick={() => window.location.href = "/#lead-points"}
            >
              Get Coins
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Shop Button Component (Nested Component)
GardenShop.ShopButton = ({ onClick }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <button
      onClick={onClick}
      className={`fixed ${
        isMobile 
        ? 'bottom-190 right-4' // Mobile positioning
        : 'top-32 right-4' // Desktop positioning, moved down
      } bg-green-100 hover:from-emerald-500 hover:to-green-600 w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-110 z-40`}
      aria-label="Open Shop"
    >
      <div className="absolute w-full h-full rounded-full bg-green opacity-20 animate-ping-slow"></div>
      <ShoppingCart size={24} className="text-green-500" />
    </button>
  );
};

export default GardenShop;