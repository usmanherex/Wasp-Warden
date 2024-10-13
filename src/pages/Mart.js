import React, { useState } from 'react';
import { Search, Heart, Star } from 'lucide-react';

import Image1 from '../assets/images/potato.jpg';
import Image2 from '../assets/images/strawberry.jpeg';
import Image3 from '../assets/images/tomato.jpeg';

const products = [
  { id: 1, name: 'Apples', price: 1.60, oldPrice: 2.00, discount: '20%', image: Image1, unit: '1lb', rating: 4.67, description: 'An apple is a sweet, edible fruit produced by an apple tree (Malus domestica). Apple trees are ... The skin of ripe apples is generally red, green, g...' },
  { id: 2, name: 'Baby Spinach', price: 0.60, oldPrice: null, discount: null, image: Image2, unit: '2Pfund' },
  { id: 3, name: 'Blueberries', price: 3.00, oldPrice: null, discount: null, image: Image3, unit: '1lb' },
  { id: 4, name: 'Brussels Sprout', price: 3.00, oldPrice: 5.00, discount: '40%', image: Image1, unit: '1lb' },
];

const SearchBar = () => (
  <div className="relative w-full max-w-2xl mx-auto mt-8 mb-12">
    <input
      type="text"
      placeholder="Search your products from here"
      className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
    />
    <button className="absolute right-0 top-0 h-full px-4 bg-green-400 text-white rounded-r-lg">
      <Search className="w-6 h-6" />
    </button>
  </div>
);

const ProductCard = ({ product, onProductClick }) => (
  <div className="bg-white p-4 rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105" onClick={() => onProductClick(product)}>
    <div className="relative mb-4">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded" />
      {product.discount && (
        <span className="absolute top-2 left-2 bg-green-400 text-white px-2 py-1 rounded-full text-sm">{product.discount}</span>
      )}
    </div>
    <h3 className="font-semibold">{product.name}</h3>
    <p className="text-gray-500">{product.unit}</p>
    <div className="flex justify-between items-center mt-2">
      <div>
        <span className="text-green-600 font-bold">${product.price.toFixed(2)}</span>
        {product.oldPrice && (
          <span className="text-gray-400 line-through ml-2">${product.oldPrice.toFixed(2)}</span>
        )}
      </div>
      <button className="bg-green-500 text-white px-3 py-1 rounded">Cart</button>
    </div>
  </div>
);

const ProductPopup = ({ product, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-gray-500">{product.unit}</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
          &times;
        </button>
      </div>
      <div className="flex mb-6">
        <img src={product.image} alt={product.name} className="w-1/2 h-64 object-cover rounded mr-6" />
        <div>
          <div className="flex items-center mb-2">
            <span className="bg-green-400 text-white px-2 py-1 rounded-full text-sm mr-2">
              {product.discount || '0%'}
            </span>
            <span className="bg-green-400 text-white px-2 py-1 rounded-full text-sm flex items-center">
              <Star className="w-4 h-4 mr-1" fill="currentColor" /> {product.rating || '0.0'}
            </span>
            <Heart className="w-6 h-6 text-gray-400 ml-auto" />
          </div>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <div className="flex items-center">
            <span className="text-green-600 text-2xl font-bold">${product.price.toFixed(2)}</span>
            {product.oldPrice && (
              <span className="text-gray-400 line-through ml-2">${product.oldPrice.toFixed(2)}</span>
            )}
          </div>
          <button className="mt-4 bg-green-400 text-white px-6 py-2 rounded-full w-full">
            Add To Shopping Cart
          </button>
          <p className="text-gray-500 mt-2 text-center">18 pieces available</p>
        </div>
      </div>
      <div>
        <p className="text-gray-700 font-semibold">Categories: 
          <span className="text-blue-500"> fruits & vegetables</span>
          <span className="text-blue-500"> fruits</span>
        </p>
        <p className="text-gray-700 font-semibold">Seller: 
          <span className="text-green-500"> Grocery Shop</span>
        </p>
      </div>
    </div>
  </div>
);

const FarmMarketplace = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="bg-white min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-4">Get Your Farm Items</h1>
      <p className="text-center text-gray-600 mb-8">
        Get your healthy foods & farm items delivered at your doorsteps all day everyday
      </p>
      <SearchBar />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} onProductClick={setSelectedProduct} />
        ))}
      </div>
      {selectedProduct && (
        <ProductPopup product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
};

export default FarmMarketplace;