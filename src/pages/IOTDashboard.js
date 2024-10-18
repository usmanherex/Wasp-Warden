import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, ZAxis } from 'recharts';
import { AlertCircle, CheckCircle, Thermometer, Droplet, Beaker, Wind, Sun, CloudRain, Moon, Zap, TrendingUp, TrendingDown } from 'lucide-react';

const IoTDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Static historical data
  const historicalData = [
    { time: '08:00', temperature: 23, humidity: 45, ph: 6.8, nitrogen: 42, phosphorus: 38, potassium: 51, light: 65, soilMoisture: 35 },
    { time: '09:00', temperature: 24, humidity: 46, ph: 6.9, nitrogen: 43, phosphorus: 39, potassium: 52, light: 70, soilMoisture: 36 },
    { time: '10:00', temperature: 25, humidity: 44, ph: 6.7, nitrogen: 41, phosphorus: 37, potassium: 50, light: 75, soilMoisture: 34 },
    { time: '11:00', temperature: 26, humidity: 43, ph: 6.8, nitrogen: 44, phosphorus: 38, potassium: 53, light: 80, soilMoisture: 33 },
    { time: '12:00', temperature: 27, humidity: 42, ph: 6.9, nitrogen: 45, phosphorus: 40, potassium: 54, light: 85, soilMoisture: 32 },
  ];

  // Current sensor data (last entry from historical data)
  const sensorData = historicalData[historicalData.length - 1];

  // Calculate trends
  const calculateTrend = (dataKey) => {
    const start = historicalData[0][dataKey];
    const end = historicalData[historicalData.length - 1][dataKey];
    return ((end - start) / start * 100).toFixed(2);
  };

  const trends = {
    temperature: calculateTrend('temperature'),
    humidity: calculateTrend('humidity'),
    ph: calculateTrend('ph'),
    nitrogen: calculateTrend('nitrogen'),
    phosphorus: calculateTrend('phosphorus'),
    potassium: calculateTrend('potassium'),
  };

  // Analytics
  const analytics = {
    avgTemperature: (historicalData.reduce((sum, data) => sum + data.temperature, 0) / historicalData.length).toFixed(1),
    avgHumidity: (historicalData.reduce((sum, data) => sum + data.humidity, 0) / historicalData.length).toFixed(1),
    avgPH: (historicalData.reduce((sum, data) => sum + data.ph, 0) / historicalData.length).toFixed(2),
    totalNitrogen: historicalData.reduce((sum, data) => sum + data.nitrogen, 0),
    totalPhosphorus: historicalData.reduce((sum, data) => sum + data.phosphorus, 0),
    totalPotassium: historicalData.reduce((sum, data) => sum + data.potassium, 0),
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF'];

  const DataCard = ({ title, value, icon: Icon, unit, color, trend }) => (
    <div className={`bg-${color}-500 bg-opacity-10 p-4 rounded-lg shadow-lg`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className={`text-lg font-semibold text-${color}-500`}>{title}</h3>
        <Icon className={`w-6 h-6 text-${color}-500`} />
      </div>
      <div className={`text-3xl font-bold text-${color}-500`}>
        {value}
        <span className="text-sm ml-1">{unit}</span>
      </div>
      {trend && (
        <div className={`flex items-center mt-2 ${parseFloat(trend) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {parseFloat(trend) >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          <span className="text-sm">{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">IoT Farm Dashboard</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full ${darkMode ? 'bg-yellow-500' : 'bg-gray-800'}`}
        >
          {darkMode ? <Sun className="w-6 h-6 text-gray-900" /> : <Moon className="w-6 h-6 text-white" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DataCard title="Temperature" value={sensorData.temperature} icon={Thermometer} unit="°C" color="red" trend={trends.temperature} />
        <DataCard title="Humidity" value={sensorData.humidity} icon={Droplet} unit="%" color="blue" trend={trends.humidity} />
        <DataCard title="pH" value={sensorData.ph} icon={Beaker} unit="" color="purple" trend={trends.ph} />
        <DataCard title="Light" value={sensorData.light} icon={Sun} unit="lux" color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4">Nutrient Levels Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#ccc'} />
              <XAxis dataKey="time" stroke={darkMode ? '#888' : '#333'} />
              <YAxis stroke={darkMode ? '#888' : '#333'} />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#333' : '#fff', border: 'none' }} />
              <Legend />
              <Line type="monotone" dataKey="nitrogen" stroke="#8884d8" />
              <Line type="monotone" dataKey="phosphorus" stroke="#82ca9d" />
              <Line type="monotone" dataKey="potassium" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4">Environmental Factors</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#ccc'} />
              <XAxis dataKey="time" stroke={darkMode ? '#888' : '#333'} />
              <YAxis stroke={darkMode ? '#888' : '#333'} />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#333' : '#fff', border: 'none' }} />
              <Legend />
              <Area type="monotone" dataKey="temperature" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="humidity" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              <Area type="monotone" dataKey="ph" stackId="1" stroke="#ffc658" fill="#ffc658" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4">NPK Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Nitrogen', value: sensorData.nitrogen },
                  { name: 'Phosphorus', value: sensorData.phosphorus },
                  { name: 'Potassium', value: sensorData.potassium }
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#333' : '#fff', border: 'none' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4">Temperature vs Humidity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#ccc'} />
              <XAxis dataKey="temperature" name="Temperature" unit="°C" stroke={darkMode ? '#888' : '#333'} />
              <YAxis dataKey="humidity" name="Humidity" unit="%" stroke={darkMode ? '#888' : '#333'} />
              <ZAxis dataKey="ph" name="pH" range={[50, 500]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: darkMode ? '#333' : '#fff', border: 'none' }} />
              <Legend />
              <Scatter name="Readings" data={historicalData} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4">Soil Moisture vs Light Intensity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#ccc'} />
              <XAxis dataKey="time" stroke={darkMode ? '#888' : '#333'} />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#333' : '#fff', border: 'none' }} />
              <Legend />
              <Bar yAxisId="left" dataKey="soilMoisture" name="Soil Moisture" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="light" name="Light Intensity" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-8`}>
        <h2 className="text-xl font-semibold mb-4">Historical Data</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">Time</th>
                <th className="py-2 px-4 border-b">Temperature (°C)</th>
                <th className="py-2 px-4 border-b">Humidity (%)</th>
                <th className="py-2 px-4 border-b">pH</th>
                <th className="py-2 px-4 border-b">Nitrogen (mg/kg)</th>
                <th className="py-2 px-4 border-b">Phosphorus (mg/kg)</th>
                <th className="py-2 px-4 border-b">Potassium (mg/kg)</th>
                <th className="py-2 px-4 border-b">Light (lux)</th>
                <th className="py-2 px-4 border-b">Soil Moisture (%)</th>
              </tr>
            </thead>
            <tbody>
              {historicalData.map((data, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-2 px-4 border-b">{data.time}</td>
                  <td className="py-2 px-4 border-b">{data.temperature}</td>
                  <td className="py-2 px-4 border-b">{data.humidity}</td>
                  <td className="py-2 px-4 border-b">{data.ph}</td>
                  <td className="py-2 px-4 border-b">{data.nitrogen}</td>
                  <td className="py-2 px-4 border-b">{data.phosphorus}</td>
                  <td className="py-2 px-4 border-b">{data.potassium}</td>
                  <td className="py-2 px-4 border-b">{data.light}</td>
                  <td className="py-2 px-4 border-b">{data.soilMoisture}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-xl font-semibold mb-4">Analytics Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DataCard title="Avg Temperature" value={analytics.avgTemperature} icon={Thermometer} unit="°C" color="red" />
          <DataCard title="Avg Humidity" value={analytics.avgHumidity} icon={Droplet} unit="%" color="blue" />
          <DataCard title="Avg pH" value={analytics.avgPH} icon={Beaker} unit="" color="purple" />
          <DataCard title="Total Nitrogen" value={analytics.totalNitrogen} icon={Beaker} unit="mg/kg" color="green" />
          <DataCard title="Total Phosphorus" value={analytics.totalPhosphorus} icon={Beaker} unit="mg/kg" color="orange" />
          <DataCard title="Total Potassium" value={analytics.totalPotassium} icon={Beaker} unit="mg/kg" color="yellow" />
        </div>
      </div>
    </div>
  );
};

export default IoTDashboard;