import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card2';
import { Camera } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/Alert';
const CreateAgriBusinessProduct = () => {
  const [productType, setProductType] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user.userId;
  const userType = user.userType;
  const [formData, setFormData] = useState({
    userId: userId,
    userType: userType, 
  });

  const machineTypes = [
    'Tractor',
    'Harvester',
    'Seeder',
    'Sprayer',
    'Irrigation System',
    'Plough',
    'Other'
  ];

  const powerSources = [
    'Diesel',
    'Petrol',
    'Electric',
    'Manual',
    'Hybrid',
    'Solar',
    'Other'
  ];

  const chemicalTypes = [
    'Pesticide',
    'Herbicide',
    'Fertilizer',
    'Fungicide',
    'Insecticide',
    'Growth Regulator',
    'Other'
  ];

  const metrics = [
    'Liters (L)',
    'Milliliters (mL)',
    'Kilograms (kg)',
    'Grams (g)',
    'Pounds (lb)'
  ];

  const hazardLevels = [
    'Low',
    'Medium',
    'High',
    'Very High',
    'Extreme'
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...formData,
        productType: productType === 'machine' ? 'Machine' : 'Chemical',
        quantityAvailable: formData['quantity in Stock'],
      };

      const response = await fetch('http://localhost:5000/agribusiness-products/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.success) {
        setAlert({
          show: true,
          message: data.message,
          type: 'success'
        });
        // Reset form
        setProductType('');
        setImagePreview(null);
        setFormData({
          userId: userId,
          userType: userType,
        });
      } else {
        setAlert({
          show: true,
          message: data.message,
          type: 'error'
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        message: 'An error occurred while creating the product',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
      {alert.show && (
          <Alert className={`mb-4 ${alert.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
            <AlertDescription>
              {alert.message}
            </AlertDescription>
          </Alert>
        )}
        <Card>
          <CardHeader className="bg-green-600 text-white rounded-t-lg">
            <CardTitle>
              Create Agri-Business Product
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Type Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Product Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setProductType('machine')}
                    className={`p-4 text-center rounded-lg border-2 transition-all ${
                      productType === 'machine'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    Machine
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductType('chemical')}
                    className={`p-4 text-center rounded-lg border-2 transition-all ${
                      productType === 'chemical'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    Chemical
                  </button>
                </div>
              </div>

              {productType && (
                <>
                  {/* Image Upload Section */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Product Image
                    </label>
                    <div className="flex justify-center items-center">
                      {imagePreview ? (
                        <div className="relative w-48 h-48">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => setImagePreview(null)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <label className="w-48 h-48 flex flex-col items-center justify-center border-2 border-dashed border-green-300 rounded-lg cursor-pointer hover:border-green-400 bg-green-50">
                          <div className="w-12 h-12 text-green-500">
                            <Camera />
                          </div>
                          <span className="mt-2 text-sm text-gray-600">Upload Image</span>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title Field */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {productType === 'machine' ? 'Machine Title' : 'Chemical Title'}
                      </label>
                      <input
                        type="text"
                        name="title"
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>

                    {/* Price Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Price
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          name="price"
                          step="0.01"
                          onChange={handleInputChange}
                          className="pl-7 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Machine-specific fields */}
                    {productType === 'machine' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Machine Type
                          </label>
                          <select
                            name="machineType"
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            required
                          >
                            <option value="">Select Type</option>
                            {machineTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Machine Weight (kg)
                          </label>
                          <input
                            type="number"
                            name="machineWeight"
                            step="0.1"
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Power Source
                          </label>
                          <select
                            name="powerSource"
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            required
                          >
                            <option value="">Select Power Source</option>
                            {powerSources.map((source) => (
                              <option key={source} value={source}>
                                {source}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Warranty (months)
                          </label>
                          <input
                            type="number"
                            name="warranty"
                            min="0"
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            required
                          />
                        </div>
                      </>
                    )}

                    {/* Chemical-specific fields */}
                    {productType === 'chemical' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Chemical Type
                          </label>
                          <select
                            name="chemicalType"
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            required
                          >
                            <option value="">Select Type</option>
                            {chemicalTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Metric System
                          </label>
                          <select
                            name="metricSystem"
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            required
                          >
                            <option value="">Select Unit</option>
                            {metrics.map((metric) => (
                              <option key={metric} value={metric}>
                                {metric}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Hazard Level
                          </label>
                          <select
                            name="hazardLevel"
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            required
                          >
                            <option value="">Select Hazard Level</option>
                            {hazardLevels.map((level) => (
                              <option key={level} value={level}>
                                {level}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Expiry Date
                          </label>
                          <input
                            type="date"
                            name="expiryDate"
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            required
                          />
                        </div>
                      </>
                    )}

                    {/* Common fields */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Quantity in Stock
                      </label>
                      <input
                        type="number"
                        name="quantity in Stock"
                        min="0"
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>
                    
                    {productType === 'chemical' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Quantity
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          min="0"
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          required
                        />
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {productType === 'machine' ? 'Machine Description' : 'Chemical Description'}
                      </label>
                      <textarea
                        name="description"
                        rows="3"
                        onChange={handleInputChange}
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
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating...
                        </>
                      ) : (
                        'Create Product'
                      )}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  export default CreateAgriBusinessProduct;