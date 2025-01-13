import React, { useState, useEffect, useRef } from "react";
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
import { toast } from "../components/ui/Toast";
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
  Edit2,
  Trash2,
} from "lucide-react";

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
  let productID;

  if (product.source === "farmer") {
    productID = product.id;
  } else {
    productID = product.itemId;
  }
  useEffect(() => {
    fetchReviews();
  }, [productID]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/products/${productID}/reviews`
      );
      const data = await response.json();
      if (data.success) {
        setReviews(data.data.reviews);
        setReviewSummary(data.data.summary);
        onReviewsUpdate();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/products/${productID}/reviews`,
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
        toast({
          title: "Success",
          description: "Review submitted successfully",
        });
        await fetchReviews();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
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
        toast({
          title: "Success",
          description: "Review updated successfully",
        });
        await fetchReviews();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update review",
        variant: "destructive",
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
        toast({
          title: "Success",
          description: "Review deleted successfully",
        });
        await fetchReviews();
        setShowDeleteDialog(false);
        setDeletingReviewId(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
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

        toast({
          title: "Success",
          description: "Reaction updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reaction",
        variant: "destructive",
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
            {product.source === "farmer"
              ? product.itemRating?.toFixed(1) ?? "N/A"
              : product.rating?.toFixed(1) ?? "N/A"}
          </div>
          <ReviewStars
            rating={
              product.source === "farmer"
                ? product.itemRating?.toFixed(1) ?? 0
                : product.rating?.toFixed(1) ?? 0
            }
            size="large"
          />
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
      {console.log(user.userType)}
      {console.log(product.source)}
     
     {(user.userType=='Farmer' && product.source!=='farmer') &&(
 <button
 onClick={() => setShowReviewForm(true)}
 className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors"
>
 Write a Review
</button>


     )}
        {(user.userType=='Agri-business' && product.source!=='agribusiness') &&(
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
const ProductPopup = ({ product, onClose, onProductUpdate }) => {
  const [quantity, setQuantity] = useState(product.minimumBulkAmount);
  const [activeTab, setActiveTab] = useState("description");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const popupRef = useRef(null);
  const reviewFormRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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
                  {["description", "seller", "reviews"].map((tab) => (
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
                ) : activeTab === "reviews" ? (
                  <ReviewsTab
                    product={product}
                    user={user}
                    showDeleteDialog={showDeleteDialog}
                    setShowDeleteDialog={setShowDeleteDialog}
                    onReviewsUpdate={onProductUpdate}
                  />
                ) : activeTab === "seller" ? (
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-green-600">
                            {product.ownerDetails.firstName?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {product.ownerDetails.firstName &&
                              product.ownerDetails.firstName}{" "}
                            {product.ownerDetails.lastName &&
                              product.ownerDetails.lastName}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>Invalid Tab</p>
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

const MarketplaceProductPopup = ({ product, onClose, onProductUpdate }) => {
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
const SavedProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [savedProducts, setSavedProducts] = useState(new Set());
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async (savedSet) => {
    try {
      setLoading(true);

      // Fetch both farmer and agribusiness products in parallel
      const [farmerResponse, agriResponse] = await Promise.all([
        fetch("http://localhost:5000/farmer/products"),
        fetch("http://localhost:5000/agribusiness/products"),
      ]);

      const farmerData = await farmerResponse.json();
      const agriData = await agriResponse.json();

      if (farmerData.success && agriData.success) {
        // Filter farmer products if savedSet is provided
        const farmerProducts = savedSet
          ? farmerData.products.filter((product) => savedSet.has(product.id))
          : farmerData.products;

        const agriProducts = savedSet
          ? agriData.products.filter((product) => savedSet.has(product.itemId))
          : agriData.products;

        // Add a type field to distinguish the products
        const combinedProducts = [
          ...farmerProducts.map((product) => ({
            ...product,
            source: "farmer",
          })),
          ...agriProducts.map((product) => ({
            ...product,
            source: "agribusiness",
          })), // Removed extra .products
        ];

        setProducts(combinedProducts);
        setFilteredProducts(combinedProducts);
        
        if (selectedProduct && selectedProduct.source==="farmer") {
          const updatedProduct = combinedProducts.find(p => p.id === selectedProduct.id);
          if (updatedProduct) {
            setSelectedProduct(updatedProduct);
          }
        }
        else if(selectedProduct)
        {
          const updatedProduct = combinedProducts.find(p => p.itemId === selectedProduct.itemId);
          if (updatedProduct) {
            setSelectedProduct(updatedProduct);
          }
        }
      } else {
        setError("Failed to fetch products from one or more sources");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

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
        return savedSet;
      } else {
        console.error("Failed to fetch saved products:", data.message);
        return new Set();
      }
    } catch (err) {
      console.error("Error fetching saved products:", err);
      return new Set();
    }
  };
  const initializeData = async () => {
    if (user) {
      const savedSet = await fetchSavedProducts();
      await fetchProducts(savedSet);
    }
  };
  useEffect(() => {
    const initializeData = async () => {
      if (user) {
        const savedSet = await fetchSavedProducts();
        await fetchProducts(savedSet);
      }
    };

    initializeData();
  }, [user]);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const searchTerm = searchQuery.toLowerCase();

      if (product.source === "farmer") {
        return product.itemName.toLowerCase().includes(searchTerm);
      } else {
        return product.title.toLowerCase().includes(searchTerm);
      }
    });

    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const toggleSaveProduct = async (productId) => {
    if (!user) {
      alert("Please log in to save products");
      return;
    }

    try {
      if (savedProducts.has(productId)) {
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
          const updateProductsList = (prevList) => {
            return prevList.filter((product) => {
              // If it's from farmer source, check against productId
              if (product.source === "farmer") {
                return product.id !== productId;
              }
              // If it's from agribusiness source, also check against productId
              if (product.source === "agribusiness") {
                return product.itemId !== productId;
              }
              return true;
            });
          };
          // Update products list immediately after removing from saved
          setProducts((prevProducts) => updateProductsList(prevProducts));
          setFilteredProducts((prevFiltered) =>
            updateProductsList(prevFiltered)
          );
        } else {
          console.error("Failed to remove saved product:", data.message);
        }
      } else {
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
          // Refresh products list to include newly saved product
          const savedSet = await fetchSavedProducts();
          await fetchProducts(savedSet);
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
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
              {product.category}
            </span>
            <div className="flex items-center">
              <ReviewStars rating={product.itemRating || 0} />
            </div>
          </div>
          <h3 className="font-semibold text-lg">{product.itemName}</h3>
          <p className="text-gray-500">{product.metricSystem}</p>
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

  const MarketplaceProductCard = ({ product }) => {
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

  return (
    <div className="bg-white min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-4">My Saved Products</h1>
      <p className="text-center text-gray-600 mb-8">
        Keep track of your favorite agricultural products and equipment
      </p>
      <SearchBar searchQuery={searchQuery} onSearchChange={handleInputChange} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) =>
          product.source === "farmer" ? (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={setSelectedProduct}
            />
          ) : (
            <MarketplaceProductCard
              key={product.itemId}
              product={product}
              onProductClick={setSelectedProduct}
            />
          )
        )}
      </div>
      {selectedProduct &&
        (selectedProduct.source === "farmer" ? (
          <ProductPopup
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onProductUpdate={initializeData} 
          />
        ) : (
          <MarketplaceProductPopup
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onProductUpdate={initializeData} 
          />
        ))}
    </div>
  );
};

export default SavedProductsPage;
