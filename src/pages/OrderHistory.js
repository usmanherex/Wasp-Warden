import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card2';
import  BadgeComponent  from '../components/ui/Badge';
import { Truck, Package, CheckCircle, Clock } from 'lucide-react';

const OrderHistoryPage = () => {
  const { userId } = useParams();
  
  // Dummy data for orders
  const orders = [
    {
      id: "ORD-001",
      date: "2025-01-05",
      items: [
        { name: "Organic Fertilizer", quantity: 2, price: 45.99 },
        { name: "Tomato Seeds", quantity: 5, price: 12.99 }
      ],
      status: "completed",
      total: 147.93,
      deliveryDate: "2025-01-08"
    },
    {
      id: "ORD-002",
      date: "2025-01-07",
      items: [
        { name: "Garden Tools Set", quantity: 1, price: 89.99 },
        { name: "Soil pH Meter", quantity: 1, price: 29.99 }
      ],
      status: "in-transit",
      total: 119.98,
      estimatedDelivery: "2025-01-12"
    },
    {
      id: "ORD-003",
      date: "2025-01-09",
      items: [
        { name: "Pesticide Sprayer", quantity: 1, price: 159.99 },
        { name: "Organic Pest Control", quantity: 3, price: 24.99 }
      ],
      status: "completed",
      total: 234.96,
      deliveryDate: "2025-01-11"
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-transit':
        return <Truck className="h-5 w-5 text-blue-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: "bg-green-100 text-green-800",
      "in-transit": "bg-blue-100 text-blue-800"
    };

    return (
      <BadgeComponent className={`${styles[status]} px-3 py-1`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </BadgeComponent >
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-green-800">Order History</h1>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">Showing all orders</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="border border-green-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between bg-green-50 border-b border-green-100">
                <CardTitle className="text-lg text-green-800">
                  Order #{order.id}
                </CardTitle>
                {getStatusBadge(order.status)}
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Order Details</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Date: {order.date}</p>
                      <p className="text-sm text-gray-600">
                        {order.status === 'completed' 
                          ? `Delivered: ${order.deliveryDate}`
                          : `Estimated Delivery: ${order.estimatedDelivery}`}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Items</h3>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-gray-600">
                          <span>{item.name} (x{item.quantity})</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-green-100">
                        <div className="flex justify-between font-medium text-green-800">
                          <span>Total</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
                  {getStatusIcon(order.status)}
                  <span>
                    {order.status === 'completed' 
                      ? 'Order completed and delivered'
                      : 'Order is on the way'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;