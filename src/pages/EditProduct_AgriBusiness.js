import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card2';
import { Camera, ArrowLeft, Loader2 } from 'lucide-react';
const chemicalTypes = [
  'Pesticide',
  'Herbicide',
  'Fertilizer',
  'Fungicide',
  'Insecticide',
  'Growth Regulator',
  'Other'
];

const EditAgriBusinessProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [product, setProduct] = useState({
    id: '',
    title: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    chemicalType: '',
    image: '',
    type: 'agribusiness'
  });

  // Dummy data for testing
  const dummyProducts = {
    machine: {
      id: '1',
      title: "Tractor XL-2000",
      description: "High-performance farming tractor with advanced features. Includes GPS navigation and climate-controlled cabin.",
      price: "45000",
      quantity: "5",
      category: "Machine",
      type: "agribusiness",
      image: "/api/placeholder/400/300"
    },
    chemical: {
      id: '2',
      title: "Premium Fertilizer Plus",
      description: "High-quality organic fertilizer suitable for all crop types. Enriched with essential nutrients.",
      price: "29.99",
      quantity: "100",
      category: "Chemical",
      chemicalType: "Fertilizer",
      type: "agribusiness",
      image: "/api/placeholder/400/300"
    }
  };

  // Simulated data fetch
  useEffect(() => {
    const fetchProduct = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For testing: alternate between machine and chemical based on productId
      const dummyProduct = productId === '1' ? dummyProducts.machine : dummyProducts.chemical;
      
      setProduct(dummyProduct);
      setImagePreview(dummyProduct.image);
      setIsLoading(false);
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
          image: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Updated product:', {
      ...product,
      price: parseFloat(product.price),
      quantity: parseInt(product.quantity)
    });
    
    setIsSubmitting(false);
    navigate('/manage-products', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="text-lg text-green-600">Loading product details...</span>
        </div>
      </div>
    );
  }

  const isMachine = product.category === 'Machine';

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

        <Card>
          <CardHeader className="bg-green-600 text-white rounded-t-lg">
            <CardTitle>
              Edit {isMachine ? 'Machine' : 'Chemical'} - {product.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              {/* Image Upload */}
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
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step={isMachine ? "1" : "0.01"}
                      name="price"
                      value={product.price}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity in Stock
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={product.quantity}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>

                  {!isMachine && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Chemical Type
                      </label>
                      <select
                        name="chemicalType"
                        value={product.chemicalType || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required
                      >
                        <option value="">Select type</option>
            {chemicalTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {isMachine ? 'Machine' : 'Chemical'} Description
                  </label>
                  <textarea
                    name="description"
                    value={product.description}
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

export default EditAgriBusinessProduct;