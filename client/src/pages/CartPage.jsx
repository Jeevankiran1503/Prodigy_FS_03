import React, { useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

const CartPage = () => {
  const { cart, fetchCart, updateCart, deleteCart } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCart(productId, newQuantity);
  };

  const handleDelete = (productId) => {
    deleteCart(productId);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      if (item.productId) {
        return total + (item.productId.price * item.quantity);
      }
      return total;
    }, 0).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
            Your Shopping Cart
          </h1>
          <p className="text-gray-400">
            {cart.length === 0 ? "Your cart is waiting to be filled" : `${cart.length} item${cart.length !== 1 ? 's' : ''} in your cart`}
          </p>
        </div>

        {/* Empty Cart State */}
        {cart.length === 0 && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-300 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Start shopping to add items to your cart</p>
            <a href="/" className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
              Continue Shopping
            </a>
          </div>
        )}

        {/* Cart Items */}
        {cart.length > 0 && (
          <div className="space-y-6">
            {cart.filter(item => item.productId).map((item) => (
              <div
                key={item.productId._id}
                className="flex flex-col sm:flex-row items-center justify-between bg-gray-800/50 border border-gray-700 p-6 rounded-xl hover:border-gray-600 transition-all duration-200 shadow-lg"
              >
                {/* Product Info */}
                <div className="flex items-center gap-6 w-full sm:w-auto mb-4 sm:mb-0">
                  <img
                    src={item.productId.imageUrl}
                    alt={item.productId.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-white hover:text-cyan-400 transition-colors">
                      {item.productId.name}
                    </h2>
                    <p className="text-sm text-gray-400 line-clamp-1">{item.productId.description}</p>
                    <p className="text-cyan-400 font-bold mt-1">₹{item.productId.price}</p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-normal">
                  <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden bg-gray-700">
                    <button
                      onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                      className="px-3 py-2 text-white hover:bg-gray-600 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-white bg-gray-800 font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                      className="px-3 py-2 text-white hover:bg-gray-600 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(item.productId._id)}
                    className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Order Summary */}
            <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-300">Order Summary</h3>
                <span className="text-gray-400">{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">₹{calculateTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-white">FREE</span>
                </div>
                <div className="flex justify-between border-t border-gray-700 pt-3">
                  <span className="text-gray-300 font-medium">Total</span>
                  <span className="text-cyan-400 font-bold text-xl">₹{calculateTotal()}</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;