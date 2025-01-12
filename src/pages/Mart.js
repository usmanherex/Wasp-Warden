import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Heart,
  Star,
  MessageCircle,
  DollarSign,
  Minus,
  Plus,
  X,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

const sampleReviews = [
  {
    id: 1,
    user: "John Doe",
    rating: 5,
    date: "2024-03-15",
    comment: "Really fresh and high quality! Will buy again.",
    helpful: 12,
    notHelpful: 2,
    verified: true,
  },
  {
    id: 2,
    user: "Sarah Smith",
    rating: 4,
    date: "2024-03-10",
    comment: "Good quality but slightly expensive.",
    helpful: 8,
    notHelpful: 1,
    verified: true,
  },
  {
    id: 3,
    user: "Mike Johnson",
    rating: 5,
    date: "2024-03-05",
    comment: "Excellent product and fast delivery!",
    helpful: 15,
    notHelpful: 0,
    verified: false,
  },
  {
    id: 4,
    user: "Mike Johnson",
    rating: 5,
    date: "2024-03-05",
    comment: "Excellent product and fast delivery!",
    helpful: 15,
    notHelpful: 0,
    verified: false,
  },
  {
    id: 5,
    user: "Mike Johnson",
    rating: 5,
    date: "2024-03-05",
    comment: "Excellent product and fast delivery!",
    helpful: 15,
    notHelpful: 0,
    verified: false,
  },
  {
    id: 6,
    user: "Mike Johnson",
    rating: 5,
    date: "2024-03-05",
    comment: "Excellent product and fast delivery!",
    helpful: 15,
    notHelpful: 0,
    verified: false,
  },
  {
    id: 7,
    user: "Mike Johnson",
    rating: 5,
    date: "2024-03-05",
    comment: "Excellent product and fast delivery!",
    helpful: 15,
    notHelpful: 0,
    verified: false,
  },
];


const ReviewStars = ({ rating, size = "small", onClick = null }) => (
  <div className="flex">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`${size === "small" ? "w-4 h-4" : "w-6 h-6"} ${
          star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        } ${onClick ? "cursor-pointer" : ""}`}
        onClick={() => onClick?.(star)}
      />
    ))}
  </div>
);

