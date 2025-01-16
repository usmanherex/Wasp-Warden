import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Package, 
  FileText, 
  MessageSquare, 
  Bookmark, 
  Clock, 
  ShoppingBag,
  TrendingUp,
  Cloud,
  Droplet,
  Thermometer,
  Plant,
  AlertTriangle,
  PieChart,
  Calendar,
  DollarSign,User, Handshake
} from 'lucide-react';
import { Card } from '../components/ui/Card2';

const ConsumerDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <h2 className="text-xl font-semibold text-gray-900">Welcome {user.userName}!</h2>
      {/* Quick Stats Section */}
      <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Performance Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
            <DollarSign className="h-6 w-6 text-green-600 mb-2" />
            <p className="text-sm text-gray-600">Monthly Revenue</p>
            <p className="text-2xl font-bold text-green-600">$2,450</p>
            <p className="text-xs text-green-600">↑ 12% from last month</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
            <Package className="h-6 w-6 text-green-600 mb-2" />
            <p className="text-sm text-gray-600">Active Products</p>
            <p className="text-2xl font-bold text-green-600">12</p>
            <p className="text-xs text-green-600">↑ 3 new this week</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
            <ShoppingBag className="h-6 w-6 text-green-600 mb-2" />
            <p className="text-sm text-gray-600">Completed Orders</p>
            <p className="text-2xl font-bold text-green-600">5</p>
            
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
            <ShoppingBag className="h-6 w-6 text-green-600 mb-2" />
            <p className="text-sm text-gray-600">Pending Orders</p>
            <p className="text-2xl font-bold text-green-600">8</p>
            <p className="text-xs text-green-600">3 require action</p>
          </div>
        </div>
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    

            {/* Pending Orders */}
       
        {/* Order History */}
        <Link to={`/order-history/${user.userId}`}>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white border-green-500 border-l-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Order History</h3>
                <p className="text-sm text-gray-500">View past transactions</p>
              </div>
            </div>
          </Card>
        </Link>

       {/* Pending Negotiations */}
       <Link to="/consumer-negotiations">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white border-green-500 border-l-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Handshake  className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Pending Negotiations</h3>
                <p className="text-sm text-gray-500">Track pending negotiations</p>
              </div>
            </div>
          </Card>
        </Link>


        {/* Saved Products */}
        <Link to="/saved-products">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white border-green-500 border-l-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Bookmark className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Saved Products</h3>
                <p className="text-sm text-gray-500">View your bookmarked items</p>
              </div>
            </div>
          </Card>
        </Link>
 
        <Link to="/profile">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white border-green-500 border-l-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">My Profile</h3>
                <p className="text-sm text-gray-500">Manage your profile</p>
              </div>
            </div>
          </Card>  
          </Link>
 
   
       
      </div>

      {/* Recent Activity */}
      <Card className="bg-white p-6 shadow-lg">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="h-5 w-5 text-green-600" />
              <p className="text-sm text-gray-700">New order received for 50kg Rice</p>
            </div>
            <span className="text-xs text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <p className="text-sm text-gray-700">Price negotiation started for Wheat</p>
            </div>
            <span className="text-xs text-gray-500">5 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <p className="text-sm text-gray-700">Disease alert: Check tomato plants</p>
            </div>
            <span className="text-xs text-gray-500">1 day ago</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ConsumerDashboard;