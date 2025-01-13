import React, { useState, useEffect } from 'react';
import { Truck, Trash2, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import {toast} from "react-toastify";
const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user.userId;

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/cart/items/${userId}`);
      
      if (response.data.success) {
        setCartItems(response.data.data);
      } else {
        if (response.data.message === "No cart found for user") {
          setCartItems([]);
        } else {
          setError(response.data.message);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch cart items');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (cartId, itemId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/cart/delete/${cartId}/${itemId}`);
      if (response.data.success) {
        fetchCartItems();
         toast.success("Item Removed Successfully", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
      } else {
        setError(response.data.message);
         toast.error("Failed to remove item", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
      }
    } catch (err) {
      setError(err.message || 'Failed to remove item');
      toast.error("Failed to remove item", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
    }
  };

  const calculateTotals = () => {
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = totalPrice * 0.05;
    return {
      subtotal: totalPrice,
      tax: tax,
      total: totalPrice + tax
    };
  };

  useEffect(() => {
    fetchCartItems();
  }, [userId]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  const EmptyCart = () => (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
      <button 
        onClick={() => window.history.back()} 
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
      >
        Continue Shopping
      </button>
    </div>
  );

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-gray-750">Shopping Cart</h1>
        <EmptyCart />
      </div>
    );
  }

  const { subtotal, tax, total } = calculateTotals();

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-750">Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {cartItems.map((item) => (
            <div key={item.itemId} className="bg-white rounded-lg shadow-md mb-6 hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center">
                  <img 
                    src={`data:image/jpeg;base64,${item.itemImage}`}
                    alt={item.itemName} 
                    className="w-24 h-24 object-cover rounded-md mr-6" 
                  />
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">{item.itemName}</h2>
                    <p className="text-sm text-gray-600 mb-1">Seller: {item.ownerName}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} / per item</p>
                  </div>
                  <button 
                    onClick={() => removeItem(item.cartId, item.itemId)} 
                    className="ml-4 text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-full"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="bg-white rounded-lg shadow-md mt-6">
            <div className="p-4 flex items-center text-gray-600">
              <Truck className="mr-2 text-green-500" />
              <span className="font-medium">Free Delivery within 1-2 weeks</span>
            </div>
          </div>
        </div>
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (5%):</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span className="text-green-500 font-semibold">Free</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between font-bold text-lg text-gray-800">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300">
                  Proceed to Checkout
                </button>
                <button 
                  onClick={() => window.history.back()}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors duration-300"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;