import React, { useState, useEffect, useRef } from "react";
import { useParams,useNavigate  } from "react-router-dom";
import {
  Search,
  Star,
  Heart,
  MessageCircle,
  DollarSign,
  X,
  Filter,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Plus,
  Edit2,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card2";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/AlertDialog";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
// Constants for filter options
const machineTypes = [
  "Tractor",
  "Harvester",
  "Seeder",
  "Sprayer",
  "Irrigation System",
  "Plough",
  "Other",
];
const powerSources = [
  "Diesel",
  "Petrol",
  "Electric",
  "Manual",
  "Hybrid",
  "Solar",
  "Other",
];
const chemicalTypes = [
  "Pesticide",
  "Herbicide",
  "Fertilizer",
  "Fungicide",
  "Insecticide",
  "Growth Regulator",
  "Other",
];
const metrics = [
  "Liters (L)",
  "Milliliters (mL)",
  "Kilograms (kg)",
  "Grams (g)",
  "Pounds (lb)",
];
const hazardLevels = ["Low", "Medium", "High", "Very High", "Extreme"];
const ProductPopup = ({ product, onClose, onProductUpdate }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userType = user.userType;
  const popupRef = useRef(null);
  const reviewFormRef = useRef(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const originalPrice = product.price;
  const [activeTab, setActiveTab] = useState("description");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const navigate = useNavigate();
  const handleStartChat = async () => {
    try {
      const response = await fetch('http://localhost:5000/start-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user1Id: user.userId,
          user2Id: parseInt(product.ownerId)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to initialize chat');
      }

      const data = await response.json();
      // Navigate to inbox with the chat ID
      navigate(`/inbox`);
    } catch (error) {
      console.error('Error starting chat:', error);
      // Handle error appropriately
    }
  };
  const salePrice =
    product.salePercentage > 0
      ? originalPrice * (1 - product.salePercentage / 100)
      : originalPrice;

  const incrementQuantity = () => {
    if (quantity < product.quantityAvailable) {
      setQuantity((prev) => prev + 1);
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
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      if (value <= product.quantityAvailable && value >= 1) {
        setQuantity(value);
      }
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        // Don't close if any modal is open
        const isReviewFormOpen =
          showReviewForm &&
          reviewFormRef.current &&
          reviewFormRef.current.contains(event.target);

        // Check if clicking on delete dialog
        const deleteDialog = document.querySelector('[role="dialog"]');
        const isClickingDeleteDialog = deleteDialog?.contains(event.target);

        // Only close if we're not interacting with any modal
        if (!isReviewFormOpen && !isClickingDeleteDialog && !showDeleteDialog) {
          onClose();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, showReviewForm, showDeleteDialog]);

    const handleAddToCart = async () => {
      if (isAddingToCart) return;
  
      setIsAddingToCart(true);
      try {
          const cartData = {
              userID: user.userId,
              itemID: product.itemId,
              ownerName: `${product.businessInfo.agriBusinessName}`,
              quantity: quantity,
              price: product.salePercentage > 0
                  ? product.price * (1 - product.salePercentage / 100)
                  : product.price,
          };
  
          const response = await fetch("http://localhost:5000/cart/add", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(cartData),
          });
  
          const data = await response.json();
  
          if (data.success) {
              toast.success("Item added to cart successfully", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
              });
              onClose();
          } else {
              // Handle the error message from the database
              toast.error(data.error || "Failed to add item to cart", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
              });
          }
      } catch (error) {
          // Handle network or other errors
          toast.error(error.message || "Failed to add item to cart", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
          });
      } finally {
          setIsAddingToCart(false);
      }
  };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div
          ref={popupRef}
          className="bg-white rounded-3xl w-full max-w-6xl shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src={`data:image/jpeg;base64,${product.image}`}
                  alt={product.title}
                  className="w-full h-[500px] object-cover"
                />
                <button
                  className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">
                    {product.productType}
                  </span>
                  <div className="flex items-center">
                    <ReviewStars rating={product.rating || 0} />
                    <span className="ml-2 text-sm text-gray-600">
                      ({product.rating || "No ratings"})
                    </span>
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {product.title}
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
                </div>
              </div>

              {/* Tabs Section */}
              <div className="border-b">
                <div className="flex space-x-8">
                  {["description", "specifications", "seller", "reviews"].map(
                    (tab) => (
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
                    )
                  )}
                </div>
              </div>

              {/* Tab Content */}
              <div className="min-h-[200px]">
                {activeTab === "description" && (
                  <div className="space-y-6">
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Quantity Selector */}
                    <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>
                          Minimum: 1 
                        </span>
                        <span>
                          Available: {product.quantityAvailable}
                        </span>
                      </div>
                      {user.userType !== "Agri-business" && (
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={decrementQuantity}
                            disabled={quantity <= 1}
                            className="p-2 rounded-lg bg-white border hover:bg-gray-50 disabled:opacity-50"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <input
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            className="w-20 text-center border rounded-lg p-2"
                            min={1}
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
                    {userType !== "Agri-business"&& (
                      <div className="space-y-3">
                       <button
                          className={`w-full ${
                            isAddingToCart
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-500 hover:bg-green-600"
                          } text-white py-3 rounded-xl font-medium transition-colors`}
                          onClick={handleAddToCart}
                          disabled={isAddingToCart}
                        >
                          {isAddingToCart ? (
                            <span className="flex items-center justify-center">
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Adding to Cart...
                            </span>
                          ) : (
                            `Add to Cart (${quantity})`
                          )}
                        </button>

                  <button onClick={handleStartChat} className="w-full flex items-center justify-center gap-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-50 py-3 rounded-xl font-medium transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    Message Seller
                  </button>

                        
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "specifications" && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Technical Specifications
                      </h3>

                      {product.productType === "Machine" ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded-lg">
                            <h4 className="font-medium text-gray-700 mb-2">
                              Machine Details
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Type:</span>
                                <span className="font-medium">
                                  {product.machineType}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Power Source:
                                </span>
                                <span className="font-medium">
                                  {product.powerSource}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Weight:</span>
                                <span className="font-medium">
                                  {product.machineWeight}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-lg">
                            <h4 className="font-medium text-gray-700 mb-2">
                              Additional Info
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Warranty:</span>
                                <span className="font-medium">
                                  {product.warranty}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Stock:</span>
                                <span className="font-medium">
                                  {product.quantityAvailable} units
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Condition:
                                </span>
                                <span className="font-medium">
                                  {product.condition || "New"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded-lg">
                            <h4 className="font-medium text-gray-700 mb-2">
                              Chemical Details
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Type:</span>
                                <span className="font-medium">
                                  {product.chemicalType}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Quantity:</span>
                                <span className="font-medium">
                                  {product.quantity} {product.metricSystem}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Hazard Level:
                                </span>
                                <span className="font-medium text-red-500">
                                  {product.hazardLevel}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-lg">
                            <h4 className="font-medium text-gray-700 mb-2">
                              Storage & Safety
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Expiry Date:
                                </span>
                                <span className="font-medium">
                                  {new Date(
                                    product.expiryDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Stock:</span>
                                <span className="font-medium">
                                  {product.quantityAvailable} units
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Common Specifications */}
                    </div>
                  </div>
                )}
                {activeTab === "seller" && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-green-600">
                            {product.businessInfo?.agriBusinessName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {product.businessInfo?.agriBusinessName}
                          </h3>
                          <p className="text-gray-600">
                            {product.businessInfo?.businessType}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-700">
                            Contact Information
                          </h4>
                          <p className="text-gray-600">
                            <span className="font-medium">Email:</span>
                            <br />
                            {product.businessInfo?.email}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Phone:</span>
                            <br />
                            {product.businessInfo?.phoneNumber}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-700">
                            Business Details
                          </h4>
                          <p className="text-gray-600">
                            <span className="font-medium">Owner:</span>
                            <br />
                            {product.businessInfo?.ownerName}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Type:</span>
                            <br />
                            {product.businessInfo?.businessType}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <ReviewsTab
                    product={product}
                    user={user}
                    showDeleteDialog={showDeleteDialog}
                    setShowDeleteDialog={setShowDeleteDialog}
                    onReviewsUpdate={onProductUpdate}
                  />
                )}
              </div>

              
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
  );
};
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

const ReviewForm = ({
  initialReview = { rating: 5, comment: "" },
  onSubmit,
  onClose,
  isEdit = false,
}) => {
  const [review, setReview] = useState(initialReview);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(review);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {isEdit ? "Edit Review" : "Write a Review"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <ReviewStars
              rating={review.rating}
              size="large"
              onClick={(rating) => setReview((prev) => ({ ...prev, rating }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Review
            </label>
            <textarea
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-32 resize-none"
              placeholder="Share your experience with this product..."
              value={review.comment}
              onChange={(e) =>
                setReview((prev) => ({
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
            {isEdit ? "Update Review" : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};
const ReviewsTab = ({
  product,
  user,
  showDeleteDialog,
  setShowDeleteDialog,
  onReviewsUpdate,
}) => {
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [userReactions, setUserReactions] = useState({});
  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [product.itemId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/products/${product.itemId}/reviews`
      );
      const data = await response.json();
      if (data.success) {
        setReviews(data.data.reviews);
        setReviewSummary(data.data.summary);
        onReviewsUpdate();
      }
    } catch (error) {
  
       toast.error("Failed to load reviews", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
              });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/products/${product.itemId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.userId,
            rating: reviewData.rating,
            comment: reviewData.comment,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
 
         toast.success("Review submitted successfully", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
        await fetchReviews();
      }
    } catch (error) {
      
       toast.error("Failed to submit review", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
              });
    }
  };

  const handleEditReview = async (reviewData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/products/reviews/${editingReview.reviewId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.userId,
            rating: reviewData.rating,
            comment: reviewData.comment,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
       
         toast.success("Review updated successfully", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
        await fetchReviews();
      }
    } catch (error) {
     
       toast.error("Failed to update review", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
              });
    }
  };

  const handleDeleteReview = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/products/reviews/${deletingReviewId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.userId,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
     
         toast.success("Review deleted Successfully", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
        await fetchReviews();
        setShowDeleteDialog(false);
        setDeletingReviewId(null);
      }
    } catch (error) {
    
       toast.error("Failed to delete review", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
              });
    } finally {
      setShowDeleteDialog(false);
      setDeletingReviewId(null);
    }
  };

  const startDeleteReview = (reviewId, e) => {
    // Prevent event propagation
    e.preventDefault();
    e.stopPropagation();
    setDeletingReviewId(reviewId);
    setShowDeleteDialog(true);
  };

  const handleReaction = async (reviewId, reactionType, isAdd) => {
    try {
      const response = await fetch(
        `http://localhost:5000/products/reviews/${reviewId}/reaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reviewId,
            userId: user.userId,
            type: reactionType,
            isAdd,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        // Update local state to reflect the change
        setReviews(
          reviews.map((review) => {
            if (review.reviewId === reviewId) {
              return {
                ...review,
                likes:
                  reactionType === "like"
                    ? review.likes + (isAdd ? 1 : -1)
                    : review.likes,
                dislikes:
                  reactionType === "dislike"
                    ? review.dislikes + (isAdd ? 1 : -1)
                    : review.dislikes,
              };
            }
            return review;
          })
        );

        // Update user reactions state
        setUserReactions((prev) => ({
          ...prev,
          [reviewId]: {
            ...prev[reviewId],
            [reactionType]: isAdd,
          },
        }));

   
         toast.success("Reaction updated Successfully", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
      }
    } catch (error) {
    
       toast.error("Failed to update reaction", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
              });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="bg-gray-50 p-6 rounded-xl flex items-start gap-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-green-600">
            {product.rating?.toFixed(1) || "N/A"}
          </div>
          <ReviewStars rating={product.rating || 0} size="large" />
          <div className="text-sm text-gray-500 mt-1">
            {reviewSummary?.totalReviews || 0} reviews
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
                  style={{
                    width: `${
                      reviewSummary
                        ? rating === 5
                          ? (reviewSummary.fiveStars /
                              reviewSummary.totalReviews) *
                            100
                          : rating === 4
                          ? (reviewSummary.fourStars /
                              reviewSummary.totalReviews) *
                            100
                          : rating === 3
                          ? (reviewSummary.threeStars /
                              reviewSummary.totalReviews) *
                            100
                          : rating === 2
                          ? (reviewSummary.twoStars /
                              reviewSummary.totalReviews) *
                            100
                          : (reviewSummary.oneStar /
                              reviewSummary.totalReviews) *
                            100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Button */}
      {user.userType !== "Agri-business" && (
        <button
          onClick={() => setShowReviewForm(true)}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors"
        >
          Write a Review
        </button>
      )}

      {/* Review List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.reviewId} className="border-b pb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{review.userInfo.name}</span>
                </div>
                <ReviewStars rating={review.rating} />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {new Date(review.timestamp).toLocaleDateString()}
                </span>
                {user.userId === review.userId && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingReview(review)}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={(e) => startDeleteReview(review.reviewId, e)}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <p className="text-gray-600 my-2">{review.comment}</p>
            <div className="flex gap-4 text-sm text-gray-500">
              <button
                onClick={() =>
                  handleReaction(
                    review.reviewId,
                    "like",
                    !userReactions[review.reviewId]?.like
                  )
                }
                className={`flex items-center gap-1 transition-colors ${
                  userReactions[review.reviewId]?.like
                    ? "text-green-500"
                    : "hover:text-green-500"
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                Helpful ({review.likes})
              </button>
              <button
                onClick={() =>
                  handleReaction(
                    review.reviewId,
                    "dislike",
                    !userReactions[review.reviewId]?.dislike
                  )
                }
                className={`flex items-center gap-1 transition-colors ${
                  userReactions[review.reviewId]?.dislike
                    ? "text-red-500"
                    : "hover:text-red-500"
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                Not Helpful ({review.dislikes})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          onSubmit={handleSubmitReview}
          onClose={() => setShowReviewForm(false)}
        />
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <ReviewForm
          initialReview={{
            rating: editingReview.rating,
            comment: editingReview.comment,
          }}
          onSubmit={handleEditReview}
          onClose={() => setEditingReview(null)}
          isEdit={true}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingReviewId(null);
          }
          setShowDeleteDialog(open);
        }}
      >
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowDeleteDialog(false);
                setDeletingReviewId(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 mt-2 inline-flex h-10 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold sm:mt-0"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDeleteReview();
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
const AgriEquipmentMarketplace = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedProducts, setSavedProducts] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    productType: "",
    machineType: "",
    powerSource: "",
    chemicalType: "",
    metricSystem: "",
    hazardLevel: "",
  });

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    fetchProducts();
    if (user) {
      fetchSavedProducts();
    }
  }, []);
  const fetchSavedProducts = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/savedproducts/${user.userId}`
      );
      const data = await response.json();
      if (data.success) {
        const savedSet = new Set(
          data.savedProducts.map((product) => product.id)
        );
        setSavedProducts(savedSet);
      } else {
        console.error("Failed to fetch saved products:", data.message);
      }
    } catch (err) {
      console.error("Error fetching saved products:", err);
    }
  };
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/agribusiness/products"
      );
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
        if (selectedProduct) {
          const updatedProduct = data.products.find(p => p.itemId=== selectedProduct.itemId);
          if (updatedProduct) {
            setSelectedProduct(updatedProduct);
          }
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveProduct = async (productId) => {
    if (!user) {
      // Handle unauthenticated user case
      alert("Please log in to save products");
      return;
    }

    try {
      if (savedProducts.has(productId)) {
        // Remove from saved products
        const response = await fetch(
          `http://localhost:5000/savedproducts/${user.userId}/${productId}`,
          {
            method: "DELETE",
          }
        );
        const data = await response.json();

        if (data.success) {
          setSavedProducts((prev) => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
          });
           toast.success("Item Removed from Saved Products list", {
                      position: "top-right",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                  });
        } else {
          console.error("Failed to remove saved product:", data.message);
           toast.error("Failed to remove item from saved products list", {
                      position: "top-right",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                  });
        }
      } else {
        // Add to saved products
        const response = await fetch("http://localhost:5000/savedproducts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itemID: productId,
            userID: user.userId,
          }),
        });
        const data = await response.json();

        if (data.success) {
          setSavedProducts((prev) => {
            const newSet = new Set(prev);
            newSet.add(productId);
            return newSet;
          });
           toast.success("Item Added to Saved Products List Successfully", {
                      position: "top-right",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                  });
        } else {
          console.error("Failed to save product:", data.message);
           toast.error("Failed to add the item to saved products list", {
                      position: "top-right",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                  });
        }
      }
    } catch (err) {
      console.error("Error toggling saved product:", err);
       toast.error("Item cannot be added to saved products list", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
              });
    }
  };

  const filterProducts = () => {
    return products.filter((product) => {
      const searchMatch =
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const typeMatch =
        !filters.productType || product.productType === filters.productType;

      const machineMatch =
        product.productType !== "Machine" ||
        ((!filters.machineType ||
          product.machineType === filters.machineType) &&
          (!filters.powerSource ||
            product.powerSource === filters.powerSource));

      const chemicalMatch =
        product.productType !== "Chemical" ||
        ((!filters.chemicalType ||
          product.chemicalType === filters.chemicalType) &&
          (!filters.metricSystem ||
            product.metricSystem === filters.metricSystem) &&
          (!filters.hazardLevel ||
            product.hazardLevel === filters.hazardLevel));

      return searchMatch && typeMatch && machineMatch && chemicalMatch;
    });
  };

  const FilterSelect = ({ label, options, value, onChange }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  const ProductCard = ({ product }) => {
    const isSaved = savedProducts.has(product.itemId);
    const originalPrice = product.price;
    const salePrice =
      product.salePercentage > 0
        ? originalPrice * (1 - product.salePercentage / 100)
        : originalPrice;

    return (
      <div
        className="bg-white p-4 rounded-xl shadow-lg cursor-pointer transition-all hover:scale-105 hover:shadow-xl"
        onClick={() => setSelectedProduct(product)}
      >
        <div className="relative mb-4">
          <img
            src={`data:image/jpeg;base64,${product.image}`}
            alt={product.title}
            className="w-full h-48 object-cover rounded-lg"
          />
          {product.salePercentage > 0 && (
            <span className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {product.salePercentage}% OFF
            </span>
          )}
          <button
            className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-50"
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveProduct(product.itemId);
            }}
          >
            <Heart
              className={`w-5 h-5 ${
                isSaved ? "text-red-500 fill-red-500" : "text-gray-400"
              }`}
            />
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
              {product.productType}
            </span>
            <div className="flex items-center">
              <ReviewStars rating={product.rating || 0} />
            </div>
          </div>
          <h3 className="font-semibold text-lg">{product.itemName}</h3>
          {product.productType === "Machine" ? (
            <p className="text-sm text-gray-600">
              {product.machineType} • {product.powerSource}
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              {product.chemicalType} • {product.metricSystem}
            </p>
          )}
          <div className="flex justify-between items-center mt-2">
            <div className="flex flex-col">
              <span className="text-green-600 font-bold text-xl">
                ${salePrice.toFixed(2)}
              </span>
              {product.salePercentage > 0 && (
                <span className="text-gray-400 line-through text-sm">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {product.quantityAvailable} available
            </span>
          </div>
        </div>
      </div>
    );
  };

  const FiltersPanel = () => (
    <Card className="mb-8 border-0 shadow-lg rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
        <CardTitle className="text-xl font-bold">Refine Your Search</CardTitle>
        <button
          onClick={() => setShowFilters(false)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </CardHeader>
      <CardContent className="grid md:grid-cols-3 gap-6 pt-6">
        <div className="space-y-6">
          <h3 className="font-semibold text-gray-700">Product Type</h3>
          <div className="space-y-2">
            {["Machine", "Chemical"].map((type) => (
              <label
                key={type}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="productType"
                  value={type}
                  checked={filters.productType === type}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      productType: e.target.value,
                    }))
                  }
                  className="w-4 h-4 text-green-500 focus:ring-green-500"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {filters.productType === "Machine" && (
          <>
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-700">Machine Type</h3>
              <select
                value={filters.machineType}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    machineType: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="">All Types</option>
                {machineTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-6">
              <h3 className="font-semibold text-gray-700">Power Source</h3>
              <select
                value={filters.powerSource}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    powerSource: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="">All Sources</option>
                {powerSources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {filters.productType === "Chemical" && (
          <>
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-700">Chemical Type</h3>
              <select
                value={filters.chemicalType}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    chemicalType: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="">All Types</option>
                {chemicalTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-6">
              <h3 className="font-semibold text-gray-700">Hazard Level</h3>
              <select
                value={filters.hazardLevel}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    hazardLevel: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="">All Levels</option>
                {hazardLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">
          Agricultural Equipment Marketplace
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Find the best agricultural equipment and supplies for your farm
        </p>

        {/* Centered Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full p-4 pl-12 pr-4 rounded-full border-2 border-gray-200 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all text-lg"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white border-2 border-green-500 text-green-500 px-6 py-2 rounded-full hover:bg-green-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Advanced Filters</span>
            </button>
          </div>
        </div>

        {showFilters && <FiltersPanel />}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
              {error}
            </div>
          </div>
        ) : filterProducts().length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 text-gray-600 p-4 rounded-lg inline-block">
              No products found matching your criteria
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filterProducts().map((product) => (
              <ProductCard
                key={product.itemId}
                product={product}
                onProductClick={setSelectedProduct}
              />
            ))}
          </div>
        )}
        {selectedProduct && (
          <ProductPopup
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onProductUpdate={fetchProducts}
          />
        )}
      </div>
    </div>
  );
};

export default AgriEquipmentMarketplace;
