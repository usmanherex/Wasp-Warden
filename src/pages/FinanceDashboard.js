import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card2";
import { Loader2, Sprout, TreePine, Leaf, TrendingUp, AlertTriangle, Table as TableIcon, TreesIcon as Plant, Calendar, Filter, Download } from 'lucide-react';

const COLORS = ['#4ade80', '#2dd4bf', '#60a5fa', '#f472b6'];
const CHART_GREEN = '#22c55e';

const FinanceDashboard = () => {
  const [data, setData] = useState({
    basic_stats: {
      total_earnings: 0,
      avg_transaction: 0,
      total_transactions: 0,
      max_transaction: 0
    },
    monthly_data: [],
    status_distribution: [],
    pending_orders: [],
    finances: [] // Added this to store finances data
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showFilters, setShowFilters] = useState(false);
  
  // Initialize dates to last 30 days
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const getUserId = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('No user found in localStorage');
      const user = JSON.parse(userStr);
      if (!user.userId) throw new Error('No userId found in user data');
      return user.userId;
    } catch (err) {
      console.error('Error getting userId:', err);
      return null;
    }
  };
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredFinances, setFilteredFinances] = useState([]);
  const ownerId = getUserId();

  const fetchFilteredData = async () => {
    if (!ownerId) return;

    try {
      setLoading(true);
      const status = statusFilter !== 'all' ? statusFilter : '';
      console.log(statusFilter);
      const response = await fetch(
        `http://localhost:5000/api/ownerFinances/${ownerId}/filter?` +
        `start_date=${startDate}&end_date=${endDate}${status ? `&status=${status}` : ''}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch filtered data: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log(result);
      setFilteredFinances(result);
    } catch (err) {
      console.error('Error fetching filtered data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!ownerId) {
        setError('No user ID found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/ownerFinances/${ownerId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const result = await response.json();
        setData(result);
        console.log(result.finances);
        if (Array.isArray(result.finances)) {
          setFilteredFinances(result.finances);
    
          console.log('Setting filtered finances:', result.finances); // Debug log
        } else {
          console.error('Finances is not an array:', result.finances);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ownerId]);

  useEffect(() => {
    if (activeTab === 'transactions' && ownerId) {
      fetchFilteredData();
    }
  }, [startDate, endDate, statusFilter, activeTab, ownerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading finance data: {error}
      </div>
    );
  }

  const { basic_stats, monthly_data, status_distribution, pending_orders } = data;
  const pendingOrdersCount = pending_orders?.length || 0;
  const renderTransactionsTable = () => (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-green-800">Transactions</CardTitle>
        <span className="text-sm text-green-600">
          {filteredFinances.length} transactions found
        </span>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-green-100">
                <th className="text-left p-4 text-green-800 font-semibold">Transaction ID</th>
                <th className="text-left p-4 text-green-800 font-semibold">Order ID</th>
                <th className="text-left p-4 text-green-800 font-semibold">Date</th>
                <th className="text-right p-4 text-green-800 font-semibold">Amount</th>
                <th className="text-left p-4 text-green-800 font-semibold">Status</th>
                <th className="text-left p-4 text-green-800 font-semibold">Customer</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredFinances) && filteredFinances.length > 0 ? (
                filteredFinances.map((finance, index) => (
                  <tr 
                    key={finance.financeID}
                    className={`
                      border-b border-green-50 hover:bg-green-50/50 transition-colors
                      ${index % 2 === 0 ? 'bg-white/30' : 'bg-white/10'}
                    `}
                  >
                    <td className="p-4 text-green-700">{finance.financeID}</td>
                    <td className="p-4 text-green-700">{finance.orderID}</td>
                    <td className="p-4 text-green-700">
                      {new Date(finance.timestamp).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right text-green-700 font-medium">
                      ${finance.totalAmount?.toLocaleString() ?? '0'}
                    </td>
                    <td className="p-4">
                      <span className={`
                        px-3 py-1 rounded-full text-sm font-medium
                        ${finance.status?.toLowerCase() === 'delivered' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'}
                      `}>
                        {finance.status}
                      </span>
                    </td>
                    <td className="p-4 text-green-700">{finance.customerName}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
  const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
        isActive 
          ? 'bg-green-600 text-white shadow-lg scale-105' 
          : 'bg-white/80 text-green-700 hover:bg-green-50 hover:scale-102'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-semibold">{label}</span>
    </button>
  );

  const exportToCSV = () => {
    const headers = ['Transaction ID', 'Order ID', 'Date', 'Amount', 'Status'];
    const csvData = filteredFinances.map(f => 
      [f.financeID, f.orderID, new Date(f.timestamp).toLocaleDateString(), f.totalAmount, f.status]
    );
    
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 p-8">
         {/* Header Section */}
         <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">Financial Dashboard</h1>
        <p className="text-green-600">Track and manage your agricultural business finances</p>
      </div>

      {/* Navigation and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex space-x-4">
          <TabButton 
            icon={Sprout} 
            label="Dashboard" 
            isActive={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
          />
          <TabButton 
            icon={TableIcon} 
            label="Transactions" 
            isActive={activeTab === 'transactions'} 
            onClick={() => setActiveTab('transactions')}
          />
        </div>
        
        {activeTab === 'transactions' && (
          <div className="flex space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 text-green-700 rounded-lg hover:bg-green-50"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 text-green-700 rounded-lg hover:bg-green-50"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        )}
      </div>

      {activeTab === 'dashboard' ? (
        <div className="space-y-8">
          {/* Alert for Pending Orders */}
          {pendingOrdersCount > 0 && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl shadow-sm">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-amber-500 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-amber-800">Attention Needed</h3>
                  <p className="text-amber-700">
                    You have <span className="font-bold">{pendingOrdersCount}</span> pending orders that require your attention
                  </p>
                </div>
              </div>
            </div>
          )}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/50 backdrop-blur-sm border-green-100 hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Total Earnings</CardTitle>
                <Plant className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">
                  ${basic_stats.total_earnings.toLocaleString()}
                </div>
                <p className="text-xs text-green-600 mt-1">Total revenue from all sales</p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm border-green-100 hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Average Sale</CardTitle>
                <Leaf className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">
                  ${basic_stats.avg_transaction.toLocaleString()}
                </div>
                <p className="text-xs text-green-600 mt-1">Average transaction value</p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm border-green-100 hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Total Orders</CardTitle>
                <TreePine className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">
                  {basic_stats.total_transactions}
                </div>
                <p className="text-xs text-green-600 mt-1">Completed transactions</p>
              </CardContent>
            </Card>

            <Card className="bg-white/50 backdrop-blur-sm border-green-100 hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Largest Sale</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">
                  ${basic_stats.max_transaction.toLocaleString()}
                </div>
                <p className="text-xs text-green-600 mt-1">Highest single transaction</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Earnings Chart */}
            <Card className="bg-white/50 backdrop-blur-sm border-green-100">
              <CardHeader>
                <CardTitle className="text-green-800">Monthly Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthly_data}>
                      <defs>
                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CHART_GREEN} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={CHART_GREEN} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="month" stroke="#374151" />
                      <YAxis stroke="#374151" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="earnings"
                        stroke={CHART_GREEN}
                        fill="url(#colorEarnings)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Order Status Distribution */}
            <Card className="bg-white/50 backdrop-blur-sm border-green-100">
              <CardHeader>
                <CardTitle className="text-green-800">Order Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={status_distribution}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {status_distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filters Section */}
          {showFilters && (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-green-800">Filter Transactions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-2">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate}
                        className="w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-2">Order Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="all">All Statuses</option>
                    
                      <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="In_Transit">In_Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Ready_For_Delivery">Ready_For_Delivery</option>  
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Transactions Table */}
          {renderTransactionsTable()}
        </div>
      )}
    </div>
  );
};

export default FinanceDashboard;