import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import toast from 'react-hot-toast';

const ProductDetailsPage = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const { addCart, cart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const itemInCart = cart.find(item => item.productId?._id === product?._id);
    setIsAdded(!!itemInCart);
  }, [cart, product?._id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-300 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed</p>
        <a href="/" className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
          Continue Shopping
        </a>
      </div>
    );
  }

  const handleAddToCart = async () => {
    try {
      await addCart(product._id, quantity);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add product to cart.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row">
            {/* Product Image */}
            <div className="lg:w-1/2 p-6 md:p-8">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-700/50">
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/800'}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-300 hover:scale-105"
                />
              </div>
              {product.images?.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {product.images.map((img, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-md border border-gray-600">
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="lg:w-1/2 p-6 md:p-8 flex flex-col">
              <div className="flex-grow">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{product.name}</h1>
                
                <div className="flex items-center mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-400 ml-2">(24 reviews)</span>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">{product.description}</p>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="ml-2 text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                  )}
                </div>

                <div className="space-y-3 mb-8">
                  {product.category && (
                    <div className="flex">
                      <span className="text-gray-400 w-24">Category</span>
                      <span className="text-gray-300">{product.category}</span>
                    </div>
                  )}
                  {product.sizes?.length > 0 && (
                    <div className="flex">
                      <span className="text-gray-400 w-24">Sizes</span>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map(size => (
                          <span key={size} className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.colors?.length > 0 && (
                    <div className="flex">
                      <span className="text-gray-400 w-24">Colors</span>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map(color => (
                          <span 
                            key={color} 
                            className="w-6 h-6 rounded-full border border-gray-600"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Add to Cart Section */}
              <div className="border-t border-gray-700 pt-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center border border-gray-600 rounded-lg bg-gray-700 overflow-hidden">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-4 py-2 text-white hover:bg-gray-600 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-white font-medium w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="px-4 py-2 text-white hover:bg-gray-600 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${isAdded
                        ? 'bg-green-600/20 text-green-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 shadow-lg'
                      }`}
                  >
                    {isAdded ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Added to Cart
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to Cart
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;