import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, User, Leaf } from 'lucide-react';
import { Input, Button, Form, Card, Typography, Divider, Space, Spin } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const stripePromise = loadStripe('pk_test_51OD2bKKNmXucvr4cURaDXLsokFkxDRTtHcmvAshSTuzhLNTvbTqhaYj7inP18vK97eLFGrbfNaVhLtgXLWlLI3Uk00dPwjEIUs');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1f4d28',
      '::placeholder': {
        color: '#94a3b8',
      },
    },
    invalid: {
      color: '#ba2525',
    },
  },
};

// Update the InputField component to properly handle form values
const InputField = ({ icon, label, name, ...props }) => (
  <Form.Item 
    label={label}
    name={name}  // This is crucial for form data collection
    rules={[{ required: props.required, message: `Please input your ${label.toLowerCase()}!` }]}
    className="mb-4"
  >
    <Input
      prefix={icon}
      size="large"
      {...props}
    />
  </Form.Item>
);

const CardBrandDisplay = ({ brand }) => {
  const getCardImage = () => {
    switch (brand) {
      case 'visa':
        return "data:image/svg+xml,%3Csvg width='48' height='32' viewBox='0 0 48 32' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='48' height='32' fill='%23EEF7FF'/%3E%3Cpath d='M18 21H15L17 11H20L18 21ZM31 11L28.5 18L28 16.5L26.5 11H23.5L27 21H30L34.5 11H31ZM13.5 11L10.5 17.5L9.5 12L9 11H6L8.5 21H11.5L16 11H13.5ZM37.5 11L35 21H38L40.5 11H37.5Z' fill='%231A1F71'/%3E%3C/svg%3E";
      case 'mastercard':
        return "data:image/svg+xml,%3Csvg width='48' height='32' viewBox='0 0 48 32' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='48' height='32' fill='%23EEF7FF'/%3E%3Ccircle cx='19' cy='16' r='8' fill='%23EB001B'/%3E%3Ccircle cx='29' cy='16' r='8' fill='%23F79E1B'/%3E%3Cpath d='M24 21.5C26.5 19.5 26.5 12.5 24 10.5C21.5 12.5 21.5 19.5 24 21.5Z' fill='%23FF5F00'/%3E%3C/svg%3E";
      default:
        return null;
    }
  };

  const cardImage = getCardImage();
  return cardImage ? (
    <img src={cardImage} alt={`${brand} card`} className="h-8" />
  ) : null;
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [form] = Form.useForm();
  const [cardBrand, setCardBrand] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.userId;
  const userType = user?.userType;
  const orderDetails = location.state?.orderDetails;

  useEffect(() => {
    if (!orderDetails) {
      navigate('/cart');
      toast.error('Please select items before proceeding to checkout');
    }
  }, [orderDetails, navigate]);

  useEffect(() => {
    if (elements) {
      const card = elements.getElement(CardElement);
      card.on('change', (event) => {
        setCardBrand(event.brand);
      });
    }
  }, [elements]);

  const showSuccessAlert = () => {
    Swal.fire({
      icon: 'success',
      title: 'Payment Successful!',
      text: 'Thank you for your purchase.',
      confirmButtonColor: '#16a34a',
      confirmButtonText: 'Continue Shopping',
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'rounded-lg'
      }
    }).then(() => {
      if (userType === 'Farmer') {
        navigate('/farmer-dashboard');
      } else if (userType === 'Consumer') {
        navigate('/consumer-dashboard');
      }
    });
  };

  const processPayment = async (paymentMethodId, customerDetails) => {
    try {
      const response = await fetch('http://localhost:5000/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderDetails: {
            userId: userId,
            items: orderDetails.items,
          },
          customerDetails: customerDetails
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Payment processing failed');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Failed to process payment');
    }
  };

  const onFinish = async (values) => {
    setLoading(true);

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment method with Stripe
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          address: {
            line1: values.address
          }
        }
       
      });
      
      if (error) {
        throw error;
      }
      let customerdetails= {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address
    
      }
      console.log(customerdetails);
      // Process payment and order with backend
      await processPayment(paymentMethod.id,customerdetails);

      showSuccessAlert();
      toast.success('Order processed successfully!', {
        
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme:"dark"
      });

    } catch (err) {
      toast.error(err.message || 'Payment failed. Please try again.', {
        
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme:"dark"
      });
    } finally {
      setLoading(false);
    }
  };

  // Rest of the component remains the same as before
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <ToastContainer />
      <div className="max-w-5xl mx-auto px-4">
        <Card 
          className="rounded-2xl shadow-xl overflow-hidden"
          headStyle={{ padding: 0, border: 0 }}
          bodyStyle={{ padding: 0 }}
        >
          {/* Header section */}
          <div className="bg-gradient-to-r from-green-700 to-green-600 p-8">
            <div className="flex items-center justify-center gap-3">
              <Leaf className="h-8 w-8 text-white" />
              <Title level={2} className="text-white m-0">Secure Checkout</Title>
            </div>
            <Text className="text-green-100 text-center block mt-2">
              Complete your purchase securely
            </Text>
          </div>

          <div className="p-8">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information Section */}
                <div className="space-y-6">
                  <Card className="bg-green-50" title={
                    <span className="flex items-center gap-2 text-green-800">
                      <User className="h-5 w-5" />
                      Personal Information
                    </span>
                  }>
                    <InputField
                      icon={<UserOutlined />}
                      label="Full Name"
                      name="name"
                      required
                      placeholder="John Doe"
                    />
                    
                    <InputField
                      icon={<MailOutlined />}
                      label="Email Address"
                      name="email"
                      type="email"
                      required
                      placeholder="john@example.com"
                    />
                    
                    <InputField
                      icon={<PhoneOutlined />}
                      label="Phone Number"
                      name="phone"
                      required
                      placeholder="+1 (555) 000-0000"
                    />
                    
                    <InputField
                      icon={<HomeOutlined />}
                      label="Shipping Address"
                      name="address"
                      required
                      placeholder="123 Main St, City, Country"
                    />
                  </Card>
                </div>

                {/* Payment and Order Summary Section */}
                <div className="space-y-6">
                  {/* Order Summary Card */}
                  <Card className="bg-green-50" title={
                    <span className="flex items-center gap-2 text-green-800">
                      <CreditCard className="h-5 w-5" />
                      Order Summary
                    </span>
                  }>
                    {orderDetails?.items.map((item, index) => (
                      <div key={index} className="flex justify-between mb-2">
                        <Text>{item.itemName} (x{item.quantity})</Text>
                        <Text>${(item.price * item.quantity).toFixed(2)}</Text>
                      </div>
                    ))}
                    
                    <Divider />
                    
                    <Space direction="vertical" className="w-full">
                      <div className="flex justify-between">
                        <Text>Subtotal</Text>
                        <Text>${orderDetails?.subtotal.toFixed(2)}</Text>
                      </div>
                      <div className="flex justify-between">
                        <Text>Tax</Text>
                        <Text>${orderDetails?.tax.toFixed(2)}</Text>
                      </div>
                      <Divider />
                      <div className="flex justify-between items-center">
                        <Title level={5}>Total</Title>
                        <Title level={4} className="text-green-700 m-0">
                          ${orderDetails?.total.toFixed(2)}
                        </Title>
                      </div>
                    </Space>
                  </Card>

                  {/* Payment Details Card */}
                  <Card className="bg-green-50" title={
                    <span className="flex items-center gap-2 text-green-800">
                      <CreditCard className="h-5 w-5" />
                      Payment Details
                    </span>
                  }>
                    {cardBrand && (
                      <div className="mb-4 flex justify-end">
                        <CardBrandDisplay brand={cardBrand} />
                      </div>
                    )}

                    <Form.Item label="Card Information" required>
                      <div className="bg-white p-4 border rounded-lg">
                        <CardElement options={CARD_ELEMENT_OPTIONS} />
                      </div>
                    </Form.Item>

                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      block
                      className="mt-6 bg-green-600 hover:bg-green-700 h-12"
                      icon={loading ? <Spin /> : <CreditCard className="h-5 w-5" />}
                      disabled={!stripe || loading}
                    >
                      {loading ? 'Processing...' : `Pay $${orderDetails?.total.toFixed(2)}`}
                    </Button>
                  </Card>
                </div>
              </div>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default function PaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}