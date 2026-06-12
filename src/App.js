import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Pets from './pages/Pets';
import PetDetail from './pages/PetDetail';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Adopt from './pages/Adopt';
import Appointments from './pages/Appointments';
import { Orders, OrderDetail } from './pages/Orders';
import { Blog, BlogDetail } from './pages/Blog';
import Dashboard from './pages/Dashboard';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPets from './pages/admin/AdminPets';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAdoptions from './pages/admin/AdminAdoptions';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminBlogs from './pages/admin/AdminBlogs';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/pets" element={<Layout><Pets /></Layout>} />
                <Route path="/pets/:id" element={<Layout><PetDetail /></Layout>} />
                <Route path="/products" element={<Layout><Products /></Layout>} />
                <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />
                <Route path="/cart" element={<Layout><Cart /></Layout>} />
                <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />
                <Route path="/adopt" element={<Layout><Adopt /></Layout>} />
                <Route path="/blog" element={<Layout><Blog /></Layout>} />
                <Route path="/blog/:id" element={<Layout><BlogDetail /></Layout>} />
                <Route path="/appointments" element={<Layout><Appointments /></Layout>} />

                {/* Protected user routes */}
                <Route path="/checkout" element={<ProtectedRoute><Layout><Checkout /></Layout></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Layout><Orders /></Layout></ProtectedRoute>} />
                <Route path="/orders/:id" element={<ProtectedRoute><Layout><OrderDetail /></Layout></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />

                {/* Admin routes */}
                <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="pets" element={<AdminPets />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="adoptions" element={<AdminAdoptions />} />
                  <Route path="appointments" element={<AdminAppointments />} />
                  <Route path="blogs" element={<AdminBlogs />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