const ProductPopup = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(product.minimumBulkAmount);
  const [activeTab, setActiveTab] = useState("description");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const popupRef = useRef(null);
  const reviewFormRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        // Only close if we're not clicking inside the review form
        if (
          !showReviewForm ||
          (reviewFormRef.current &&
            !reviewFormRef.current.contains(event.target))
        ) {
          onClose();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, showReviewForm]);

  // Quantity control functions remain the same...
  const incrementQuantity = () => {
    if (quantity < product.quantityAvailable) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > product.minimumBulkAmount) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      if (
        value <= product.quantityAvailable &&
        value >= product.minimumBulkAmount
      ) {
        setQuantity(value);
      }
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    // Here you would typically submit the review to your backend
    setShowReviewForm(false);
    setNewReview({ rating: 5, comment: "" });
  };

  const handleReviewClick = (e) => {
    e.stopPropagation(); // Prevent click from reaching the background
    setShowReviewForm(true);
  };

  const handleReviewFormClick = (e) => {
    e.stopPropagation(); // Prevent click from reaching the background
  };

  // Price calculations remain the same...
  const originalPrice = product.itemPrice;
  const salePrice =
    product.salePercentage > 0
      ? originalPrice * (1 - product.salePercentage / 100)
      : originalPrice;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div
          ref={popupRef}
          className="bg-white rounded-3xl w-full max-w-6xl shadow-2xl relative"
          onClick={(e) => e.stopPropagation()} // Prevent clicks from reaching the background
        >
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Left Column - Image Section */}
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src={`data:image/jpeg;base64,${product.itemImage}`}
                  alt={product.itemName}
                  className="w-full h-[500px] object-cover"
                />
                {product.salePercentage > 0 && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full font-medium">
                    {product.salePercentage}% OFF
                  </div>
                )}
                <button
                  className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                  <div className="flex items-center">
                    <ReviewStars rating={product.itemRating || 0} />
                    <span className="ml-2 text-sm text-gray-600">
                      ({product.itemRating || "No ratings"})
                    </span>
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {product.itemName}
                </h2>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-4xl font-bold text-green-600">
                    ${salePrice.toFixed(2)}
                  </span>
                  {product.salePercentage > 0 && (
                    <span className="text-xl text-gray-400 line-through">
                      ${originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-gray-500">
                    per {product.metricSystem}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b sticky top-0 bg-white pt-2">
                <div className="flex space-x-8">
                  {["description", "reviews"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 font-medium transition-colors ${
                        activeTab === tab
                          ? "border-b-2 border-green-500 text-green-500"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              {/* Tab Content */}
              <div className="min-h-[200px]">
                {activeTab === "description" ? (
                  <div className="space-y-6">
                    <p className="text-gray-600 leading-relaxed">
                      {product.itemDescription}
                    </p>

                    {/* Quantity Selector */}
                    <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>
                          Minimum: {product.minimumBulkAmount}{" "}
                          {product.metricSystem}
                        </span>
                        <span>
                          Available: {product.quantityAvailable}{" "}
                          {product.metricSystem}
                        </span>
                      </div>
                      {user.userType !== "Farmer" && (
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={decrementQuantity}
                          disabled={quantity <= product.minimumBulkAmount}
                          className="p-2 rounded-lg bg-white border hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={handleQuantityChange}
                          className="w-20 text-center border rounded-lg p-2"
                          min={product.minimumBulkAmount}
                          max={product.quantityAvailable}
                        />
                        <button
                          onClick={incrementQuantity}
                          disabled={quantity >= product.quantityAvailable}
                          className="p-2 rounded-lg bg-white border hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
 )}
                    </div>
                    
                    {/* Action Buttons */}
                    {user.userType !== "Farmer" && (
                    <div className="space-y-3">
           
                      <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors">
                        Add to Cart ({quantity} {product.metricSystem})
                      </button>
             
                      <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 border-2 border-green-500 text-green-500 hover:bg-green-50 py-3 rounded-xl font-medium transition-colors">
                          <DollarSign className="w-5 h-5" />
                          Negotiate
                        </button>
                        <button className="flex items-center justify-center gap-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-50 py-3 rounded-xl font-medium transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          Message
                        </button>
                      </div>
                    </div>
                           )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Reviews Summary */}
                    <div className="bg-gray-50 p-6 rounded-xl flex items-start gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-600">
                          4.8
                        </div>
                        <ReviewStars rating={4.8} size="large" />
                        <div className="text-sm text-gray-500 mt-1">
                          128 reviews
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-2">
                            <span className="text-sm w-3">{rating}</span>
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <div className="flex-1 h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-full bg-yellow-400 rounded-full"
                                style={{ width: `${Math.random() * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
              
                    {/* Write Review Button */}
                    {user.userType !== "Farmer" && (
                      <button
                        onClick={handleReviewClick}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors"
                      >
                        Write a Review
                      </button>
                    )}

                    {/* Review List */}
                    <div className="space-y-6">
                      {[1, 2, 3, 4, 5, 6, 7].map((review) => (
                        <div key={review} className="border-b pb-6">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">John Doe</span>
                                <span className="text-green-500 text-sm">
                                  Verified Purchase
                                </span>
                              </div>
                              <ReviewStars rating={5} />
                            </div>
                            <span className="text-sm text-gray-500">
                              2 days ago
                            </span>
                          </div>
                          <p className="text-gray-600 my-2">
                            Great product! Really fresh and high quality.
                          </p>
                          <div className="flex gap-4 text-sm text-gray-500">
                            <button className="flex items-center gap-1 hover:text-green-500">
                              <ThumbsUp className="w-4 h-4" />
                              Helpful (12)
                            </button>
                            <button className="flex items-center gap-1 hover:text-red-500">
                              <ThumbsDown className="w-4 h-4" />
                              Not Helpful (2)
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Review Form Modal */}
        {showReviewForm && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]"
            onClick={() => setShowReviewForm(false)}
          >
            <div
              ref={reviewFormRef}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={handleReviewFormClick}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Write a Review</h3>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
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
                    onClick={(rating) =>
                      setNewReview((prev) => ({ ...prev, rating }))
                    }
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
                    onChange={(e) =>
                      setNewReview((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const SearchBar = ({ searchQuery, onSearchChange }) => (
  <div className="relative w-full max-w-2xl mx-auto mt-8 mb-12">
    <input
      type="text"
      value={searchQuery}
      onChange={onSearchChange}
      placeholder="Search your products from here"
      className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
    />
    <button className="absolute right-0 top-0 h-full px-4 bg-green-400 text-white rounded-r-lg">
      <Search className="w-6 h-6" />
    </button>
  </div>
);
const FarmMarketplace = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [savedProducts, setSavedProducts] = useState(new Set());
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/farmer/products");
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
          setFilteredProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
    if (user) {
      fetchSavedProducts();
    }
  }, []);


    const fetchSavedProducts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/savedproducts/${user.userId}`);
        const data = await response.json();
        if (data.success) {
          const savedSet = new Set(data.savedProducts.map(product => product.id));
          setSavedProducts(savedSet);
        } else {
          console.error("Failed to fetch saved products:", data.message);
        }
      } catch (err) {
        console.error("Error fetching saved products:", err);
      }
    };
  // Handle search
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.itemName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  // Toggle save product
  const toggleSaveProduct = async (productId) => {
    if (!user) {
      // Handle unauthenticated user case
      alert("Please log in to save products");
      return;
    }

    try {
      if (savedProducts.has(productId)) {
        // Remove from saved products
        const response = await fetch(`http://localhost:5000/savedproducts/${user.userId}/${productId}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        
        if (data.success) {
          setSavedProducts(prev => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
          });
        } else {
          console.error("Failed to remove saved product:", data.message);
        }
      } else {
        // Add to saved products
        const response = await fetch('http://localhost:5000/savedproducts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            itemID: productId,
            userID: user.userId
          }),
        });
        const data = await response.json();
        
        if (data.success) {
          setSavedProducts(prev => {
            const newSet = new Set(prev);
            newSet.add(productId);
            return newSet;
          });
        } else {
          console.error("Failed to save product:", data.message);
        }
      }
    } catch (err) {
      console.error("Error toggling saved product:", err);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const ProductCard = ({ product, onProductClick }) => {
    const isSaved = savedProducts.has(product.id);
    const originalPrice = product.itemPrice;
    const salePrice =
      product.salePercentage > 0
        ? originalPrice * (1 - product.salePercentage / 100)
        : originalPrice;

    return (
      <div
        className="bg-white p-4 rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105"
        onClick={() => onProductClick(product)} // Move click handler to entire card
      >
        <div className="relative mb-4">
          <img
            src={`data:image/jpeg;base64,${product.itemImage}`}
            alt={product.itemName}
            className="w-full h-48 object-cover rounded"
          />
          {product.salePercentage > 0 && (
            <span className="absolute top-2 left-2 bg-green-400 text-white px-2 py-1 rounded-full text-sm">
              {product.salePercentage}% OFF
            </span>
          )}
          <button
          className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-50"
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveProduct(product.id);
          }}
        >
          <Heart
            className={`w-5 h-5 ${
              isSaved ? "text-red-500 fill-red-500" : "text-gray-400"
            }`}
          />
        </button>
        </div>
        <h3 className="font-semibold">{product.itemName}</h3>
        <p className="text-gray-500">{product.metricSystem}</p>
        <div className="flex justify-between items-center mt-2">
          <div className="flex flex-col">
            <span className="text-green-600 font-bold">
              ${salePrice.toFixed(2)}
            </span>
            {product.salePercentage > 0 && (
              <span className="text-gray-400 line-through text-sm">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-4">
        Get Your Farm Items
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Get your healthy foods & farm items delivered at your doorsteps all day
        everyday
      </p>
      <SearchBar searchQuery={searchQuery} onSearchChange={handleInputChange} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={setSelectedProduct}
          />
        ))}
      </div>
      {selectedProduct && (
        <ProductPopup
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default FarmMarketplace;
