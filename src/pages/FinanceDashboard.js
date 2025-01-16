import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card2';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, DollarSign, Package, TrendingUp } from 'lucide-react';

const FinanceDashboard = () => {
  const [financeData, setFinanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  });
  const user = JSON.parse(localStorage.getItem('user'));
  const ownerId = user.userId;
  useEffect(() => {
    fetchFinanceData();
  }, [ownerId, filters]);

  const fetchFinanceData = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...filters
      }).toString();
      
      const response = await fetch(`http://localhost:5000/api/ownerFinances/${ownerId}?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setFinanceData(data.data);
      }
    } catch (error) {
      console.error('Error fetching finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriceDisplay = (itemDetails) => {
    if (itemDetails.negotiatedPrice) {
      return (
        <div>
          <span className="line-through text-gray-500">
            ${itemDetails.originalPrice.toFixed(2)}
          </span>
          <span className="ml-2 text-green-600">
            ${itemDetails.negotiatedPrice.toFixed(2)}
          </span>
        </div>
      );
    }
    return `$${itemDetails.originalPrice.toFixed(2)}`;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!financeData) {
    return <div className="text-center text-gray-500">No financial data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Monthly Revenue</p>
                <h3 className="text-2xl font-bold">
                  ${financeData.monthlySummary[0]?.total.toFixed(2)}
                </h3>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Monthly Orders</p>
                <h3 className="text-2xl font-bold">
                  {financeData.monthlySummary[0]?.orderCount}
                </h3>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Order Value</p>
                <h3 className="text-2xl font-bold">
                  ${(financeData.monthlySummary[0]?.total / financeData.monthlySummary[0]?.orderCount).toFixed(2)}
                </h3>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={financeData.monthlySummary}>
                <XAxis 
                  dataKey="monthStart" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('default', { month: 'short' })}
                />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Order ID</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Item</th>
                  <th className="px-4 py-2 text-right">Price</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {financeData.transactions.map((transaction) => (
                  <tr key={transaction.financeID} className="border-b">
                    <td className="px-4 py-2">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{transaction.orderID}</td>
                    <td className="px-4 py-2">{transaction.payerInfo.name}</td>
                    <td className="px-4 py-2">
                      {transaction.itemDetails.name} (x{transaction.itemDetails.quantity})
                    </td>
                    <td className="px-4 py-2 text-right">
                      {getPriceDisplay(transaction.itemDetails)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      ${transaction.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceDashboard;