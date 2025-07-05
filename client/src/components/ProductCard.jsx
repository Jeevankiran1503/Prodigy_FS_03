import React, { useState, useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addCart, cart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    await toast.promise(
      addCart(product._id, quantity),
      {
        loading: 'Adding to cart...',
        success: `${product.name} added to cart!`,
        error: 'Could not add to cart.',
      }
    );
  };

  const handleImageClick = () => {
    navigate(`/product-details`, { state: { product } });
  };

  useEffect(() => {
    const itemInCart = cart.find(item => item.productId?._id === product._id);
    setIsAdded(!!itemInCart);
  }, [cart, product._id]);

  return (
    <div 
      className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div 
        className="relative aspect-square overflow-hidden cursor-pointer group"
        onClick={handleImageClick}
      >
        <img
          src={product.imageUrl || 'https://via.placeholder.com/400'}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        {product.discount && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="mb-2">
          <h3 
            className="text-lg font-semibold text-white hover:text-cyan-400 transition-colors cursor-pointer line-clamp-1"
            onClick={handleImageClick}
          >
            {product.name}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-3">{product.description}</p>
        </div>

        {/* Price */}
        <div className="mt-auto mb-4">
          {product.originalPrice ? (
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-cyan-400">₹{product.price}</span>
              <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
              {product.discount && (
                <span className="text-xs bg-green-900/30 text-green-400 px-1.5 py-0.5 rounded">
                  Save {product.discount}%
                </span>
              )}
            </div>
          ) : (
            <span className="text-xl font-bold text-cyan-400">₹{product.price}</span>
          )}
        </div>

        {/* Add to Cart */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center border border-gray-600 rounded-lg bg-gray-700 overflow-hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuantity((prev) => Math.max(1, prev - 1));
              }}
              className="px-3 py-1 text-white hover:bg-gray-600 transition-colors"
            >
              -
            </button>
            <span className="px-3 py-1 text-white font-medium text-sm w-8 text-center">
              {quantity}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuantity((prev) => prev + 1);
              }}
              className="px-3 py-1 text-white hover:bg-gray-600 transition-colors"
            >
              +
            </button>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={isAdded}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 ${
              isAdded
                ? 'bg-green-600/20 text-green-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90'
            }`}
          >
            {isAdded ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Added
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;