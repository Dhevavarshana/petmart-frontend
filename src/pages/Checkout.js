import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ address: '', city: '', state: '', pincode: '', phone: '', paymentMethod: 'COD' });

  const f = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const items = cart.map(i => ({ product: i._id, name: i.name, image: i.images?.[0], price: i.price, quantity: i.qty }));
      const { data } = await api.post('/orders', {
        items, shippingAddress: { address: form.address, city: form.city, state: form.state, pincode: form.pincode, phone: form.phone },
        paymentMethod: form.paymentMethod, totalPrice: total,
      });
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${data._id}`);
    } catch {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
          <div className="card p-5 space-y-4">
            <h2 className="text-xl font-semibold">Shipping Address</h2>
            <input className="input" placeholder="Full address" value={form.address} onChange={f('address')} required />
            <div className="grid grid-cols-2 gap-3">
              <input className="input" placeholder="City" value={form.city} onChange={f('city')} required />
              <input className="input" placeholder="State" value={form.state} onChange={f('state')} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input className="input" placeholder="Pincode" value={form.pincode} onChange={f('pincode')} required />
              <input className="input" placeholder="Phone" value={form.phone} onChange={f('phone')} required />
            </div>
          </div>
          <div className="card p-5 space-y-3">
            <h2 className="text-xl font-semibold">Payment Method</h2>
            {['COD', 'Online'].map(m => (
              <label key={m} className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="payment" value={m} checked={form.paymentMethod === m} onChange={f('paymentMethod')} className="accent-orange-500" />
                <span>{m === 'COD' ? '💵 Cash on Delivery' : '💳 Online Payment'}</span>
              </label>
            ))}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-lg">
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 h-fit space-y-3">
          <h2 className="text-lg font-bold">Order Items ({cart.length})</h2>
          {cart.map(i => (
            <div key={i._id} className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">{i.name} x{i.qty}</span>
              <span>₹{(i.price * i.qty).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t dark:border-gray-700 pt-2 flex justify-between font-bold text-orange-500">
            <span>Total</span><span>₹{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
