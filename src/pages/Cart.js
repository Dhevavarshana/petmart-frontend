import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, removeFromCart, updateQty, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cart.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="text-6xl mb-4">🛒</p>
      <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
      <button onClick={() => navigate('/products')} className="btn-primary mt-4">Shop Now</button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item._id} className="card p-4 flex gap-4">
              <img src={item.images?.[0] || 'https://placehold.co/80x80'} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                <p className="text-orange-500 font-bold mt-1">₹{item.price?.toLocaleString()}</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-600"><FiTrash2 /></button>
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-2 py-1">
                  <button onClick={() => item.qty > 1 ? updateQty(item._id, item.qty - 1) : removeFromCart(item._id)} className="hover:text-orange-500"><FiMinus size={14} /></button>
                  <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                  <button onClick={() => updateQty(item._id, item.qty + 1)} className="hover:text-orange-500"><FiPlus size={14} /></button>
                </div>
                <p className="text-sm font-semibold">₹{(item.price * item.qty).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 h-fit space-y-4">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{total.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">FREE</span></div>
            <div className="border-t dark:border-gray-700 pt-2 flex justify-between font-bold text-lg">
              <span>Total</span><span className="text-orange-500">₹{total.toLocaleString()}</span>
            </div>
          </div>
          <button
            onClick={() => user ? navigate('/checkout') : navigate('/login')}
            className="btn-primary w-full py-3"
          >
            {user ? 'Proceed to Checkout' : 'Login to Checkout'}
          </button>
          <button onClick={clearCart} className="btn-secondary w-full py-2 text-sm">Clear Cart</button>
        </div>
      </div>
    </div>
  );
}
