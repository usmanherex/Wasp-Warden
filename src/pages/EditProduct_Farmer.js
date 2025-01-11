import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card2';
import { Camera, ArrowLeft, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/Alert';

const EditFarmerProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Product state
  const [product, setProduct] = useState({
    itemName: '',
    itemDescription: '',
    itemPrice: '',
    quantityAvailable: '',
    minimumBulkAmount: '',
    image: '',
    category: '',
    metricSystem: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/farmer/products/${productId}`);
        const data = await response.json();
        
        if (data.success) {
          const productData = data.product;
          setProduct({
            itemName: productData.itemName,
            itemDescription: productData.itemDescription,
            itemPrice: productData.itemPrice,
            quantityAvailable: productData.quantityAvailable,
            minimumBulkAmount: productData.minimumBulkAmount,
            salePercentage:productData.salePercentage,
            category: productData.category,
            metricSystem: productData.metricSystem,
            image: productData.itemImage
          });
          
          if (productData.itemImage) {
            setImagePreview(`data:image/jpeg;base64,${productData.itemImage}`);
          }
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch product details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProduct(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage('');
    const user = JSON.parse(localStorage.getItem('user'));
 
    try {
      const response = await fetch(`http://localhost:5000/farmer/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...product,
          userId: user.userId // Assuming you store userId in localStorage
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage(data.message);
        setTimeout(() => {
          navigate('/manage-products', { replace: true });
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="text-lg text-green-600">Loading product...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/manage-products')}
          className="mb-6 flex items-center text-green-600 hover:text-green-700 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Products
        </button>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mb-4 bg-green-100 text-green-800">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader className="bg-green-600 text-white rounded-t-lg">
            <CardTitle>Edit Product - {product.itemName}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              {/* Image Upload Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Product Image
                </label>
                <div className="flex justify-center">
                  {imagePreview ? (
                    <div className="relative w-64 h-48">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setProduct(prev => ({ ...prev, image: null }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="w-64 h-48 flex flex-col items-center justify-center border-2 border-dashed border-green-300 rounded-lg cursor-pointer hover:border-green-400 bg-green-50 transition-colors duration-200">
                      <Camera className="h-12 w-12 text-green-500" />
                      <span className="mt-2 text-sm text-gray-600">Upload new image</span>
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

              {/* Product Details */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Price per Unit ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="itemPrice"
                      value={product.itemPrice}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity Available
                    </label>
                    <input
                      type="number"
                      name="quantityAvailable"
                      value={product.quantityAvailable}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Minimum Bulk Amount
                    </label>
                    <input
                      type="number"
                      name="minimumBulkAmount"
                      value={product.minimumBulkAmount}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sale Percentage
                    </label>
                    <input
                      type="number"
                      name="salePercentage"
                      value={product.salePercentage}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product Description
                  </label>
                  <textarea
                    name="itemDescription"
                    value={product.itemDescription}
                    onChange={handleInputChange}
                    rows="4"
                    className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                      Updating...
                    </>
                  ) : (
                    'Update Product'
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

export default EditFarmerProduct;