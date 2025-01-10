import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  AlertCircle,
  ChevronDown,
  User,
  Phone,
  MapPin
} from 'lucide-react';
import { Card } from '../components/ui/Card2';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/Dialog";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

const PendingOrders = () => {
  // Initial orders data
  const initialOrders = [
    {
      id: "ORD-001",
      product: "Organic Rice",
      quantity: "100 kg",
      price: "$250",
      customerName: "John Smith",
      customerPhone: "+1234567890",
      deliveryAddress: "123 Farm Road, Rural County",
      orderDate: "2025-01-08",
      status: "pending",
      paymentStatus: "paid"
    },
    {
      id: "ORD-002",
      product: "Fresh Tomatoes",
      quantity: "50 kg",
      price: "$175",
      customerName: "Emma Davis",
      customerPhone: "+1234567891",
      deliveryAddress: "456 Market Street, Township",
      orderDate: "2025-01-09",
      status: "processing",
      paymentStatus: "pending"
    },
    {
      id: "ORD-003",
      product: "Wheat",
      quantity: "200 kg",
      price: "$400",
      customerName: "Michael Johnson",
      customerPhone: "+1234567892",
      deliveryAddress: "789 Grain Avenue, Farmville",
      orderDate: "2025-01-10",
      status: "ready_for_delivery",
      paymentStatus: "paid"
    }
  ];

  const [orders, setOrders] = useState(initialOrders);
  const [filteredOrders, setFilteredOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    ready_for_delivery: "bg-green-100 text-green-800",
    delivered: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800"
  };

  const statusIcons = {
    pending: Clock,
    processing: Package,
    ready_for_delivery: Truck,
    delivered: CheckCircle,
    cancelled: XCircle
  };

  // Filter orders when status filter changes
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  }, [statusFilter, orders]);

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status) => {
    const StatusIcon = statusIcons[status] || AlertCircle;
    return (
      <Badge variant="outline" className={`${statusColors[status]} border-none`}>
        <StatusIcon className="w-4 h-4 mr-2" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pending Orders</h1>
            <p className="text-gray-600">Manage and update your order statuses</p>
          </div>
          
          <div className="flex gap-4">
            <Select 
              defaultValue="all" 
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="ready_for_delivery">Ready for Delivery</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <Badge variant="outline" className={order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {order.paymentStatus.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Product</p>
                      <p className="font-medium">{order.product}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Quantity</p>
                      <p className="font-medium">{order.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="font-medium">{order.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-medium">{order.orderDate}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{order.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{order.deliveryAddress}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-4">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        Update Status
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Order Status</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <Button 
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => updateOrderStatus(order.id, "processing")}
                        >
                          <Package className="w-4 h-4 mr-2" />
                          Processing
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => updateOrderStatus(order.id, "ready_for_delivery")}
                        >
                          <Truck className="w-4 h-4 mr-2" />
                          Ready for Delivery
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => updateOrderStatus(order.id, "delivered")}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Delivered
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full justify-start text-red-600"
                          onClick={() => updateOrderStatus(order.id, "cancelled")}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancel Order
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PendingOrders;