import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card2';
import  Badge  from '../components/ui/Badge';

import { Truck, Package, CheckCircle, Clock, DollarSign, Filter, Mail, Phone, MapPin, User,BadgeCheck,AlertCircle, PackageCheck,  Edit2 } from 'lucide-react';

const  PendingOrders = () => {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updating, setUpdating] = useState(null);
  const statusOptions = [
    'Pending',
    'Processing',
    'In_Transit',
    'Ready_For_Delivery',
    'Delivered'
  ];
  const user = JSON.parse(localStorage.getItem('user'));
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/ownerOrders/${user.userId}`);
        const data = await response.json();
        if (data.success) {
          setOrders(data.data);
          setFilteredOrders(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter(order => order.orderStatus.toLowerCase() === statusFilter.toLowerCase())
      );
    }
  }, [statusFilter, orders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          userId: user.userId
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        const updatedOrders = orders.map(order => 
          order.orderID === orderId 
            ? { ...order, orderStatus: newStatus }
            : order
        );
        setOrders(updatedOrders);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(null);
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'In_Transit':
        return <PackageCheck className="h-5 w-5 text-blue-600" />;
      case 'Processing':
        return <Package className="h-5 w-5 text-yellow-600" />;
      case 'Pending':
        return <Clock className="h-5 w-5 text-orange-600" />;
      case 'Ready_For_Delivery':
          return <Truck className="h-5 w-5 text-green-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status, orderStatus) => {
    const statusStyles = {
      paid: "bg-green-100 text-green-800 hover:bg-green-200",
      in_transit: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      processing: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      pending: "bg-orange-100 text-orange-800 hover:bg-orange-200",
      delivered: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      ready_for_delivery: "bg-green-100 text-green-800",
    };
    
  const statusIcons = {
    pending: Clock,
    processing: Package,
    ready_for_delivery: Truck,
    delivered: CheckCircle,
    paid:BadgeCheck,
    in_transit: PackageCheck
  };
  const StatusIcon = statusIcons[status.toLowerCase()] || AlertCircle;
  const StatusIcon2 = statusIcons[orderStatus.toLowerCase()] || AlertCircle;
    return (
      <div className="flex gap-2">
        <Badge className={`${statusStyles[status.toLowerCase()]} transition-colors duration-200`}>
        <StatusIcon className="w-4 h-4 mr-2" />
        {status}
        </Badge>
        <Badge className={`${statusStyles[orderStatus.toLowerCase()] || "bg-gray-100 text-gray-800"} transition-colors duration-200`}>
        <StatusIcon2 className="w-4 h-4 mr-2" />
      
          {orderStatus}
         
        </Badge>
      </div>
    );
  };

  const StatusUpdateSelect = ({ order }) => {
    if (order.orderStatus === 'Delivered') {
      return null;
    }

    return (
      <div className="flex items-center gap-2 mt-4">
        <Edit2 className="h-4 w-4 text-gray-500" />
        <select
          className="bg-white border border-gray-200 rounded-md px-3 py-1 text-sm text-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
          value={order.orderStatus}
          onChange={(e) => updateOrderStatus(order.orderID, e.target.value)}
          disabled={updating === order.orderID}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
        {updating === order.orderID && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
        )}
      </div>
    );
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-500 bg-red-50 p-4 rounded-lg shadow">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-800 to-blue-800 bg-clip-text text-transparent">
              Order History
            </h1>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm px-4 py-2 border border-gray-200">
                <Filter className="h-5 w-5 text-gray-500" />
                <select 
                  className="bg-transparent border-none focus:ring-0 text-sm text-gray-600"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Orders</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="In Transit">In_Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Delivered">Ready_For_Delivery</option>            
                </select>
              </div>
              
              <div className="flex items-center gap-2 bg-green-50 rounded-lg px-4 py-2">
                <Clock className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">
                  {filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card 
              key={order.orderID} 
              className="border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
            >
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Order #{order.orderID}
                </CardTitle>
                {getStatusBadge(order.status, order.orderStatus)}
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Order Details</h3>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Ordered: {new Date(order.orderDate).toLocaleDateString()}</span>
                        </p>
                        {order.orderDeliverDate && (
                          <p className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">
                              Expected Delivery: {new Date(order.orderDeliverDate).toLocaleDateString()}
                            </span>
                          </p>
                        )}
                        {order.orderStatus === 'Delivered' && order.deliveredDate && (
                          <p className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-gray-600">
                              Delivered: {new Date(order.deliveredDate).toLocaleDateString()}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Shipping Details</h3>
                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Name:</span>
                          <span>{order.fullName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Email:</span>
                          <span>{order.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Phone:</span>
                          <span>{order.phoneNum}</span>
                        </div>
                        <div className="flex gap-2">
                          <MapPin className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                          <div>
                            <span className="font-medium">Address:</span>
                            <p className="mt-1 bg-white p-2 rounded border border-gray-200">{order.shippingAddress}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Items</h3>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div 
                          key={idx} 
                          className="flex flex-col gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-green-200 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-800">{item.itemName}</p>
                              <p className="text-sm text-gray-600">Seller: {item.ownerName}</p>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              {item.negotiatedPrice ? (
                                <div className="flex flex-col items-end">
                                  <span className="text-sm text-gray-400 line-through">
                                    ${(item.originalPrice * item.quantity).toFixed(2)}
                                  </span>
                                  <span className="font-medium text-green-600">
                                    ${(item.negotiatedPrice * item.quantity).toFixed(2)}
                                  </span>
                                  <span className="text-xs text-green-600">
                                    (Negotiated)
                                  </span>
                                </div>
                              ) : (
                                <span className="font-medium text-gray-800">
                                  ${(item.originalPrice * item.quantity).toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-800">Total</span>
                          <span className="text-lg font-bold text-green-600">
                            ${order.totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-lg">
                    {getStatusIcon(order.orderStatus)}
                    <span className="text-gray-700">{order.orderStatus}</span>
                  </div>
                  <StatusUpdateSelect order={order} />
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};


export default PendingOrders;