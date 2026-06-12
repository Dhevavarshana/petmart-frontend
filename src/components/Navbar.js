import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { dark, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/pets', label: 'Pets' },
    { to: '/products', label: 'Store' },
    { to: '/adopt', label: 'Adopt' },
    { to: '/blog', label: 'Blog' },
    { to: '/appointments', label: 'Book' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
            <svg width="22" height="22" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="58" r="22" fill="white"/>
              <circle cx="28" cy="36" r="11" fill="white"/>
              <circle cx="50" cy="28" r="11" fill="white"/>
              <circle cx="72" cy="36" r="11" fill="white"/>
              <circle cx="82" cy="56" r="9" fill="white"/>
            </svg>
          </div>
          <span className="text-2xl font-black tracking-tight">
            <span className="text-orange-500">Pet</span><span className="text-gray-800 dark:text-white">Mart</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} className="text-sm font-medium hover:text-orange-500 transition-colors">{l.label}</Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
          <Link to="/wishlist" className="p-2 hover:text-orange-500"><FiHeart size={18} /></Link>
          <Link to="/cart" className="relative p-2 hover:text-orange-500">
            <FiShoppingCart size={18} />
            {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{cart.length}</span>}
          </Link>
          {user ? (
            <div className="relative">
              <button onClick={() => setDropdown(d => !d)} className="flex items-center gap-1 text-sm font-medium hover:text-orange-500">
                <FiUser size={18} /> {user.name.split(' ')[0]}
              </button>
              {dropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-1 border dark:border-gray-700">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setDropdown(false)}>Dashboard</Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setDropdown(false)}>My Orders</Link>
                  {user.role === 'admin' && <Link to="/admin" className="block px-4 py-2 text-sm text-orange-500 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setDropdown(false)}>Admin Panel</Link>}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-sm">Login</Link>
          )}
          <button className="md:hidden p-2" onClick={() => setOpen(o => !o)}>
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-4 pb-4 flex flex-col gap-3">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} className="text-sm font-medium py-1 hover:text-orange-500" onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
        </div>
      )}
    </nav>
  );
}
