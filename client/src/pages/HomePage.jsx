import React, { useEffect, useState } from 'react';
import { useProductStore } from '../store/useProductStore';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { products, loading, error, searchProducts } = useProductStore();
  
  useEffect(() => {
    searchProducts('');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    searchProducts(searchQuery);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-4">
            Discover Premium Products
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Explore our curated collection of high-quality items tailored for your needs
          </p>
        </div>
        
        {/* Search Section */}
        <div className="mb-16 max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow bg-gray-800 text-gray-200 px-6 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-500"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 font-medium hover:opacity-90 transition-opacity"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Status Messages */}
        <div className="mb-12">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400 text-lg">Loading products...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-900/30 border border-red-800 rounded-xl p-6 max-w-2xl mx-auto text-center">
              <p className="text-red-300 font-medium">Error: {error}</p>
            </div>
          )}
          
          {products.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="text-gray-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-gray-300 mb-2">No products found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Try adjusting your search to find what you're looking for
              </p>
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products
            .filter((product) => product && product._id)
            .map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                className="transform transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl"
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;