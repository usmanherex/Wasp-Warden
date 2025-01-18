import React, { useState, useEffect } from 'react';
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
  AlertTriangle,
  DollarSign,
  User
} from 'lucide-react';
import { Card } from '../components/ui/Card2';

const AgriDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/agribusiness/analytics/${user.userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user.userId]);
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
        {loading ? (
          <div className="text-center py-4">Loading analytics...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-4">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
              <DollarSign className="h-6 w-6 text-green-600 mb-2" />
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ${analytics.monthly_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
              <Package className="h-6 w-6 text-green-600 mb-2" />
              <p className="text-sm text-gray-600">Active Products</p>
              <p className="text-2xl font-bold text-green-600">{analytics.active_products}</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
              <ShoppingBag className="h-6 w-6 text-green-600 mb-2" />
              <p className="text-sm text-gray-600">Completed Orders</p>
              <p className="text-2xl font-bold text-green-600">{analytics.completed_orders}</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
              <ShoppingBag className="h-6 w-6 text-green-600 mb-2" />
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-green-600">{analytics.pending_orders}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Link to="/create-product-agribusiness">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white border-green-500 border-l-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Plus className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Create Products</h3>
                <p className="text-sm text-gray-500">List new products for sale</p>
              </div>
            </div>
          </Card>
        </Link>

        {/* Manage Products */}
        <Link to="/manage-products">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white border-green-500 border-l-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Manage Products</h3>
                <p className="text-sm text-gray-500">Edit and update your listings</p>
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

     

        {/* Pending Orders */}
        <Link to="/pending-orders">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white border-green-500 border-l-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Pending Orders</h3>
                <p className="text-sm text-gray-500">Track ongoing orders</p>
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
       
       <Link to="/finances">
                 <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white border-green-500 border-l-4">
                   <div className="flex items-center space-x-4">
                     <div className="p-3 bg-green-100 rounded-full">
                       <DollarSign className="h-6 w-6 text-green-600" />
                     </div>
                     <div>
                       <h3 className="font-semibold text-lg text-gray-900">My Finances</h3>
                       <p className="text-sm text-gray-500">Manage Finances</p>
                     </div>
                   </div>
                 </Card>
               </Link>
  
       
      </div>

      {/* Recent Activity */}
      
    </div>
  );
};

export default AgriDashboard;