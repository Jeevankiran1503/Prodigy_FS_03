import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore';
import { Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
import CartPage from './pages/CartPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AddProducts from './pages/AddProducts';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import "./App.css"
const App = () => {
  const { user, checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth()
  }, [checkAuth]);
  return (
    <div>
      <Toaster />
      <Router>
      <Navbar/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />
          <Route path="/product/:id" element={user ? <ProductDetailsPage /> : <Navigate to="/login" />} />
          <Route path="/add-product" element={user ? <AddProducts /> : <Navigate to="/login" />} />
          <Route path="/product-details" element={user ? <ProductDetailsPage /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
