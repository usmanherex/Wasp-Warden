import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { AlertCircle, Thermometer, Droplet, Beaker, Sun, Moon, TrendingUp, TrendingDown, Waves } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot, addDoc, Timestamp  } from 'firebase/firestore';

import { db } from '../firebaseConfig/firebase';

import LoadingSpinner from '../components/Loader/LoadingSpinner';
const API_KEY = 'AlzaSyBE5Cren5Tj6GVusdsFCuE0gHRldZTAwUA';
const PROJECT_ID = 'iotstuff-24112';
const DATABASE_URL = `https://iotstuff-24112-default-rtdb.firebaseio.com`;

const IoTDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [historicalData, setHistoricalData] = useState([]);
  const [sensorData, setSensorData] = useState(null);
  const [sensorRealTimeData, setSensorRealTimeData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const storeWaspWardenData = async (sensorData) => {
    try {
      const currentDateTime = new Date();
      const formattedData = {
        humidity: sensorData.environment.humidity,
        temperature_celsius: sensorData.environment.temperatureC,
        temperature_fahrenheit: sensorData.environment.temperatureF,
        nitrogen: sensorData.npk_values.nitrogen,
        phosphorous: sensorData.npk_values.phosphorous,
        potassium: sensorData.npk_values.potassium,
        soil_moisture: sensorData.soil_moisture,
        date: currentDateTime.toISOString().split('T')[0],
        time: currentDateTime.toTimeString().split(' ')[0],
        timestamp: Timestamp.fromDate(currentDateTime)
      };

      const docRef = await addDoc(collection(db, 'sensor_readings'), formattedData);
      console.log('Data stored in WaspWarden database with ID:', docRef.id);
    } catch (error) {
      console.error('Error storing data in WaspWarden:', error);
    }
  };








  const fetchSensorRealTimeData = async () => {
    try {
      setLoading(true);
      // Update the URL to include .json for Firebase REST API
      const response = await fetch('https://iotstuff-24112-default-rtdb.firebaseio.com/.json');
      
      if (!response.ok) {
        throw new Error('Failed to fetch sensor data');
      }

      const data = await response.json();
      
      if (!data) {
        throw new Error('No data available');
      }

      // Updated to match your exact Firebase structure
      const formattedData = {
        environment: {
          humidity: data.environment.humidity || 0,
          temperatureC: data.environment.temperatureC || 0,
          temperatureF: data.environment.temperatureF || 0,
        },
        npk_values: {
          nitrogen: data.npk_values.nitrogen || 0,
          phosphorous: data.npk_values.phosphorous || 0,
          potassium: data.npk_values.potassium || 0,
        },
        soil_moisture: data.soil_moisture || 'unknown'
      };

      setSensorRealTimeData(formattedData);
     // await storeWaspWardenData(formattedData);
      
      
      setError(null);
    } catch (err) {
      console.error('Error fetching sensor data:', err);
      setError(err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSensorRealTimeData();
  }, []);

  // Set up polling every 10 seconds
  useEffect(() => {
   const intervalId = setInterval(() => {
      fetchSensorRealTimeData();
    }, 10000); // 30 seconds
        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
     }, []);

  useEffect(() => {
    const q = query(collection(db, 'sensor_readings'), orderBy('timestamp', 'desc'), limit(10));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        time: new Date(doc.data().timestamp.seconds * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      })).reverse();
      
      setHistoricalData(data);
      setSensorData(data[data.length - 1]);
    });

    return () => unsubscribe();
  }, []);

  // Calculate trends
  const calculateTrend = (dataKey) => {
    if (historicalData.length < 2) return 0;
    const start = historicalData[0][dataKey];
    const end = historicalData[historicalData.length - 1][dataKey];
    return ((end - start) / start * 100).toFixed(2);
  };

  const trends = {
    temperature: calculateTrend('temperature_celsius'),
    humidity: calculateTrend('humidity'),
    nitrogen: calculateTrend('nitrogen'),
    phosphorous: calculateTrend('phosphorous'),
    potassium: calculateTrend('potassium'),
    soil_moisture: calculateTrend('soil_moisture'),
  };

  // Calculate analytics
  const calculateAnalytics = () => {
    if (!historicalData.length) return null;
    return {
      avgTemperature: (historicalData.reduce((sum, data) => sum + data.temperature_celsius, 0) / historicalData.length).toFixed(1),
      avgHumidity: (historicalData.reduce((sum, data) => sum + data.humidity, 0) / historicalData.length).toFixed(1),
      totalNitrogen: historicalData.reduce((sum, data) => sum + data.nitrogen, 0).toFixed(1),
      totalPhosphorus: historicalData.reduce((sum, data) => sum + data.phosphorous, 0).toFixed(1),
      totalPotassium: historicalData.reduce((sum, data) => sum + data.potassium, 0).toFixed(1),
    };
  };

  const analytics = calculateAnalytics();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
  const getNPKData = () => {
    if (!sensorRealTimeData) return [];
    return [
      { name: 'Nitrogen', value: sensorRealTimeData.npk_values.nitrogen },
      { name: 'Phosphorous', value: sensorRealTimeData.npk_values.phosphorous },
      { name: 'Potassium', value: sensorRealTimeData.npk_values.potassium }
    ];
  };
  const DataCard = ({ title, value, icon: Icon, unit, color, trend }) => (
    <div className={`bg-${color}-500 bg-opacity-10 p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className={`text-lg font-semibold text-${color}-600`}>{title}</h3>
        <Icon className={`w-6 h-6 text-${color}-500`} />
      </div>
      <div className={`text-4xl font-bold text-${color}-600`}>
        {value}
        <span className="text-sm ml-1">{unit}</span>
      </div>
      {trend && (
        <div className={`flex items-center mt-3 ${parseFloat(trend) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {parseFloat(trend) >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          <span className="text-sm font-medium">{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
  );

  if (!sensorData || loading) return <div><LoadingSpinner/></div>;
 if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>Error loading sensor data: {error}</p>
          <button 
            onClick={fetchSensorRealTimeData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">IoT Farm Dashboard</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-3 rounded-full transition-all duration-300 ${darkMode ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-gray-800 hover:bg-gray-700'}`}
        >
          {darkMode ? <Sun className="w-6 h-6 text-gray-900" /> : <Moon className="w-6 h-6 text-white" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <DataCard title="Temperature" value={sensorRealTimeData.environment.temperatureC} icon={Thermometer} unit="°C" color="red" trend={trends.temperature} />
        <DataCard title="Humidity" value={sensorRealTimeData.environment.humidity} icon={Droplet} unit="%" color="blue" trend={trends.humidity} />
        <DataCard title="Soil Moisture" value={sensorRealTimeData.soil_moisture} icon={Waves} unit="%" color="cyan" trend={trends.soil_moisture} />
        <DataCard title="Nitrogen" value={sensorRealTimeData.npk_values.nitrogen} icon={Beaker} unit="mg/kg" color="green" trend={trends.nitrogen} />
        <DataCard title="Phosphorous" value={sensorRealTimeData.npk_values.phosphorous} icon={Beaker} unit="mg/kg" color="orange" trend={trends.phosphorous} />
        <DataCard title="Potassium" value={sensorRealTimeData.npk_values.potassium} icon={Beaker} unit="mg/kg" color="purple" trend={trends.potassium} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
  <div className={`p-6 rounded-xl shadow-lg transition-all duration-300 ${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-xl'}`}>
    <h2 className="text-xl font-semibold mb-4">NPK Distribution</h2>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={getNPKData()}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {getNPKData().map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>

  <div className={`p-6 rounded-xl shadow-lg transition-all duration-300 ${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-xl'}`}>
    <h2 className="text-xl font-semibold mb-4">Temperature & Humidity</h2>
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={historicalData}>
        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#ccc'} />
        <XAxis dataKey="time" stroke={darkMode ? '#888' : '#333'} />
        <YAxis stroke={darkMode ? '#888' : '#333'} />
        <Tooltip contentStyle={{ backgroundColor: darkMode ? '#333' : '#fff', border: 'none' }} />
        <Legend />
        <Area type="monotone" dataKey="temperature_celsius" name="Temperature" stackId="1" stroke="#8884d8" fill="#8884d8" />
        <Area type="monotone" dataKey="humidity" name="Humidity" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
</div>


<div className="mb-8">
  <div className={`p-6 rounded-xl shadow-lg transition-all duration-300 ${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-xl'}`}>
    <h2 className="text-xl font-semibold mb-4">Nutrient Levels Over Time</h2>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={historicalData}>
        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#ccc'} />
        <XAxis dataKey="time" stroke={darkMode ? '#888' : '#333'} />
        <YAxis stroke={darkMode ? '#888' : '#333'} />
        <Tooltip contentStyle={{ backgroundColor: darkMode ? '#333' : '#fff', border: 'none' }} />
        <Legend />
        <Line type="monotone" dataKey="nitrogen" stroke="#8884d8" strokeWidth={2} />
        <Line type="monotone" dataKey="phosphorous" stroke="#82ca9d" strokeWidth={2} />
        <Line type="monotone" dataKey="potassium" stroke="#ffc658" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>

      <div className={`p-6 rounded-xl shadow-lg mb-8 transition-all duration-300 ${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-xl'}`}>
        <h2 className="text-xl font-semibold mb-4">Analytics Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DataCard title="Avg Temperature" value={analytics.avgTemperature} icon={Thermometer} unit="°C" color="red" />
          <DataCard title="Avg Humidity" value={analytics.avgHumidity} icon={Droplet} unit="%" color="blue" />
          <DataCard title="Total Nitrogen" value={analytics.totalNitrogen} icon={Beaker} unit="mg/kg" color="green" />
          <DataCard title="Total Phosphorus" value={analytics.totalPhosphorus} icon={Beaker} unit="mg/kg" color="orange" />
          <DataCard title="Total Potassium" value={analytics.totalPotassium} icon={Beaker} unit="mg/kg" color="purple" />
        </div>
      </div>
      
      <div className={`p-6 rounded-xl shadow-lg transition-all duration-300 ${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-xl'}`}>
        <h2 className="text-xl font-semibold mb-4">Historical Data</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Time</th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Temperature (°C)</th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Humidity (%)</th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Soil Moisture (%)</th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Nitrogen (mg/kg)</th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Phosphorous (mg/kg)</th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">Potassium (mg/kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {historicalData.map((data, index) => (
                <tr key={index} className={`${darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'} transition-colors duration-150`}>
                  <td className="py-3 px-4 whitespace-nowrap">{data.time}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{data.temperature_celsius}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{data.humidity}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{data.soil_moisture}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{data.nitrogen}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{data.phosphorous}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{data.potassium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IoTDashboard;