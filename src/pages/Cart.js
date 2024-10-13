import React, { useState } from 'react';
import { Truck, Trash2, Plus, Minus } from 'lucide-react';

import Image1 from '../assets/images/potato.jpg';
import Image2 from '../assets/images/strawberry.jpeg';
import Image3 from '../assets/images/tomato.jpeg';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Fresh Farm Potatoes', farm: 'Al-Raheem Farms', price: 116.00, perItem: 46.00, image: Image1, quantity: 1 },
    { id: 2, name: 'Fresh Farm Tomatoes', farm: 'Al-Raheem Farms', price: 44.80, perItem: 12.20, image: Image3, quantity: 1 },
    { id: 3, name: 'Strawberries', farm: 'Al-Raheem Farms', price: 1156.00, perItem: 460.00, image: Image2, quantity: 1 },
  ]);

  const updateQuantity = (id, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = totalPrice * 0.05;
  const finalTotal = totalPrice + tax;

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-750">Wasp Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md mb-6 hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-6" />
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                    <p className="text-sm text-gray-600">{item.farm}</p>
                    <div className="mt-2 flex items-center">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md p-1">
                        <Minus className="h-4 w-4" />
                      </button>
                      <input 
                        type="number" 
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-16 mx-2 text-center border border-gray-300 rounded-md p-1"
                      />
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md p-1">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">${item.perItem.toFixed(2)} / per item</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="ml-4 text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-full">
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
                  <span className="font-semibold">${totalPrice.toFixed(2)}</span>
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
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300">
                  Proceed to Checkout
                </button>
                <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors duration-300">
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