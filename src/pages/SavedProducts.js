import React, { useState } from 'react';
import { Heart, Search, Star, X } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '..//components/ui/Card2';

// Mock saved products data
const initialSavedProducts = [
  { id: 1, name: 'Potatoes', price: 1.60, oldPrice: 2.00, discount: '20%', image: '/api/placeholder/400/320', unit: '1lb', rating: 4.67, isSaved: true },
  { id: 2, name: 'Compact Tractor', price: 15000, oldPrice: 18000, discount: '17%', image: '/api/placeholder/400/320', category: 'Tractors', rating: 4.8, isSaved: true },
];

// Updated Product Card Component with Save functionality
export const ProductCard = ({ product, onProductClick, onToggleSave, isSaved }) => (
  <div className="bg-white p-4 rounded-lg shadow-md transition-transform hover:scale-105">
    <div className="relative mb-4">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-48 object-cover rounded cursor-pointer" 
        onClick={() => onProductClick(product)}
      />
      {product.discount && (
        <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm">
          {product.discount}
        </span>
      )}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onToggleSave(product);
        }}
        className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-50"
      >
        <Heart 
          className={`w-5 h-5 ${isSaved ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
        />
      </button>
    </div>
    <h3 className="font-semibold text-lg cursor-pointer" onClick={() => onProductClick(product)}>
      {product.name}
    </h3>
    <p className="text-gray-500">{product.unit || product.category}</p>
    <div className="flex justify-between items-center mt-2">
      <div>
        <span className="text-green-600 font-bold">${product.price.toLocaleString()}</span>
        {product.oldPrice && (
          <span className="text-gray-400 line-through ml-2">${product.oldPrice.toLocaleString()}</span>
        )}
      </div>
      <div className="flex items-center">
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
        <span>{product.rating}</span>
      </div>
    </div>
  </div>
);

// Saved Products Page Component
const SavedProductsPage = () => {
  const [savedProducts, setSavedProducts] = useState(initialSavedProducts);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRemoveSaved = (productId) => {
    setSavedProducts(savedProducts.filter(product => product.id !== productId));
  };

  const filteredProducts = savedProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-7xl mx-auto bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-green-800">My Saved Products</CardTitle>
          <p className="text-gray-600 mt-2">Keep track of your favorite agricultural products and equipment</p>
        </CardHeader>
        
        {/* Search Bar */}
        <div className="relative w-full max-w-2xl mx-auto px-6 mb-8">
          <input
            type="text"
            placeholder="Search in saved products..."
            className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Saved Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="relative">
                <ProductCard
                  product={product}
                  onProductClick={() => {}}
                  onToggleSave={() => handleRemoveSaved(product.id)}
                  isSaved={true}
                />
                <button
                  onClick={() => handleRemoveSaved(product.id)}
                  className="absolute -top-2 -right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No saved products yet</h3>
            <p className="text-gray-500">Start saving products by clicking the heart icon on products you like</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SavedProductsPage;