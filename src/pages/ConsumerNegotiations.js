import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card2';
import axios from 'axios';

const ConsumerNegotiationsPage = () => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedNegotiation, setSelectedNegotiation] = useState(null);
  const [filter, setFilter] = useState('all');
  const [negotiations, setNegotiations] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const consumerId = user.userId;

  useEffect(() => {
    fetchNegotiations();
  }, []);

  const handleFarmerClick = (farmerId) => {
    navigate(`/user-profile/${farmerId}`);
  };
  const fetchNegotiations = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/negotiations/consumer/${consumerId}`);
      if (response.data.success) {
        setNegotiations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching negotiations:', error);
    }
  };

  const filteredNegotiations = filter === 'all' 
    ? negotiations 
    : negotiations.filter(neg => neg.status === filter);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Accepted': return 'text-green-600 bg-green-50';
      case 'Rejected': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  const handleViewDetails = (negotiation) => {
    setSelectedNegotiation(negotiation);
    setShowDetailsModal(true);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const calculateDiscount = (original, new_price) => {
    const discount = ((original - new_price) / original) * 100;
    return discount.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader className="border-b border-gray-200">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                My Price Negotiation Requests
              </CardTitle>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Requests</option>
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Change</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredNegotiations.map((negotiation) => (
                    <tr key={negotiation.negotiationId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {negotiation.negotiationId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => handleFarmerClick(negotiation.farmerId)}
                          className="text-green-600 hover:text-green-900 hover:underline focus:outline-none"
                        >
                          {negotiation.farmerName}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {negotiation.itemName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {negotiation.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${negotiation.originalPrice} → ${negotiation.newPrice}
                        <span className="ml-2 text-red-600">
                          (-{calculateDiscount(negotiation.originalPrice, negotiation.newPrice)}%)
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(negotiation.status)}`}>
                          {negotiation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(negotiation)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Details Modal */}
        {showDetailsModal && selectedNegotiation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Negotiation Request Details</h3>
              <div className="space-y-3">
                <div className="mb-4">
                  {selectedNegotiation.itemImage && (
                    <img 
                      src={`data:image/jpeg;base64,${selectedNegotiation.itemImage}`}
                      alt={selectedNegotiation.itemName}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Product</p>
                  <p className="font-medium">{selectedNegotiation.itemName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Farmer</p>
                  <p className="font-medium">{selectedNegotiation.farmerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="font-medium">{selectedNegotiation.quantity} units</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Original Price</p>
                  <p className="font-medium">${selectedNegotiation.originalPrice}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Your Proposed Price</p>
                  <p className="font-medium">${selectedNegotiation.newPrice}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Requested Discount</p>
                  <p className="font-medium text-red-600">
                    {calculateDiscount(selectedNegotiation.originalPrice, selectedNegotiation.newPrice)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Request Date</p>
                  <p className="font-medium">{formatDate(selectedNegotiation.timestamp)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="font-medium">{selectedNegotiation.notes || 'No notes provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`font-medium ${getStatusColor(selectedNegotiation.status)} inline-block px-3 py-1 rounded-full`}>
                    {selectedNegotiation.status}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumerNegotiationsPage;