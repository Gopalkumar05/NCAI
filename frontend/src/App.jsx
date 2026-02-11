

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";

/* ===== Pages (pages/admin) ===== */
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import UserDetail from "./pages/admin/UserDetail";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import OrderDetail from "./pages/admin/OrderDetail";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";

import OrderConfirmation from "./pages/product/OrderConfirmation";
import UOrders from "./pages/product/UOrders";
import UProducts from "./pages/product/Products";
import ProductDetail from "./pages/product/ProductDetail";
import Cart from "./pages/product/Cart";
import Checkout from "./pages/product/Checkout";
import OrderDetails from './pages/product/OrderDetails'
import Invoice from './pages/product/Invoice';
/* ===== Component based pages ===== */
import AdminDashboard from "./components/admin/Dashboard";
import ProductsPage from "./components/admin/ProductsPage";
import ProductForm from "./components/admin/ProductForm";

/* ===== Auth Pages ===== */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
/* ===== User Pages ===== */
import ULogin from "./pages/User/Login";
import URegister from "./pages/User/Register";
import UForgotPassword from "./pages/User/ForgotPassword";
import UResetPassword from "./pages/User/ResetPassword";
import UProfile from "./pages/User/Profile";
/* ===== Public ===== */
import Homes from "./components/Home";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ---------- PUBLIC ---------- */}
          <Route path="/products" element={<UProducts />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          
          {/* ---------- AUTH (Admin) ---------- */}
          <Route path="/alogin" element={<Login />} />
          <Route path="/aregister" element={<Register />} />
          <Route path="/aforgot-password" element={<ForgotPassword />} />
          <Route path="/areset-password/:token" element={<ResetPassword />} />
          
          {/* ---------- AUTH (User) ---------- */}
          <Route path="/" element={<ULogin />} />
          <Route path="/register" element={<URegister />} />
          <Route path="/forgot-password" element={<UForgotPassword />} />
          <Route path="/reset-password/:resetToken" element={<UResetPassword />} />
          
          {/* ---------- USER PROTECTED ROUTES ---------- */}
          <Route path="/homes" element={
            <ProtectedRoute>
              <Homes />
            </ProtectedRoute>
          } />
          
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/orders/:id/invoice" element={
  <ProtectedRoute>
    <Invoice />
  </ProtectedRoute>
} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UProfile />
            </ProtectedRoute>
          } />
          
          <Route path="/orders/:id" element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          } />

           <Route path="/orders" element={
            <ProtectedRoute>
              <UOrders />
            </ProtectedRoute>
          } />
          
          <Route path="/order-confirmation/:id" element={
            <ProtectedRoute>
              <OrderConfirmation />
            </ProtectedRoute>
          } />
          
          {/* ---------- ADMIN PROTECTED ROUTES ---------- */}
          <Route path="/admin/*" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:id" element={<UserDetail />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="ui-dashboard" element={<AdminDashboard />} />
            <Route path="products-page" element={<ProductsPage />} />
            <Route path="product/new" element={<ProductForm />} />
            <Route path="product/edit/:id" element={<ProductForm />} />
          </Route>
          
          {/* ---------- FALLBACK ---------- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
 export default App;
