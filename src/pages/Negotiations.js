import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Eye, AlertCircle, ChevronDown, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card2';

const NegotiationsPage = () => {
  const navigate = useNavigate();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedNegotiation, setSelectedNegotiation] = useState(null);
  const [filter, setFilter] = useState('all');

  // Dummy data for negotiations
  const negotiations = [
    {
      id: "NEG001",
      requestorName: "John Smith",
      requestorId: "1",
      timestamp: "2024-01-09 14:30",
      status: "PENDING",
      details: {
        productName: "Organic Tomatoes",
        quantity: "500 kg",
        proposedPrice: "$2.5/kg",
        originalPrice: "$3/kg",
        deliveryDate: "2024-02-01",
        notes: "Bulk order for restaurant chain"
      }
    },
    {
      id: "NEG002",
      requestorName: "Sarah Johnson",
      requestorId: "2",
      timestamp: "2024-01-08 09:15",
      status: "ACCEPTED",
      details: {
        productName: "Fresh Lettuce",
        quantity: "200 kg",
        proposedPrice: "$1.8/kg",
        originalPrice: "$2/kg",
        deliveryDate: "2024-01-20",
        notes: "Weekly supply agreement"
      }
    },
    {
      id: "NEG003",
      requestorName: "Mike Wilson",
      requestorId: "3",
      timestamp: "2024-01-07 16:45",
      status: "REJECTED",
      details: {
        productName: "Organic Potatoes",
        quantity: "1000 kg",
        proposedPrice: "$1.2/kg",
        originalPrice: "$2/kg",
        deliveryDate: "2024-01-25",
        notes: "Price too low"
      }
    }
  ];

  const filteredNegotiations = filter === 'all' 
    ? negotiations 
    : negotiations.filter(neg => neg.status === filter);

  const getStatusColor = (status) => {
    switch(status) {
      case 'ACCEPTED': return 'text-green-600 bg-green-50';
      case 'REJECTED': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  const handleViewDetails = (negotiation) => {
    setSelectedNegotiation(negotiation);
    setShowDetailsModal(true);
  };

  const handleAccept = (negotiation) => {
    setSelectedNegotiation(negotiation);
    setShowConfirmModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader className="border-b border-gray-200">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Negotiations Management
              </CardTitle>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Negotiations</option>
                    <option value="PENDING">Pending</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requestor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredNegotiations.map((negotiation) => (
                    <tr key={negotiation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {negotiation.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button 
                          onClick={() => navigate(`/user-profile/${negotiation.requestorId}`)}
                          className="text-green-600 hover:text-green-800 hover:underline"
                        >
                          {negotiation.requestorName}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {negotiation.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(negotiation.status)}`}>
                          {negotiation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                        <button
                          onClick={() => handleViewDetails(negotiation)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {negotiation.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleAccept(negotiation)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        )}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Negotiation Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Product</p>
                  <p className="font-medium">{selectedNegotiation.details.productName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="font-medium">{selectedNegotiation.details.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Proposed Price</p>
                  <p className="font-medium">{selectedNegotiation.details.proposedPrice}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Original Price</p>
                  <p className="font-medium">{selectedNegotiation.details.originalPrice}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Date</p>
                  <p className="font-medium">{selectedNegotiation.details.deliveryDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="font-medium">{selectedNegotiation.details.notes}</p>
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

        {/* Confirmation Modal */}
        {showConfirmModal && selectedNegotiation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-center mb-4 text-yellow-500">
                <AlertCircle className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">Confirm Acceptance</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to accept this negotiation? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle acceptance logic here
                    setShowConfirmModal(false);
                  }}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NegotiationsPage;