

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  CheckCircle,
  Lock,
  Home,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { orderService } from '../../services/orderService';

import LoadingSpinner from '../../components/LoadingSpinner';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [userAddresses, setUserAddresses] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [taxes, setTaxes] = useState({ taxRate: 0, taxAmount: 0 });
  
  // Form data
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    phone: ''
  });
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [saveAddress, setSaveAddress] = useState(true);
  const [saveAsDefault, setSaveAsDefault] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login?redirect=checkout');
      } else {
        initializeCheckout();
      }
    }
  }, [authLoading, isAuthenticated, navigate]);

  const initializeCheckout = async () => {
    try {
      setLoading(true);
      
      // Get user addresses
      const addressesResponse = await userService.getAddresses();
      setUserAddresses(addressesResponse.data || []);
      
      // If user has addresses, set the default one
      if (addressesResponse.data && addressesResponse.data.length > 0) {
        const defaultAddress = addressesResponse.data.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
          setShippingAddress({
            street: defaultAddress.street,
            city: defaultAddress.city,
            state: defaultAddress.state,
            country: defaultAddress.country,
            zipCode: defaultAddress.zipCode,
            phone: defaultAddress.phone || user?.phone || ''
          });
        } else {
          setSelectedAddress(addressesResponse.data[0]);
          setShippingAddress({
            street: addressesResponse.data[0].street,
            city: addressesResponse.data[0].city,
            state: addressesResponse.data[0].state,
            country: addressesResponse.data[0].country,
            zipCode: addressesResponse.data[0].zipCode,
            phone: addressesResponse.data[0].phone || user?.phone || ''
          });
        }
      } else {
        // No addresses, use user's phone if available
        setShippingAddress(prev => ({
          ...prev,
          phone: user?.phone || ''
        }));
      }
      
      // Get cart
      const cartResponse = await orderService.getCart();
      const cartData = cartResponse.data || { items: [], totalPrice: 0 };
      
      // Check if cart is empty
      if (!cartData.items || cartData.items.length === 0) {
        navigate('/cart');
        return;
      }
      
      setCart(cartData);
      
      // Get shipping methods
      const shippingResponse = await orderService.getShippingMethods();
      const shippingData = shippingResponse.data || [];
      setShippingMethods(shippingData);
      
      // Set default shipping method if available
      if (shippingData.length > 0) {
        const defaultMethod = shippingData.find(m => m.isDefault) || shippingData[0];
        setSelectedShipping(defaultMethod);
        
        // Calculate shipping
        if (shippingAddress.country) {
          await calculateShipping(defaultMethod._id);
        }
      }
      
      // Get payment methods from user service
      const paymentResponse = await userService.getPaymentMethods();
      setPaymentMethods(paymentResponse.data || []);
      
    } catch (err) {
      console.error('Error initializing checkout:', err);
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const validateAddress = () => {
    const newErrors = {};
    
    if (isNewAddress) {
      if (!shippingAddress.street.trim()) newErrors.street = 'Street address is required';
      if (!shippingAddress.city.trim()) newErrors.city = 'City is required';
      if (!shippingAddress.state.trim()) newErrors.state = 'State is required';
      if (!shippingAddress.country.trim()) newErrors.country = 'Country is required';
      if (!shippingAddress.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
      if (!shippingAddress.phone.trim()) newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setShippingAddress({
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      zipCode: address.zipCode,
      phone: address.phone || user?.phone || ''
    });
    setIsNewAddress(false);
    setErrors({});
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleAddNewAddress = () => {
    setIsNewAddress(true);
    setSelectedAddress(null);
    setShippingAddress({
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      phone: user?.phone || ''
    });
    setSaveAddress(true);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    if (isNewAddress && !validateAddress()) {
      return;
    }
    
    // Save new address if needed
    if (isNewAddress && saveAddress) {
      try {
        const addressData = {
          ...shippingAddress,
          isDefault: saveAsDefault
        };
        
        await userService.addAddress(addressData);
        
        // Refresh addresses
        const addressesResponse = await userService.getAddresses();
        setUserAddresses(addressesResponse.data || []);
        
        // Find and select the newly added address
        const newAddress = addressesResponse.data.find(addr => 
          addr.street === shippingAddress.street && 
          addr.city === shippingAddress.city
        );
        
        if (newAddress) {
          setSelectedAddress(newAddress);
          setIsNewAddress(false);
        }
      } catch (err) {
        console.error('Error saving address:', err);
        alert(err.response?.data?.message || 'Failed to save address');
        return;
      }
    }
    
    // Calculate taxes
    await calculateTaxes();
    
    setStep(2);
  };

  const calculateShipping = async (shippingMethodId) => {
    if (!shippingAddress.country || !cart.totalPrice) return;
    
    try {
      const response = await orderService.calculateShipping({
        shippingMethodId,
        address: shippingAddress
      });
      
      if (selectedShipping?._id === shippingMethodId) {
        setSelectedShipping(prev => ({
          ...prev,
          price: response.data.price,
          estimatedDays: response.data.estimatedDays
        }));
      }
    } catch (err) {
      console.error('Error calculating shipping:', err);
    }
  };

  const calculateTaxes = async () => {
    if (!shippingAddress.state || !shippingAddress.country || !cart.totalPrice) return;
    
    try {
      const subtotal = cart.totalPrice;
      const shippingCost = selectedShipping?.price || 0;
      
      const response = await orderService.getTaxes({
        subtotal,
        shippingCost,
        address: shippingAddress
      });
      
      setTaxes({
        taxRate: response.data.taxRate,
        taxAmount: response.data.taxAmount
      });
    } catch (err) {
      console.error('Error calculating taxes:', err);
      // Default tax calculation
      const defaultTax = subtotal * 0.1;
      setTaxes({ taxRate: 10, taxAmount: defaultTax });
    }
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedShipping) {
      alert('Please select a shipping method');
      return;
    }
    
    setStep(3);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedShipping) {
      alert('Please select a shipping method');
      return;
    }
    
    // Validate payment method
    if (selectedPayment === 'card' && paymentMethods.length === 0) {
      alert('Please add a payment method or choose another payment option');
      return;
    }
    
    try {
      setProcessing(true);
      
      // First, validate checkout
      const validationResponse = await orderService.validateCheckout({
        shippingAddress,
        shippingMethodId: selectedShipping._id
      });
      
      if (!validationResponse.data.isValid) {
        alert(validationResponse.data.errors.join('\n'));
        return;
      }
      
      // Calculate final totals
      const subtotal = cart.totalPrice;
      const shippingPrice = selectedShipping.price || 0;
      const taxPrice = taxes.taxAmount || subtotal * 0.1;
      const totalPrice = subtotal + shippingPrice + taxPrice;
      
      let orderResponse;
      
      if (selectedPayment === 'card') {
        // Get default payment method
        const defaultPaymentMethod = paymentMethods.find(m => m.isDefault);
        
        if (!defaultPaymentMethod) {
          alert('No default payment method found. Please set a default payment method.');
          return;
        }
        
        // Create payment intent
        const paymentIntentResponse = await orderService.createPaymentIntent({
          amount: totalPrice,
          currency: 'usd',
          metadata: {
            orderType: 'standard',
            shippingMethod: selectedShipping._id,
            itemsCount: cart.items.length
          }
        });
        
        // Create order with payment intent
        const orderData = {
          shippingAddress,
          paymentMethod: selectedPayment,
          paymentIntentId: paymentIntentResponse.data.paymentIntentId,
          shippingMethodId: selectedShipping._id,
          itemsPrice: subtotal,
          taxPrice,
          shippingPrice,
          totalPrice,
          saveAddress: isNewAddress && saveAddress,
          saveAsDefault
        };
        
        orderResponse = await orderService.createOrder(orderData);
        
        // Confirm payment
        await orderService.confirmPayment({
          paymentIntentId: paymentIntentResponse.data.paymentIntentId,
          shippingAddress,
          shippingMethodId: selectedShipping._id,
          paymentMethod: selectedPayment,
          saveAddress: isNewAddress && saveAddress,
          saveAsDefault
        });
        
      } else {
        // For non-card payments (COD, PayPal)
        const orderData = {
          shippingAddress,
          paymentMethod: selectedPayment,
          shippingMethodId: selectedShipping._id,
          itemsPrice: subtotal,
          taxPrice,
          shippingPrice,
          totalPrice,
          saveAddress: isNewAddress && saveAddress,
          saveAsDefault
        };
        
        orderResponse = await orderService.createOrder(orderData);
      }
      
      // Redirect to order confirmation
      navigate(`/order-confirmation/${orderResponse.data._id}`, {
        state: {
          orderNumber: orderResponse.data.orderNumber,
          total: totalPrice,
          estimatedDelivery: selectedShipping.estimatedDays
        }
      });
      
    } catch (err) {
      console.error('Error placing order:', err);
      alert(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const calculateTotals = () => {
    const subtotal = cart.totalPrice || 0;
    const shipping = selectedShipping?.price || 0;
    const tax = taxes.taxAmount || subtotal * 0.1;
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
  };

  // Show loading spinner while auth or cart is loading
  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  const totals = calculateTotals();
  const steps = [
    { number: 1, title: 'Shipping Address', icon: MapPin },
    { number: 2, title: 'Shipping Method', icon: Truck },
    { number: 3, title: 'Payment', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between max-w-3xl mx-auto">
            {steps.map((stepItem) => {
              const Icon = stepItem.icon;
              const isActive = step === stepItem.number;
              const isCompleted = step > stepItem.number;
              
              return (
                <div key={stepItem.number} className="flex flex-col items-center">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-3
                    ${isCompleted ? 'bg-green-100 text-green-600' : ''}
                    ${isActive ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-400'}
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <span className={`
                    text-sm font-medium
                    ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-400'}
                  `}>
                    {stepItem.title}
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="max-w-3xl mx-auto mt-4">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-pink-500 transition-all duration-300"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              {step === 1 && (
                <form onSubmit={handleAddressSubmit}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Shipping Address
                  </h2>
                  
                  {/* Saved Addresses */}
                  {!isNewAddress && userAddresses.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Select a saved address
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {userAddresses.map((address) => (
                          <div
                            key={address._id}
                            onClick={() => handleAddressSelect(address)}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              selectedAddress?._id === address._id
                                ? 'border-pink-500 bg-pink-50'
                                : 'border-gray-200 hover:border-pink-300'
                            }`}
                          >
                            <div className="flex items-start">
                              <div className={`w-4 h-4 mt-1 rounded-full border-2 ${
                                selectedAddress?._id === address._id
                                  ? 'border-pink-500 bg-pink-500'
                                  : 'border-gray-300'
                              }`} />
                              <div className="ml-3 flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-gray-900">{address.street}</p>
                                    <p className="text-gray-600 text-sm">
                                      {address.city}, {address.state} {address.zipCode}
                                    </p>
                                    <p className="text-gray-600 text-sm">{address.country}</p>
                                    {address.phone && (
                                      <p className="text-gray-600 text-sm mt-1">📞 {address.phone}</p>
                                    )}
                                  </div>
                                  {address.isDefault && (
                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-pink-100 text-pink-800 rounded">
                                      <Home className="w-3 h-3 mr-1" />
                                      Default
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-center mb-6">
                        <span className="text-gray-500 mr-2">Or</span>
                        <button
                          type="button"
                          onClick={handleAddNewAddress}
                          className="text-pink-600 hover:text-pink-800 font-medium"
                        >
                          Add a new address
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Address Form (shown for new address or if no saved addresses) */}
                  {(isNewAddress || userAddresses.length === 0) && (
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          name="street"
                          value={shippingAddress.street}
                          onChange={handleAddressChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                            errors.street ? 'border-red-300' : 'border-gray-300'
                          }`}
                          required={isNewAddress}
                        />
                        {errors.street && (
                          <p className="mt-1 text-sm text-red-600">{errors.street}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={shippingAddress.city}
                          onChange={handleAddressChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                            errors.city ? 'border-red-300' : 'border-gray-300'
                          }`}
                          required={isNewAddress}
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State/Province *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={shippingAddress.state}
                          onChange={handleAddressChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                            errors.state ? 'border-red-300' : 'border-gray-300'
                          }`}
                          required={isNewAddress}
                        />
                        {errors.state && (
                          <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP/Postal Code *
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={shippingAddress.zipCode}
                          onChange={handleAddressChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                            errors.zipCode ? 'border-red-300' : 'border-gray-300'
                          }`}
                          required={isNewAddress}
                        />
                        {errors.zipCode && (
                          <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <select
                          name="country"
                          value={shippingAddress.country}
                          onChange={handleAddressChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                            errors.country ? 'border-red-300' : 'border-gray-300'
                          }`}
                          required={isNewAddress}
                        >
                          <option value="">Select Country</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="IN">India</option>
                        </select>
                        {errors.country && (
                          <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={shippingAddress.phone}
                          onChange={handleAddressChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                            errors.phone ? 'border-red-300' : 'border-gray-300'
                          }`}
                          required={isNewAddress}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Address Options */}
                  {(isNewAddress || userAddresses.length === 0) && (
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="saveAddress"
                          checked={saveAddress}
                          onChange={(e) => setSaveAddress(e.target.checked)}
                          className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                        />
                        <label htmlFor="saveAddress" className="ml-2 text-gray-700">
                          Save this address for future orders
                        </label>
                      </div>
                      
                      {saveAddress && (
                        <div className="flex items-center ml-6">
                          <input
                            type="checkbox"
                            id="saveAsDefault"
                            checked={saveAsDefault}
                            onChange={(e) => setSaveAsDefault(e.target.checked)}
                            className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                          />
                          <label htmlFor="saveAsDefault" className="ml-2 text-gray-700">
                            Set as default shipping address
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => navigate('/cart')}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50"
                    >
                      Back to Cart
                    </button>
                    <button
                      type="submit"
                      className="bg-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-600"
                    >
                      Continue to Shipping
                    </button>
                  </div>
                </form>
              )}
              
              {step === 2 && (
                <form onSubmit={handleShippingSubmit}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Shipping Method
                  </h2>
                  
                  <div className="space-y-4 mb-8">
                    {shippingMethods.length > 0 ? (
                      shippingMethods.map((method) => (
                        <div
                          key={method._id}
                          onClick={() => {
                            setSelectedShipping(method);
                            calculateShipping(method._id);
                          }}
                          className={`p-6 border rounded-2xl cursor-pointer transition-all ${
                            selectedShipping?._id === method._id
                              ? 'border-pink-500 bg-pink-50'
                              : 'border-gray-200 hover:border-pink-300'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                selectedShipping?._id === method._id
                                  ? 'border-pink-500 bg-pink-500'
                                  : 'border-gray-300'
                              }`} />
                              <div className="ml-4">
                                <h3 className="font-semibold text-gray-900">
                                  {method.name}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                  {method.description}
                                </p>
                                <p className="text-gray-500 text-sm mt-1">
                                  Estimated delivery: {method.estimatedDays} business days
                                </p>
                              </div>
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                              {method.price === 0 ? 'FREE' : `$${method.price.toFixed(2)}`}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No shipping methods available</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50"
                    >
                      Back to Address
                    </button>
                    <button
                      type="submit"
                      disabled={!selectedShipping}
                      className="bg-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              )}
              
              {step === 3 && (
                <form onSubmit={handlePaymentSubmit}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Payment Method
                  </h2>
                  
                  <div className="space-y-4 mb-8">
                    {/* Saved Payment Methods */}
                    {paymentMethods.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Saved Payment Methods
                        </h3>
                        <div className="space-y-3">
                          {paymentMethods.map((method) => (
                            <div
                              key={method.id}
                              onClick={() => {
                                setSelectedPayment('card');
                                // You might want to track which card is selected
                              }}
                              className={`p-4 border rounded-lg cursor-pointer ${
                                selectedPayment === 'card'
                                  ? 'border-pink-500 bg-pink-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center">
                                <div className={`w-4 h-4 rounded-full border-2 ${
                                  selectedPayment === 'card'
                                    ? 'border-pink-500 bg-pink-500'
                                    : 'border-gray-300'
                                }`} />
                                <div className="ml-4">
                                  <p className="font-medium text-gray-900">
                                    {method.card.brand.charAt(0).toUpperCase() + method.card.brand.slice(1)} •••• {method.card.last4}
                                  </p>
                                  <p className="text-gray-600 text-sm">
                                    Expires {method.card.expMonth}/{method.card.expYear}
                                  </p>
                                  {method.isDefault && (
                                    <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-pink-100 text-pink-800 rounded">
                                      Default
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Payment Options */}
                    <div
                      onClick={() => setSelectedPayment('card')}
                      className={`p-6 border rounded-2xl cursor-pointer transition-all ${
                        selectedPayment === 'card'
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedPayment === 'card'
                            ? 'border-pink-500 bg-pink-500'
                            : 'border-gray-300'
                        }`} />
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-900">
                            Credit/Debit Card
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {paymentMethods.length > 0
                              ? 'Use a saved card or add new'
                              : 'Add a new card for payment'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div
                      onClick={() => setSelectedPayment('paypal')}
                      className={`p-6 border rounded-2xl cursor-pointer transition-all ${
                        selectedPayment === 'paypal'
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedPayment === 'paypal'
                            ? 'border-pink-500 bg-pink-500'
                            : 'border-gray-300'
                        }`} />
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-900">
                            PayPal
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Pay with your PayPal account
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div
                      onClick={() => setSelectedPayment('cod')}
                      className={`p-6 border rounded-2xl cursor-pointer transition-all ${
                        selectedPayment === 'cod'
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedPayment === 'cod'
                            ? 'border-pink-500 bg-pink-500'
                            : 'border-gray-300'
                        }`} />
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-900">
                            Cash on Delivery
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Pay when you receive your order
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-8">
                    <Lock className="w-5 h-5 mr-2" />
                    <span className="text-sm">
                      Your payment information is secure and encrypted
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50"
                    >
                      Back to Shipping
                    </button>
                    <button
                      type="submit"
                      disabled={processing || !selectedShipping}
                      className="bg-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                          Processing...
                        </>
                      ) : (
                        `Pay $${totals.total.toFixed(2)}`
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6">
                {cart.items && cart.items.length > 0 ? (
                  cart.items.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {item.product?.images?.[0]?.url ? (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          '🌸'
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 line-clamp-1">
                          {item.product?.name}
                        </h4>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Qty: {item.quantity}</span>
                          <span>${((item.price || 0) * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No items in cart</p>
                )}
              </div>
              
              {/* Totals */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax ({taxes.taxRate.toFixed(1)}%)</span>
                  <span className="font-medium">${totals.tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${totals.total.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedPayment === 'cod' ? 'Payable on delivery' : 'Payable now'}
                  </p>
                </div>
              </div>
              
              {/* Delivery Estimate */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center text-blue-600 mb-2">
                  <Truck className="w-5 h-5 mr-2" />
                  <span className="font-medium">Delivery Estimate</span>
                </div>
                <p className="text-sm text-gray-600">
                  {selectedShipping?.estimatedDays ? (
                    <>
                      Estimated delivery: {selectedShipping.estimatedDays} business days
                      <br />
                      <span className="text-gray-500">
                        {selectedShipping.name}
                      </span>
                    </>
                  ) : (
                    'Select a shipping method'
                  )}
                </p>
              </div>
              
              {/* Shipping Address Preview */}
              {shippingAddress.street && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span className="font-medium">Shipping to</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {shippingAddress.street}<br />
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}<br />
                    {shippingAddress.country}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
