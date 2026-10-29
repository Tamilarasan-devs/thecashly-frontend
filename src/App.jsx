import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import CustomerLayout from './layouts/CustomerLayout';

// Eagerly loaded entry pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Home = lazy(() => import('./pages/Home'));

// Lazy loaded customer pages (loaded on demand)
const Plans = lazy(() => import('./pages/Plans'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Wallet = lazy(() => import('./pages/Wallet'));
const AddCash = lazy(() => import('./pages/AddCash'));
const Services = lazy(() => import('./pages/Services'));
const MyProducts = lazy(() => import('./pages/services/MyProducts'));
const TransactionHistory = lazy(() => import('./pages/services/TransactionHistory'));
const PayoutSchedule = lazy(() => import('./pages/services/PayoutSchedule'));
const Support = lazy(() => import('./pages/services/Support'));
const Terms = lazy(() => import('./pages/services/Terms'));
const ReferAndEarn = lazy(() => import('./pages/services/ReferAndEarn'));
const Profile = lazy(() => import('./pages/Profile'));
const ColorGame = lazy(() => import('./pages/ColorGame'));
const Games = lazy(() => import('./pages/Games'));
const Aviator = lazy(() => import('./pages/Aviator'));

// Lazy loaded admin layout & pages (zero overhead for regular customers)
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminPlans = lazy(() => import('./pages/admin/AdminPlans'));
const AdminWithdrawals = lazy(() => import('./pages/admin/AdminWithdrawals'));
const AdminTickets = lazy(() => import('./pages/admin/AdminTickets'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminTopUps = lazy(() => import('./pages/admin/AdminTopUps'));
const AdminPaymentSettings = lazy(() => import('./pages/admin/AdminPaymentSettings'));

const PageFallback = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#4A3AFF] border-t-transparent" />
  </div>
);

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
      <Suspense fallback={<PageFallback />}>
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
            <Route path="withdrawals" element={<Navigate to="/wallet#withdrawals" replace />} />
            <Route path="services" element={<Services />} />
            <Route path="services/my-products" element={<MyProducts />} />
            <Route path="services/history" element={<TransactionHistory />} />
            <Route path="services/withdrawals" element={<Navigate to="/services/history?tab=withdrawals" replace />} />
            <Route path="services/schedule" element={<PayoutSchedule />} />
            <Route path="services/support" element={<Support />} />
            <Route path="services/terms" element={<Terms />} />
            <Route path="services/refer-and-earn" element={<ReferAndEarn />} />
            <Route path="referral" element={<Navigate to="/services/refer-and-earn" replace />} />
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
            <Route path="payment-settings" element={<AdminPaymentSettings />} />
            <Route path="withdrawals" element={<AdminWithdrawals />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="tickets" element={<AdminTickets />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
