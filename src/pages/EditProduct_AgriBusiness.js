import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card2";
import { Camera, ArrowLeft, Loader2 } from "lucide-react";

const EditAgriBusinessProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [product, setProduct] = useState({
    itemId: "",
    title: "",
    description: "",
    price: "",
    quantityAvailable: "",
    productType: "",
    image: "",
    salePercentage: 0,
    // Machine specific fields
    machineWeight: "",
    warranty: "",
    // Chemical specific fields
    quantity: "",
    expiryDate: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/agribusiness-product/${productId}`
        );
        const data = await response.json();
        if (data.success) {
          setProduct(data.product);

          setImagePreview(`data:image/jpeg;base64,${data.product.image}`);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProduct((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:5000/agribusiness-product/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );

      const data = await response.json();
      if (data.success) {
        navigate("/manage-products", { replace: true });
      }
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  const isMachine = product.productType === "Machine";

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/manage-products")}
          className="mb-8 flex items-center text-green-600 hover:text-green-700 transition-colors duration-200 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Products
        </button>

        <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
          <CardHeader className="border-b bg-green-50 px-6 py-4">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Edit {isMachine ? "Machine" : "Chemical"} Product
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-gray-50">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Image Upload Section */}
              <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700">
                  Product Image
                </label>
                <div className="flex justify-center bg-gray-50 rounded-xl p-6">
                  {imagePreview ? (
                    <div className="relative w-72 h-56">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setProduct((prev) => ({ ...prev, image: null }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200 shadow-sm"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="w-72 h-56 flex flex-col items-center justify-center border-2 border-dashed border-green-300 rounded-xl cursor-pointer hover:border-green-400 bg-white transition-colors duration-200">
                      <Camera className="h-12 w-12 text-green-500 mb-2" />
                      <span className="text-sm text-gray-600">Upload new image</span>
                      <span className="text-xs text-gray-400 mt-1">Click or drag and drop</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Common Fields Section */}
              <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={product.price}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 bg-white"
                      required
                    />
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity Available
                    </label>
                    <input
                      type="number"
                      name="quantityAvailable"
                      value={product.quantityAvailable}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 bg-white"
                      required
                    />
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sale Percentage
                    </label>
                    <input
                      type="number"
                      name="salePercentage"
                      value={product.salePercentage}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 bg-white"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              {/* Product-specific Fields Section */}
              <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                  {isMachine ? "Machine Details" : "Chemical Details"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isMachine ? (
                    <>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Machine Weight (kg)
                        </label>
                        <input
                          type="number"
                          name="machineWeight"
                          value={product.machineWeight}
                          onChange={handleInputChange}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 bg-white"
                          required
                        />
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Warranty (months)
                        </label>
                        <input
                          type="number"
                          name="warranty"
                          value={product.warranty}
                          onChange={handleInputChange}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 bg-white"
                          required
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity per Unit
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          value={product.quantity}
                          onChange={handleInputChange}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 bg-white"
                          required
                        />
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="date"
                          name="expiryDate"
                          value={product.expiryDate}
                          onChange={handleInputChange}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 bg-white"
                          required
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Product Description</h3>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={product.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 bg-white"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 shadow-sm transition-colors duration-200 font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                      Updating...
                    </>
                  ) : (
                    "Update Product"
                  )}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditAgriBusinessProduct;