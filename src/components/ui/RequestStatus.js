import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card2';
import { AlertCircle, CheckCircle, Clock, MapPin, Phone, Calendar } from 'lucide-react';

const RequestStatus = ({ userId }) => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/iot-request/${userId}`);
        const data = await response.json();
        
        if (response.ok) {
          setRequest(data.data);
        } else {
          setError(data.error || 'Failed to fetch request status');
        }
      } catch (err) {
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-100 to-white">
        <div className="animate-pulse flex space-x-2 items-center text-green-600">
          <Clock className="h-5 w-5" />
          <span className="text-lg font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-100 to-white p-4">
        <Card className="w-full max-w-lg shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <p className="text-lg font-medium">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status.toLowerCase()) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-white p-4 md:p-8">
      <Card className="max-w-4xl mx-auto shadow-xl">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(request.status)}
              <CardTitle className="text-2xl font-bold">IoT Integration Request</CardTitle>
            </div>
            <div className={getStatusBadge(request.status)}>
              {request.status}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Farm Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <MapPin className="h-5 w-5" />
                    <span>Farm Size: {request.farm_size} acres</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Calendar className="h-5 w-5" />
                    <span>Crop Type: {request.crop_type}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-green-800">Submission Details</h3>
                <p className="text-green-700">
                  Submitted on {new Date(request.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Phone className="h-5 w-5" />
                    <span>{request.phone_number}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <MapPin className="h-5 w-5" />
                    <span>{request.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Clock className="h-5 w-5" />
                    <span>Preferred Contact: {request.preferred_contact_time}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {request.estimated_completion_date && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold mb-2 text-blue-800">Estimated Completion</h3>
              <p className="text-blue-700">
                {new Date(request.estimated_completion_date).toLocaleDateString()}
              </p>
            </div>
          )}

          {request.notes && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Additional Notes</h3>
              <p className="text-gray-700">{request.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestStatus;