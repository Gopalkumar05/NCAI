// // // App.jsx
// // import React, { useState } from 'react';
// // import {
// //   ShoppingCart,
// //   Heart,
// //   Search,
// //   Menu,
// //   X,
// //   ChevronRight,
// //   Star,
// //   Truck,
// //   Shield,
// //   Sprout,
// //   Flower2
// // } from 'lucide-react';
// // import FlowerCard from './components/FlowerCard';
// // import CategoryCard from './components/CategoryCard';
// // import TestimonialCard from './components/TestimonialCard';

// // const App = () => {
// //   const [isMenuOpen, setIsMenuOpen] = useState(false);
// //   const [cartCount, setCartCount] = useState(3);
// //   const [wishlistCount, setWishlistCount] = useState(2);

// //   const featuredFlowers = [
// //     {
// //       id: 1,
// //       name: "Rose Symphony",
// //       price: 45.99,
// //       originalPrice: 59.99,
// //       rating: 4.8,
// //       reviews: 128,
// //       image: "🌹",
// //       colors: ["bg-red-500", "bg-pink-400", "bg-white"],
// //       occasion: "Romance"
// //     },
// //     {
// //       id: 2,
// //       name: "Lily Garden",
// //       price: 38.50,
// //       originalPrice: 48.50,
// //       rating: 4.6,
// //       reviews: 89,
// //       image: "🌸",
// //       colors: ["bg-white", "bg-purple-300", "bg-pink-300"],
// //       occasion: "Birthday"
// //     },
// //     {
// //       id: 3,
// //       name: "Tulip Dreams",
// //       price: 42.99,
// //       rating: 4.9,
// //       reviews: 156,
// //       image: "🌷",
// //       colors: ["bg-yellow-300", "bg-red-400", "bg-purple-400"],
// //       occasion: "Anniversary"
// //     },
// //     {
// //       id: 4,
// //       name: "Orchid Elegance",
// //       price: 65.99,
// //       originalPrice: 79.99,
// //       rating: 4.7,
// //       reviews: 76,
// //       image: "🦋",
// //       colors: ["bg-purple-200", "bg-white", "bg-pink-200"],
// //       occasion: "Luxury"
// //     }
// //   ];

// //   const categories = [
// //     { name: "Roses", count: 42, icon: "🌹", color: "bg-red-100" },
// //     { name: "Tulips", count: 28, icon: "🌷", color: "bg-yellow-100" },
// //     { name: "Lilies", count: 35, icon: "🌸", color: "bg-pink-100" },
// //     { name: "Orchids", count: 24, icon: "🦋", color: "bg-purple-100" },
// //     { name: "Sunflowers", count: 18, icon: "🌻", color: "bg-orange-100" },
// //     { name: "Seasonal", count: 56, icon: "🍂", color: "bg-green-100" }
// //   ];

// //   const testimonials = [
// //     {
// //       name: "Sarah Johnson",
// //       comment: "The flowers were absolutely stunning! Fresh and delivered right on time for my anniversary.",
// //       rating: 5,
// //       image: "👩"
// //     },
// //     {
// //       name: "Michael Chen",
// //       comment: "Perfect arrangement for my wife's birthday. She couldn't stop smiling!",
// //       rating: 5,
// //       image: "👨"
// //     },
// //     {
// //       name: "Emily Rodriguez",
// //       comment: "Professional service and breathtaking bouquets. My go-to flower shop!",
// //       rating: 4,
// //       image: "👩‍🦰"
// //     }
// //   ];

// //   const occasions = ["Birthday", "Anniversary", "Wedding", "Sympathy", "Congratulations", "Just Because"];

// //   return (
// //     <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
// //       {/* Header */}
// //       <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
// //         <div className="container mx-auto px-4 py-4">
// //           <div className="flex items-center justify-between">
// //             {/* Logo */}
// //             <div className="flex items-center space-x-2">
// //               <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
// //                 <Flower2 className="w-6 h-6 text-white" />
// //               </div>
// //               <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
// //                 BloomBox
// //               </span>
// //             </div>

// //             {/* Desktop Navigation */}
// //             <nav className="hidden md:flex items-center space-x-8">
// //               {["Home", "Shop", "Occasions", "Collections", "About"].map((item) => (
// //                 <a key={item} href="#" className="text-gray-700 hover:text-pink-600 font-medium transition-colors">
// //                   {item}
// //                 </a>
// //               ))}
// //             </nav>

// //             {/* Icons */}
// //             <div className="flex items-center space-x-6">
// //               <button className="relative p-2">
// //                 <Search className="w-5 h-5 text-gray-700" />
// //               </button>

// //               <button className="relative p-2" onClick={() => setWishlistCount(prev => prev + 1)}>
// //                 <Heart className="w-5 h-5 text-gray-700" />
// //                 {wishlistCount > 0 && (
// //                   <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
// //                     {wishlistCount}
// //                   </span>
// //                 )}
// //               </button>

// //               <button className="relative p-2" onClick={() => setCartCount(prev => prev + 1)}>
// //                 <ShoppingCart className="w-5 h-5 text-gray-700" />
// //                 {cartCount > 0 && (
// //                   <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
// //                     {cartCount}
// //                   </span>
// //                 )}
// //               </button>

// //               {/* Mobile Menu Button */}
// //               <button
// //                 className="md:hidden p-2"
// //                 onClick={() => setIsMenuOpen(!isMenuOpen)}
// //               >
// //                 {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
// //               </button>
// //             </div>
// //           </div>

// //           {/* Mobile Navigation */}
// //           {isMenuOpen && (
// //             <div className="md:hidden mt-4 pb-4">
// //               <div className="flex flex-col space-y-4">
// //                 {["Home", "Shop", "Occasions", "Collections", "About"].map((item) => (
// //                   <a key={item} href="#" className="text-gray-700 hover:text-pink-600 font-medium py-2">
// //                     {item}
// //                   </a>
// //                 ))}
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </header>

// //       {/* Hero Section */}
// //       <section className="relative overflow-hidden">
// //         <div className="container mx-auto px-4 py-12 md:py-24">
// //           <div className="grid md:grid-cols-2 gap-12 items-center">
// //             <div>
// //               <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
// //                 Let Flowers Speak
// //                 <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
// //                   What Words Cannot
// //                 </span>
// //               </h1>
// //               <p className="text-gray-600 mt-6 text-lg">
// //                 Discover the perfect bouquet for every occasion. Handcrafted with love and delivered fresh to your doorstep.
// //               </p>
// //               <div className="flex flex-wrap gap-4 mt-8">
// //                 <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
// //                   Shop Collection
// //                 </button>
// //                 <button className="border-2 border-pink-500 text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-pink-50 transition-colors">
// //                   Learn More
// //                 </button>
// //               </div>
// //             </div>

// //             <div className="relative">
// //               <div className="relative w-full h-64 md:h-96">
// //                 <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-3xl transform rotate-3"></div>
// //                 <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-3xl transform -rotate-3"></div>
// //                 <div className="absolute inset-0 bg-gradient-to-r from-pink-300/30 to-rose-300/30 rounded-3xl flex items-center justify-center">
// //                   <div className="text-8xl animate-float">💐</div>
// //                 </div>
// //               </div>

// //               {/* Floating elements */}
// //               <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center text-4xl animate-bounce-slow">
// //                 🌻
// //               </div>
// //               <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center text-3xl animate-bounce-slow-delayed">
// //                 🌹
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </section>

// //       {/* Features */}
// //       <section className="py-12 bg-white">
// //         <div className="container mx-auto px-4">
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// //             <div className="flex items-center space-x-4 p-6 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50">
// //               <Truck className="w-10 h-10 text-pink-500" />
// //               <div>
// //                 <h3 className="font-semibold text-gray-900">Free Delivery</h3>
// //                 <p className="text-gray-600 text-sm">On orders over $50</p>
// //               </div>
// //             </div>

// //             <div className="flex items-center space-x-4 p-6 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50">
// //               <Shield className="w-10 h-10 text-pink-500" />
// //               <div>
// //                 <h3 className="font-semibold text-gray-900">Fresh Guarantee</h3>
// //                 <p className="text-gray-600 text-sm">7-day freshness guarantee</p>
// //               </div>
// //             </div>

// //             <div className="flex items-center space-x-4 p-6 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50">
// //               <Sprout className="w-10 h-10 text-pink-500" />
// //               <div>
// //                 <h3 className="font-semibold text-gray-900">Eco-Friendly</h3>
// //                 <p className="text-gray-600 text-sm">Sustainable packaging</p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </section>

// //       {/* Featured Products */}
// //       <section className="py-16">
// //         <div className="container mx-auto px-4">
// //           <div className="flex justify-between items-center mb-12">
// //             <div>
// //               <h2 className="text-3xl font-bold text-gray-900">Featured Bouquets</h2>
// //               <p className="text-gray-600 mt-2">Handpicked arrangements for special moments</p>
// //             </div>
// //             <button className="flex items-center text-pink-600 font-semibold hover:text-pink-700">
// //               View All <ChevronRight className="w-5 h-5 ml-1" />
// //             </button>
// //           </div>

// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
// //             {featuredFlowers.map((flower) => (
// //               <FlowerCard key={flower.id} flower={flower} />
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* Categories */}
// //       <section className="py-16 bg-gradient-to-b from-white to-pink-50">
// //         <div className="container mx-auto px-4">
// //           <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Shop by Category</h2>

// //           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
// //             {categories.map((category, index) => (
// //               <CategoryCard key={index} category={category} />
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* Occasions */}
// //       <section className="py-16">
// //         <div className="container mx-auto px-4">
// //           <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Perfect for Every Occasion</h2>

// //           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
// //             {occasions.map((occasion, index) => (
// //               <div
// //                 key={index}
// //                 className="bg-white p-6 rounded-2xl text-center shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-pink-100 hover:border-pink-300"
// //               >
// //                 <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full flex items-center justify-center text-2xl">
// //                   {["🎂", "💝", "💒", "🕊️", "🎉", "🎁"][index]}
// //                 </div>
// //                 <h3 className="font-semibold text-gray-900">{occasion}</h3>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* Testimonials */}
// //       <section className="py-16 bg-gradient-to-r from-pink-50 to-rose-50">
// //         <div className="container mx-auto px-4">
// //           <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Customers Say</h2>

// //           <div className="grid md:grid-cols-3 gap-8">
// //             {testimonials.map((testimonial, index) => (
// //               <TestimonialCard key={index} testimonial={testimonial} />
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* Newsletter */}
// //       <section className="py-16">
// //         <div className="container mx-auto px-4">
// //           <div className="max-w-2xl mx-auto text-center">
// //             <h2 className="text-3xl font-bold text-gray-900 mb-4">
// //               Join Our Flower Club
// //             </h2>
// //             <p className="text-gray-600 mb-8">
// //               Get exclusive offers, flower care tips, and 15% off your first order
// //             </p>

// //             <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
// //               <input
// //                 type="email"
// //                 placeholder="Your email address"
// //                 className="flex-1 px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
// //               />
// //               <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-shadow">
// //                 Subscribe
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </section>

// //       {/* Footer */}
// //       <footer className="bg-gray-900 text-white py-12">
// //         <div className="container mx-auto px-4">
// //           <div className="grid md:grid-cols-4 gap-8">
// //             <div>
// //               <div className="flex items-center space-x-2 mb-6">
// //                 <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
// //                   <Flower2 className="w-6 h-6 text-white" />
// //                 </div>
// //                 <span className="text-2xl font-bold">BloomBox</span>
// //               </div>
// //               <p className="text-gray-400">
// //                 Bringing beauty and joy through nature's finest creations since 2010.
// //               </p>
// //             </div>

// //             <div>
// //               <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
// //               <ul className="space-y-2 text-gray-400">
// //                 <li><a href="#" className="hover:text-white">Shop All</a></li>
// //                 <li><a href="#" className="hover:text-white">Seasonal Collection</a></li>
// //                 <li><a href="#" className="hover:text-white">Same Day Delivery</a></li>
// //                 <li><a href="#" className="hover:text-white">Corporate Gifting</a></li>
// //               </ul>
// //             </div>

// //             <div>
// //               <h3 className="font-semibold text-lg mb-4">Support</h3>
// //               <ul className="space-y-2 text-gray-400">
// //                 <li><a href="#" className="hover:text-white">Contact Us</a></li>
// //                 <li><a href="#" className="hover:text-white">FAQ</a></li>
// //                 <li><a href="#" className="hover:text-white">Shipping Info</a></li>
// //                 <li><a href="#" className="hover:text-white">Returns</a></li>
// //               </ul>
// //             </div>

// //             <div>
// //               <h3 className="font-semibold text-lg mb-4">Contact</h3>
// //               <ul className="space-y-2 text-gray-400">
// //                 <li>123 Flower Street</li>
// //                 <li>Garden City, GC 12345</li>
// //                 <li>contact@bloombox.com</li>
// //                 <li>(555) 123-4567</li>
// //               </ul>
// //             </div>
// //           </div>

// //           <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
// //             <p>© 2024 BloomBox. All rights reserved.</p>
// //           </div>
// //         </div>
// //       </footer>
// //     </div>
// //   );
// // };

// // export default App;

// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';

// import ProtectedRoute from './components/auth/ProtectedRoute';
// import AdminLayout from './components/admin/AdminLayout';
// import Dashboard from './pages/admin/Dashboard';
// import Users from './pages/admin/Users';
// import UserDetail from './pages/admin/UserDetail';
// import Products from './pages/admin/Products';
// import Orders from './pages/admin/Orders';
// import OrderDetail from './pages/admin/OrderDetail';
// import Analytics from './pages/admin/Analytics';
// import Settings from './pages/admin/Settings';
// import Login from './pages/auth/Login';
// import Register from './pages/auth/Register';
// import ForgotPassword from './pages/auth/ForgotPassword'; // Add this
// import ResetPassword from './pages/auth/ResetPassword'; // Add this

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Add this */}
//           <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* Add this */}

