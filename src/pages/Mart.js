import React, { useState } from 'react';
import { Search, Heart, Star, MessageCircle, DollarSign, Minus, Plus, X ,ThumbsUp,ThumbsDown} from 'lucide-react';

import Image1 from '../assets/images/potato.jpg';
import Image2 from '../assets/images/strawberry.jpeg';
import Image3 from '../assets/images/tomato.jpeg';
import Image4 from '../assets/images/rice.jpg';
import Image5 from '../assets/images/sugarcane.jpeg';

const products = [
  { id: 1, name: 'Potatoes', price: 1.60, oldPrice: 2.00, discount: '20%', image: Image1, unit: '1lb', rating: 4.67, description: 'An apple is a sweet, edible fruit produced by an apple tree (Malus domestica). Apple trees are ... The skin of ripe apples is generally red, green, g...' },
  { id: 2, name: 'Strawberries', price: 0.60, oldPrice: null, discount: null, image: Image2, unit: '1kg' },
  { id: 3, name: 'Basmati Rice', price: 3.00, oldPrice: 5.00, discount: '40%', image: Image4, unit: '1kg' },
  { id: 4, name: 'Sugarcane', price: 3.00, oldPrice: null, discount: null, image: Image5, unit: '1lb' },
  { id: 4, name: 'Tomatoes', price: 4.00, oldPrice: null, discount: null, image: Image3, unit: '1lb' },
  { id: 3, name: 'Basmati Rice', price: 3.00, oldPrice: 5.00, discount: '40%', image: Image4, unit: '1kg' },
  { id: 4, name: 'Sugarcane', price: 3.00, oldPrice: null, discount: null, image: Image5, unit: '1lb' },
  { id: 2, name: 'Strawberries', price: 0.60, oldPrice: null, discount: null, image: Image2, unit: '1kg' },
];

const sampleReviews = [
  { id: 1, user: "John Doe", rating: 5, date: "2024-03-15", comment: "Really fresh and high quality! Will buy again.", helpful: 12, notHelpful: 2, verified: true },
  { id: 2, user: "Sarah Smith", rating: 4, date: "2024-03-10", comment: "Good quality but slightly expensive.", helpful: 8, notHelpful: 1, verified: true },
  { id: 3, user: "Mike Johnson", rating: 5, date: "2024-03-05", comment: "Excellent product and fast delivery!", helpful: 15, notHelpful: 0, verified: false }
];


const ReviewStars = ({ rating, size = "small", onClick = null }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size === "small" ? "w-4 h-4" : "w-5 h-5"} ${
            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          } ${onClick ? "cursor-pointer" : ""}`}
          onClick={() => onClick && onClick(star)}
        />
      ))}
    </div>
  );
};

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
const isSaved=0; // make the state for the saveProducts
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

const ProductPopup = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [showNegotiationPopup, setShowNegotiationPopup] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  const handleSubmitReview = (e) => {
    e.preventDefault();
    // Here you would typically submit the review to your backend
    setShowReviewForm(false);
    setNewReview({ rating: 5, comment: "" });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>

        {/* Product Details Section */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Left Column - Image */}
          <div className="md:w-1/2">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>

          {/* Right Column - Product Details */}
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <p className="text-gray-500 mb-4">{product.unit}</p>

            <div className="flex items-center gap-2 mb-4">
              {product.discount && (
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                  {product.discount} OFF
                </span>
              )}
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm flex items-center">
                <Star className="w-4 h-4 mr-1" fill="currentColor" />
                {product.rating || '0.0'}
              </span>
              <span className=" text-yellow-700 px-3 py-1 rounded-full text-sm flex items-center">
       
        <Heart 
          className={`w-5 h-5 ${isSaved ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
        />
     
              </span>
            
            </div>

            <p className="text-gray-700 mb-4">{product.description}</p>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-bold text-green-600">
                ${product.price.toFixed(2)}
              </span>
              {product.oldPrice && (
                <span className="text-gray-400 line-through">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-600">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button 
                  onClick={decrementQuantity}
                  className="p-2 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button 
                  onClick={incrementQuantity}
                  className="p-2 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button 
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
              >
                Add to Cart ({quantity})
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  className="flex items-center justify-center gap-2 border border-green-500 text-green-500 hover:bg-green-50 py-3 rounded-lg"
                  onClick={() => setShowNegotiationPopup(true)}
                >
                  <DollarSign className="w-4 h-4" />
                  Negotiate Price
                </button>
                
                <button 
                  className="flex items-center justify-center gap-2 border border-blue-500 text-blue-500 hover:bg-blue-50 py-3 rounded-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  Message Farmer
                </button>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p>Available Stock: 18 pieces</p>
              <p>Categories: <span className="text-blue-500">fruits & vegetables, fruits</span></p>
              <p>Seller: <span className="text-green-500">Grocery Shop</span></p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t pt-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Customer Reviews</h3>
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Write a Review
            </button>
          </div>

          {/* Review Statistics */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">4.7</div>
                <ReviewStars rating={4.7} size="large" />
                <div className="text-gray-500 text-sm mt-1">Based on {sampleReviews.length} reviews</div>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-sm w-3">{stars}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400"
                        style={{ width: `${stars * 20}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">({Math.floor(Math.random() * 50)})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {sampleReviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{review.user}</span>
                      {review.verified && (
                        <span className="text-green-500 text-sm">Verified Purchase</span>
                      )}
                    </div>
                    <ReviewStars rating={review.rating} />
                  </div>
                  <span className="text-gray-500 text-sm">{review.date}</span>
                </div>
                <p className="text-gray-700 my-2">{review.comment}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <button className="flex items-center gap-1 hover:text-green-500">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({review.helpful})
                  </button>
                  <button className="flex items-center gap-1 hover:text-red-500">
                    <ThumbsDown className="w-4 h-4" />
                    Not Helpful ({review.notHelpful})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Review Form Popup */}
        {showReviewForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[70]">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Write a Review</h3>
                <button 
                  onClick={() => setShowReviewForm(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <ReviewStars 
                    rating={newReview.rating} 
                    size="large"
                    onClick={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Review
                  </label>
                  <textarea 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-32 resize-none"
                    placeholder="Share your experience with this product..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Negotiation Popup */}
        {showNegotiationPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Negotiate Price</h3>
                <button 
                  onClick={() => setShowNegotiationPopup(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Offer Price (per {product.unit})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input 
                      type="number" 
                      className="w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your price"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter quantity"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes (Optional)
                  </label>
                  <textarea 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-24 resize-none"
                    placeholder="Any additional details or requirements..."
                  />
                </div>

                <button 
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg"
                >
                  Submit Negotiation Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


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