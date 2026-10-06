import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import CustomerLayout from './layouts/CustomerLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Plans from './pages/Plans';
import ProductDetails from './pages/ProductDetails';
import Wallet from './pages/Wallet';
import AddCash from './pages/AddCash';
import Services from './pages/Services';
import MyProducts from './pages/services/MyProducts';
import TransactionHistory from './pages/services/TransactionHistory';
import PayoutSchedule from './pages/services/PayoutSchedule';
import Support from './pages/services/Support';
import Terms from './pages/services/Terms';
import Profile from './pages/Profile';
import ColorGame from './pages/ColorGame';
import Games from './pages/Games';
import Aviator from './pages/Aviator';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPlans from './pages/admin/AdminPlans';
import AdminWithdrawals from './pages/admin/AdminWithdrawals';
import AdminTickets from './pages/admin/AdminTickets';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTopUps from './pages/admin/AdminTopUps';

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (roleRequired && user.role !== roleRequired) return <Navigate to="/" />;
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Customer Routes inside Layout */}
        <Route path="/" element={
          <ProtectedRoute>
            <CustomerLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Home />} />
          <Route path="plans" element={<Plans />} />
          <Route path="plans/:id" element={<ProductDetails />} />
          <Route path="add-cash" element={<AddCash />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="services" element={<Services />} />
          <Route path="services/my-products" element={<MyProducts />} />
          <Route path="services/history" element={<TransactionHistory />} />
          <Route path="services/schedule" element={<PayoutSchedule />} />
          <Route path="services/support" element={<Support />} />
          <Route path="services/terms" element={<Terms />} />
          <Route path="profile" element={<Profile />} />
          <Route path="games" element={<Games />} />
          <Route path="color-game" element={<ColorGame />} />
          <Route path="aviator" element={<Aviator />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute roleRequired="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="plans" element={<AdminPlans />} />
          <Route path="topups" element={<AdminTopUps />} />
          <Route path="withdrawals" element={<AdminWithdrawals />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="tickets" element={<AdminTickets />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