//           <Route path="/admin" element={
//             <ProtectedRoute>
//               <AdminLayout />
//             </ProtectedRoute>
//           }>
//             <Route index element={<Navigate to="dashboard" />} />
//             <Route path="dashboard" element={<Dashboard />} />
//             <Route path="users" element={<Users />} />
//             <Route path="users/:id" element={<UserDetail />} />
//             <Route path="products" element={<Products />} />
//             <Route path="orders" element={<Orders />} />
//             <Route path="orders/:id" element={<OrderDetail />} />
//             <Route path="analytics" element={<Analytics />} />
//             <Route path="settings" element={<Settings />} />
//           </Route>

//           <Route path="/" element={<Navigate to="/admin/dashboard" />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";

// import ProtectedRoute from "./components/auth/ProtectedRoute";
// import AdminLayout from "./components/admin/AdminLayout";

// /* ===== Pages (pages/admin) ===== */
// import Dashboard from "./pages/admin/Dashboard";
// import Users from "./pages/admin/Users";
// import UserDetail from "./pages/admin/UserDetail";
// import Products from "./pages/admin/Products";
// import Orders from "./pages/admin/Orders";
// import OrderDetail from "./pages/admin/OrderDetail";
// import Analytics from "./pages/admin/Analytics";
// import Settings from "./pages/admin/Settings";

// import OrderConfirmation from "./pages/product/OrderConfirmation";
// import UOrders from "./pages/product/UOrders";
// import UProducts from "./pages/product/Products";
// import ProductDetail from "./pages/product/ProductDetail";
// import Cart from "./pages/product/Cart";
// import Checkout from "./pages/product/Checkout";
// /* ===== Component based pages ===== */
// import AdminDashboard from "./components/admin/Dashboard";
// import ProductsPage from "./components/admin/ProductsPage";
// import ProductForm from "./components/admin/ProductForm";

// /* ===== Auth Pages ===== */
// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";
// import ForgotPassword from "./pages/auth/ForgotPassword";
// import ResetPassword from "./pages/auth/ResetPassword";
// /* ===== User Pages ===== */
// import ULogin from "./pages/User/Login";
// import URegister from "./pages/User/Register";
// import UForgotPassword from "./pages/User/ForgotPassword";
// import UResetPassword from "./pages/User/ResetPassword";
// import UProfile from "./pages/User/Profile";
// /* ===== Public ===== */
// import Homes from "./components/Home";

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* ---------- PUBLIC ---------- */}
//           <Route
//             path="/homes"
//             element={
//               <ProtectedRoute>
//                 <Homes />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="/products" element={<UProducts />} />
//           <Route path="/product/:id" element={<ProductDetail />} />
//           {/* ---------- AUTH ---------- */}
//           <Route path="/alogin" element={<Login />} />
//           <Route path="/aregister" element={<Register />} />
//           <Route path="/aforgot-password" element={<ForgotPassword />} />
//           <Route path="/areset-password/:token" element={<ResetPassword />} />
//           {/* ---------- User ---------- */}
//           <Route path="/" element={<ULogin />} />
//           <Route path="/register" element={<URegister />} />
//           <Route path="/forgot-password" element={<UForgotPassword />} />
//           <Route
//             path="/reset-password/:resetToken"
//             element={<UResetPassword />}
//           />
//           {/* <Route path="/profile" element={<UProfile />} /> */}

//           <Route
//             path="/cart"
//             element={
//               <ProtectedRoute>
//                 <Cart />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/checkout"
//             element={
//               <ProtectedRoute>
//                 <Checkout />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/profile"
//             element={
//               <ProtectedRoute>
//                 <UProfile />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/orders"
//             element={
//               <ProtectedRoute>
//                 <UOrders />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/order-confirmation/:id"
//             element={
//               <ProtectedRoute>
//                 <OrderConfirmation />
//               </ProtectedRoute>
//             }
//           />

//           {/* ---------- ADMIN ---------- */}
//           <Route
//             path="/admin"
//             element={
//               <ProtectedRoute>
//                 <AdminLayout />
//               </ProtectedRoute>
//             }
//           >
//             {/* pages/admin */}
//             <Route index element={<Navigate to="dashboard" replace />} />
//             <Route path="dashboard" element={<Dashboard />} />
//             <Route path="users" element={<Users />} />
//             <Route path="users/:id" element={<UserDetail />} />
//             <Route path="products" element={<Products />} />
//             <Route path="orders" element={<Orders />} />
//             <Route path="orders/:id" element={<OrderDetail />} />
//             <Route path="analytics" element={<Analytics />} />
//             <Route path="settings" element={<Settings />} />

//             {/* components/admin based routes */}
//             <Route path="ui-dashboard" element={<AdminDashboard />} />
//             <Route path="products-page" element={<ProductsPage />} />
//             <Route path="product/new" element={<ProductForm />} />
//             <Route path="product/edit/:id" element={<ProductForm />} />
//           </Route>

//           {/* ---------- FALLBACK ---------- */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;


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