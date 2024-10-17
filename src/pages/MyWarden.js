import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Bug, Wheat, Upload, ArrowRight, AlertCircle, Shield, Info } from 'lucide-react';

// Import images (you'll need to add these to your project)
import plantDiseaseImg from '../assets/images/plant-disease.jpg';
import pestDetectionImg from '../assets/images/pest_disease.jpg';
import wheatDiseaseImg from '../assets/images/wheat_disease.jpg';

// MyWarden component
const MyWarden = () => {
  const features = [
    {
      title: 'Plant Disease Detection',
      description: 'Identify and diagnose various plant diseases using AI-powered image analysis.',
      icon: Leaf,
      path: '/plant-disease-detection',
      image: plantDiseaseImg,
      stats: { accuracy: '98%', detections: '10M+' }
    },
    {
      title: 'Pest Detection',
      description: 'Detect and identify harmful pests in your crops with advanced AI technology.',
      icon: Bug,
      path: '/pest-detection',
      image: pestDetectionImg,
      stats: { species: '1000+', prevention: '95%' }
    },
    {
      title: 'Wheat Crop Disease Detection',
      description: 'Specialized detection for common wheat crop diseases to protect your harvest.',
      icon: Wheat,
      path: '/wheat-disease-detection',
      image: wheatDiseaseImg,
      stats: { yield: '+20%', diseases: '50+' }
    }
  ];

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-3 text-green-800">My Warden</h1>
        <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto text-base sm:text-lg">
          Harness the power of AI to protect your crops. Select a detection feature below to safeguard your harvest and maximize yield.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Link key={index} to={feature.path} className="block group">
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                  <img src={feature.image} alt={feature.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <feature.icon className="w-6 h-6 text-green-600 mr-2" />
                    <h2 className="text-lg font-bold text-green-800">{feature.title}</h2>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                    {Object.entries(feature.stats).map(([key, value], i) => (
                      <div key={i} className="flex items-center">
                        <Shield className="w-3 h-3 mr-1 text-green-500" />
                        <span>{key.charAt(0).toUpperCase() + key.slice(1)}: <strong>{value}</strong></span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center text-green-600 text-sm font-semibold group-hover:text-green-700">
                    Get Started <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

// LoadingModal component
const LoadingModal = ({ isOpen, message }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Processing Your Results</h3>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>
      </div>
    );
  };
  
  // DetectionPage component
  const DetectionPage = ({ title, description, icon: Icon }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState('');
  
    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
    };
  
    const processResults = () => {
      setIsLoading(true);
      const messages = [
        "Analyzing image patterns...",
        "Comparing with our extensive database...",
        "Applying machine learning algorithms...",
        "Generating comprehensive results...",
        "The best outcomes take time. Almost there!"
      ];
      let messageIndex = 0;
      const messageInterval = setInterval(() => {
        setLoadingMessage(messages[messageIndex]);
        messageIndex = (messageIndex + 1) % messages.length;
      }, 3000);

      setTimeout(() => {
        clearInterval(messageInterval);
        setResults({
          detectedIssue: 'Powdery Mildew',
          confidence: '95%',
          severity: 'Moderate',
          affectedArea: '30%',
          estimatedImpact: 'Yield reduction by 15-20%',
          recommendations: [
            'Apply sulfur-based fungicide within 3 days',
            'Improve air circulation by pruning and spacing plants',
            'Adjust watering schedule to morning hours',
            'Monitor humidity levels and use dehumidifiers if necessary'
          ],
          preventiveMeasures: [
            'Use resistant plant varieties',
            'Maintain proper plant nutrition',
            'Implement crop rotation'
          ]
        });
        setIsLoading(false);
      }, 15000);
    };
  
    return (
      <div className="bg-gradient-to-br from-green-50 to-blue-50 min-h-screen p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white p-3 rounded-full mr-4">
                <Icon className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">{title}</h1>
            </div>
            <p className="text-center text-green-100 text-sm sm:text-base max-w-2xl mx-auto">{description}</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-green-800">Upload Your Image</h2>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-green-300 border-dashed rounded-lg cursor-pointer bg-green-50 hover:bg-green-100 transition-colors duration-300">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-green-500" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <input id="image-upload" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              </div>
            </div>
  
            {selectedImage && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3 text-green-800">Selected Image</h2>
                <img src={selectedImage} alt="Selected" className="w-full h-64 object-cover rounded-lg shadow-md" />
              </div>
            )}
  
            <button
              onClick={processResults}
              disabled={!selectedImage || isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white text-lg transition-all duration-300 ${
                !selectedImage || isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 hover:shadow-md transform hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? 'Processing...' : 'Analyze Image'}
            </button>
  
            <LoadingModal isOpen={isLoading} message={loadingMessage} />
  
            {results && (
              <div className="mt-8 bg-green-50 p-6 rounded-lg shadow-inner">
                <h2 className="text-2xl font-bold mb-4 text-green-800">Detection Results</h2>
                <div className="space-y-4">
                  <div className="flex items-center bg-white p-3 rounded-md shadow">
                    <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                    <div>
                      <p className="font-semibold">Detected Issue:</p>
                      <p className="text-red-600 text-lg">{results.detectedIssue}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-md shadow">
                      <p className="font-semibold">Confidence:</p>
                      <p className="text-green-600 text-lg">{results.confidence}</p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow">
                      <p className="font-semibold">Severity:</p>
                      <p className="text-orange-500 text-lg">{results.severity}</p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow">
                      <p className="font-semibold">Affected Area:</p>
                      <p className="text-blue-600 text-lg">{results.affectedArea}</p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow">
                      <p className="font-semibold">Estimated Impact:</p>
                      <p className="text-purple-600 text-lg">{results.estimatedImpact}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center text-green-700">
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Recommendations:
                    </h3>
                    <ul className="list-disc list-inside space-y-1 bg-white p-3 rounded-md shadow">
                      {results.recommendations.map((rec, index) => (
                        <li key={index} className="text-gray-700">{rec}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center text-green-700">
                      <Shield className="w-5 h-5 mr-2" />
                      Preventive Measures:
                    </h3>
                    <ul className="list-disc list-inside space-y-1 bg-white p-3 rounded-md shadow">
                      {results.preventiveMeasures.map((measure, index) => (
                        <li key={index} className="text-gray-700">{measure}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // Specific detection pages remain the same
  const PlantDiseaseDetection = () => (
    <DetectionPage
      title="Plant Disease Detection"
      description="Upload an image of your plant to detect and diagnose potential diseases using our advanced AI technology."
      icon={Leaf}
    />
  );
  
  const PestDetection = () => (
    <DetectionPage
      title="Pest Detection"
      description="Identify harmful pests in your crops by uploading an image. Our AI will analyze and provide recommendations."
      icon={Bug}
    />
  );
  
  const WheatDiseaseDetection = () => (
    <DetectionPage
      title="Wheat Crop Disease Detection"
      description="Specialized detection for wheat crop diseases. Upload an image of your wheat crop for analysis and treatment recommendations."
      icon={Wheat}
    />
  );
  
  export {MyWarden, DetectionPage, PlantDiseaseDetection, PestDetection, WheatDiseaseDetection };