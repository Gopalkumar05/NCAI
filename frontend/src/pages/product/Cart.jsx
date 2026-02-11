import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft,
  Tag,
  AlertCircle
} from 'lucide-react';

import { orderService } from '../../services/orderService';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await orderService.getCart();
      setCart(response.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      setUpdating(true);
      await orderService.updateCartItem(itemId, { quantity: newQuantity });
      await fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update quantity');
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (itemId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      try {
        await orderService.removeFromCart(itemId);
        await fetchCart();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to remove item');
      }
    }
  };

  const clearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await orderService.clearCart();
        setCart(null);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to clear cart');
      }
    }
  };

  const applyCoupon = async () => {
    try {
      setCouponError('');
      const response = await orderService.applyCoupon(couponCode);
      setAppliedCoupon(response.data);
      await fetchCart();
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
    }
  };

  const removeCoupon = async () => {
    try {
      await orderService.removeCoupon();
      setAppliedCoupon(null);
      setCouponCode('');
      await fetchCart();
    } catch (err) {
      console.error('Error removing coupon:', err);
    }
  };

  const calculateTotals = () => {
    if (!cart) return {};
    
    const subtotal = cart.totalPrice || 0;
    const shipping = subtotal > 50 || subtotal === 0 ? 0 : 9.99;
    const tax = subtotal * 0.1; // 10% tax
    const discount = appliedCoupon?.discountAmount || 0;
    const total = subtotal + shipping + tax - discount;
    
    return { subtotal, shipping, tax, discount, total };
  };

  const proceedToCheckout = () => {
    if (cart?.items?.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        icon="🛒"
        title="Your cart is empty"
        description="Add some beautiful flowers to your cart!"
        actionText="Browse Products"
        onAction={() => navigate('/products')}
      />
    );
  }

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-pink-600 hover:text-pink-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continue Shopping
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mx-auto">
            Shopping Cart
          </h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 flex items-center"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="space-y-6">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex gap-6 pb-6 border-b last:border-0">
                    <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center text-4xl">
                      {item.product?.images?.[0]?.url ? (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        '🌸'
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {item.product?.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {item.product?.category}
                          </p>
                          <div className="text-xl font-bold text-pink-600">
                            ${item.price}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-gray-400 hover:text-red-600 p-2"
                          disabled={updating}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border rounded-full p-1">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="p-2 text-gray-600 hover:text-pink-600"
                            disabled={item.quantity <= 1 || updating}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-2 text-gray-600 hover:text-pink-600"
                            disabled={item.quantity >= item.product?.stock || updating}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-xl font-bold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      
                      {item.product?.stock < item.quantity && (
                        <div className="mt-2 flex items-center text-amber-600 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Only {item.product.stock} available
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>
              
              {/* Coupon Section */}
              <div className="mb-6">
                {appliedCoupon ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-green-800">
                          Coupon Applied
                        </div>
                        <div className="text-sm text-green-600">
                          {appliedCoupon.code} - {appliedCoupon.discount}% off
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                      <button
                        onClick={applyCoupon}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <div className="text-sm text-red-600">{couponError}</div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Totals */}
              <div className="space-y-4 mb-6">
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
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${totals.tax.toFixed(2)}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${totals.discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Checkout Button */}
              <button
                onClick={proceedToCheckout}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-full font-bold text-lg hover:shadow-lg transition-shadow"
              >
                Proceed to Checkout
              </button>
              
              {/* Delivery Info */}
              <div className="mt-6 p-4 bg-pink-50 rounded-lg">
                <div className="flex items-center text-pink-600 mb-2">
                  <Tag className="w-5 h-5 mr-2" />
                  <span className="font-medium">Free Delivery</span>
                </div>
                <p className="text-sm text-gray-600">
                  Orders over $50 qualify for free shipping
                </p>
                {totals.subtotal < 50 && totals.subtotal > 0 && (
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-pink-500"
                        style={{ width: `${(totals.subtotal / 50) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Add ${(50 - totals.subtotal).toFixed(2)} more for free shipping
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;