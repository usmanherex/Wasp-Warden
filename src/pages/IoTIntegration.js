import React, { useState,useEffect } from 'react';
import { Sprout } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card2';
import IoTDashboard from '../pages/IOTDashboard';
import { AlertCircle } from 'lucide-react';
import RequestStatus from '../components/ui/RequestStatus';
const IoTIntegrationPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    farmSize: '',
    cropType: '',
    irrigationType: '',
    currentTechnology: '',
    sensorPreference: '',
    budget: '',
    phoneNumber: '',
    location: '',
    preferredContactTime: ''
  });

  const [hasExistingRequest, setHasExistingRequest] = useState(false);

useEffect(() => {
  const checkExistingRequest = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/iot-request/${user.userId}`);
      if (response.ok) {
        setHasExistingRequest(true);
      }
    } catch (error) {
      console.error('Error checking request status:', error);
    }
  };

  if (user) {
    checkExistingRequest();
  }
}, [user]);

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:5000/api/iot-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.userId,
        ...formData
      }),
    });
    
    if (response.ok) {
      setHasExistingRequest(true);
    } else {
      // Handle error
    }
  } catch (error) {
    console.error('Error submitting request:', error);
  }
};


  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  if (hasExistingRequest) {
    return <RequestStatus userId={user.userId} />;
  }
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white">
        <Card className="w-full max-w-lg shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-yellow-600 mb-4">
              <AlertCircle className="h-5 w-5" />
              <p className="text-lg font-medium">Please log in to access IoT services.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.userName === 'farmer') {
    return <IoTDashboard />;
  }
  // In the render logic:

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-green-600 text-white p-6 rounded-t-lg space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Sprout className="h-6 w-6" />
            <h1 className="text-2xl font-bold">IoT Integration Request</h1>
          </div>
          <p className="text-green-100 text-center">
            Transform your farming with smart agricultural solutions
          </p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="farmSize" className="block text-sm font-medium text-gray-700">
                  Farm Size (in acres)
                </label>
                <input
                  id="farmSize"
                  name="farmSize"
                  type="text"
                  placeholder="Enter farm size"
                  value={formData.farmSize}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="cropType" className="block text-sm font-medium text-gray-700">
                  Primary Crop Type
                </label>
                <select
                  id="cropType"
                  name="cropType"
                  value={formData.cropType}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select crop type</option>
                  <option value="rice">Rice</option>
                  <option value="wheat">Wheat</option>
                  <option value="cotton">Cotton</option>
                  <option value="sugarcane">Sugarcane</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                </select>
              </div>

          
         

              <div className="space-y-2">
                <label htmlFor="sensorPreference" className="block text-sm font-medium text-gray-700">
                  Preferred Sensor Types
                </label>
                <select
                  id="sensorPreference"
                  name="sensorPreference"
                  value={formData.sensorPreference}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select sensor preference</option>
                  <option value="soil">Soil Sensors</option>
                  <option value="weather">Weather Stations</option>
                  <option value="irrigation">Irrigation Controls</option>
                  <option value="complete">Complete Package</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                  Budget Range (in $)
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select budget range</option>
                  <option value="10000-25000">$100 - $2500</option>
                  <option value="25000-50000">$25,00 - $5000</option>
                  <option value="50000-100000">$5000 - $10000</option>
                  <option value="100000+">Above $10000</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Farm Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Enter farm location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="preferredContactTime" className="block text-sm font-medium text-gray-700">
                  Preferred Contact Time
                </label>
                <select
                  id="preferredContactTime"
                  name="preferredContactTime"
                  value={formData.preferredContactTime}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select preferred time</option>
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                  <option value="evening">Evening (4 PM - 7 PM)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button 
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg transition-colors duration-200"
              >
                Submit IoT Integration Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IoTIntegrationPage;