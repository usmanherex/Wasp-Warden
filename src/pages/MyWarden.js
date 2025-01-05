import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Bug, Wheat,Upload, ArrowRight, AlertCircle, Shield, Info } from 'lucide-react';

// Import images (you'll need to add these to your project)
import plantDiseaseImg from '../assets/images/plant-disease.jpg';
import pestDetectionImg from '../assets/images/pest_disease.jpg';
import maizeDiseaseImg from '../assets/images/maize_disease.jpg';

// MyWarden component
const MyWarden = () => {
  const features = [
    {
      title: 'Plant Disease Detection',
      description: 'Identify and diagnose various plant diseases using AI-powered image analysis.',
      icon: Leaf,
      path: '/plant-disease-detection',
      image: plantDiseaseImg,
      stats: { accuracy: '97%', diseases: '30+' }
    },
    {
      title: 'Pest Detection',
      description: 'Detect and identify harmful pests in your crops with advanced AI technology.',
      icon: Bug,
      path: '/pest-detection',
      image: pestDetectionImg,
      stats: { accuracy: '92%',species: '15' }
    },
    {
      title: 'Maize Crop Disease Detection',
      description: 'Specialized detection for common maize crop diseases to protect your harvest.',
      icon: Wheat,
      path: '/maize-disease-detection',
      image: maizeDiseaseImg,
      stats: {  accuracy: '95%', diseases: '3' }
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
  const DetectionPage = ({ title, description, icon: Icon,type }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState('');
  
    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setError(null);
      setResults(null);
    };
    let apiURL;
      if(type==='pest')
      {
        apiURL='http://127.0.0.1:5001/predict';
      }
      else if(type=='maize')
      {
        apiURL='http://127.0.0.1:5002/predict';
      }
      else if (type=='plant')
      {
        apiURL='http://127.0.0.1:5003/predict';
      }
    const processResults = async () => {
      if (!selectedFile) return;
      setIsLoading(true);
      setError(null);
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

      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
  
        const response = await fetch(apiURL, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Network response was not ok' }));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
      
  
        setResults({
          detectedIssue: data.predicted_class,
          confidence: data.confidence,
          severity: data.severity===null?"None":data.severity,
          recommendations: data.recommendations.split('.').filter(item => item.trim()),
         
          preventiveMeasures: data.preventions.split('.').filter(item => item.trim()),
          chemical: data.chemical.split('. ').filter(item => item.trim())
        });
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        clearInterval(messageInterval);
        setIsLoading(false);
      }
    };
  
    return (
      <div className="bg-gradient-to-br from-green-50 to-blue-50 min-h-screen p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header section remains the same */}
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
            {/* Upload section */}
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
  
            {/* Selected Image Preview */}
            {selectedImage && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3 text-green-800">Selected Image</h2>
                <img src={selectedImage} alt="Selected" className="w-full h-64 object-cover rounded-lg shadow-md" />
              </div>
            )}
  
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </p>
              </div>
            )}
  
            {/* Process Button */}
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
  
            {/* Loading Modal */}
            <LoadingModal isOpen={isLoading} message={loadingMessage} />
  
            {/* Results Section */}
            {results && (
              <div className="mt-8 bg-green-50 p-6 rounded-lg shadow-inner">
                <h2 className="text-2xl font-bold mb-4 text-green-800">Detection Results</h2>
                <div className="space-y-4">
                <div className="flex items-center bg-white p-3 rounded-md shadow">
 {results.detectedIssue.toLowerCase().includes('healthy') ? (
   <>  
     <Shield className="w-6 h-6 text-green-600 mr-3" />
     <div>
       <p className="font-semibold">Plant Condition:</p> 
       <p className="text-green-600 text-lg">{results.detectedIssue}</p>
     </div>
   </>
 ) : type === 'pest' ? (
   <>
     <Bug className="w-6 h-6 text-red-600 mr-3" />
     <div>
       <p className="font-semibold">Detected Pest:</p>
       <p className="text-red-600 text-lg">{results.detectedIssue}</p>
     </div>
   </>
 ) : (
   <>
     <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
     <div>
       <p className="font-semibold">Detected Disease:</p>
       <p className="text-red-600 text-lg">{results.detectedIssue}</p>
     </div>
   </>
 )}
</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-md shadow">
                      <p className="font-semibold">Confidence:</p>
                      <p className="text-green-600 text-lg">{results.confidence}</p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow">
                      <p className="font-semibold">Severity:</p>
                      <p className={`text-lg ${
 results.severity === 'None' ? 'text-black' :
 results.severity === 'Low' ? 'text-yellow-500' :
 results.severity === 'Medium' ? 'text-orange-500' :
 results.severity === 'High' ? 'text-red-600' :
 results.severity === 'Severe' ? 'text-red-800' :
 'text-black'
}`}>{results.severity}</p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-md shadow">
                    <p className="font-semibold">Recommended Chemical Treatment:</p>
                    <ul className="list-disc list-inside space-y-1 bg-white p-3 rounded-md shadow">
                      {results.chemical.map((rec, index) => (
                        <li key={index} className="text-purple-700">{rec}</li>
                      ))}
                    </ul>
                   
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
      description="Upload an image of your plant infected leaf part with a good background to detect and diagnose potential diseases using our advanced AI technology."
      icon={Leaf}
      type="plant"
    />
  );
  
  const PestDetection = () => (
    <DetectionPage
      title="Pest Detection"
      description="Identify harmful pests in your crops by uploading an image. Our AI will analyze and provide recommendations."
      icon={Bug}
      type="pest"
    />
  );
  
  const MaizeDiseaseDetection = () => (
    <DetectionPage
      title="Maize Crop Disease Detection"
      description="Specialized detection for maize crop diseases. Upload an image of your maize crop for analysis and treatment recommendations."
      icon={Wheat}
      type="maize"
    />
  );
  
  export {MyWarden, DetectionPage, PlantDiseaseDetection, PestDetection, MaizeDiseaseDetection };