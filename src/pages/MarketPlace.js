import React, { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card2";
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
  const [activeTab, setActiveTab] = useState("description");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

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

  useEffect(() => {
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
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/agribusiness/products"
      );
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
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

  const filterProducts = () => {
    return products.filter((product) => {
      const searchMatch =
        product.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    const user = JSON.parse(localStorage.getItem("user"));
    const userType = user.userType;
    const popupRef = useRef(null);
    const reviewFormRef = useRef(null);
    const [quantity, setQuantity] = useState(1);
    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(5);
    const originalPrice = product.price;
    const salePrice =
      product.salePercentage > 0
        ? originalPrice * (1 - product.salePercentage / 100)
        : originalPrice;

    const incrementQuantity = () => {
      if (quantity < product.quantityAvailable) {
        setQuantity((prev) => prev + 1);
      }
    };
    const handleReviewClick = (e) => {
      e.stopPropagation(); // Prevent click from reaching the background
      setShowReviewForm(true);
    };
    const handleReviewSubmit = (e) => {
      e.preventDefault();
      setShowReviewForm(false);
      // Handle review submission here
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
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose, showReviewForm]);

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
        <div className="min-h-screen px-4 py-8 flex items-center justify-center">
          <div
            ref={popupRef}
            className="bg-white rounded-3xl w-full max-w-6xl shadow-2xl relative"
          >
            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-gray-100">
                  <img
                    src={`data:image/jpeg;base64,${product.image}`}
                    alt={product.itemName}
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
                      <ReviewStars rating={product.itemRating || 0} />
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    {product.itemName}
                  </h2>

                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-4xl font-bold text-green-600">
                      ${salePrice.toLocaleString()}
                    </span>
                    {product.salePercentage > 0 && (
                      <span className="text-xl text-gray-400 line-through">
                        ${originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Quantity Selector */}
                  {userType!=="Agri-business" && (
                  <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Minimum: 1 </span>
                      <span>Available: {product.quantityAvailable} </span>
                    </div>

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
                  </div>
                  )}
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
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                          Product Description
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {product.description}
                        </p>

                        {/* Key Features */}
                        <div className="mt-6">
                          <h4 className="font-medium text-gray-700 mb-3">
                            Key Features
                          </h4>
                          <ul className="space-y-2">
                            {product.productType === "Machine" ? (
                              <>
                                <li className="flex items-start space-x-2">
                                  <span className="text-green-500">•</span>
                                  <span className="text-gray-600">
                                    Machine Type: {product.machineType}
                                  </span>
                                </li>
                                <li className="flex items-start space-x-2">
                                  <span className="text-green-500">•</span>
                                  <span className="text-gray-600">
                                    Power Source: {product.powerSource}
                                  </span>
                                </li>
                                <li className="flex items-start space-x-2">
                                  <span className="text-green-500">•</span>
                                  <span className="text-gray-600">
                                    Warranty: {product.warranty}
                                  </span>
                                </li>
                              </>
                            ) : (
                              <>
                                <li className="flex items-start space-x-2">
                                  <span className="text-green-500">•</span>
                                  <span className="text-gray-600">
                                    Chemical Type: {product.chemicalType}
                                  </span>
                                </li>
                                <li className="flex items-start space-x-2">
                                  <span className="text-green-500">•</span>
                                  <span className="text-gray-600">
                                    Quantity per Unit: {product.quantity}{" "}
                                    {product.metricSystem}
                                  </span>
                                </li>
                                <li className="flex items-start space-x-2">
                                  <span className="text-green-500">•</span>
                                  <span className="text-gray-600">
                                    Safety Level: {product.hazardLevel}
                                  </span>
                                </li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
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
                                  <span className="text-gray-600">
                                    Warranty:
                                  </span>
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
                                  <span className="text-gray-600">
                                    Quantity:
                                  </span>
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
                            <div
                              key={rating}
                              className="flex items-center gap-2"
                            >
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
                     { userType!=="Agri-business" && (
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

                {/* Action Buttons */}
                {activeTab !== "reviews" && userType !== "Agri-business" && (
                  <div className="space-y-3">
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors">
                      Add to Cart ({quantity})
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-50 py-3 rounded-xl font-medium transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      Message Seller
                    </button>
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
              onClick={(e) => e.stopPropagation()}
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

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <ReviewStars
                    rating={reviewRating}
                    size="large"
                    onClick={(rating) => setReviewRating(rating)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Review
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-32 resize-none"
                    placeholder="Share your experience with this product..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
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
              <ProductCard key={product.itemId} product={product} />
            ))}
          </div>
        )}
        {selectedProduct && (
          <ProductPopup
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AgriEquipmentMarketplace;
