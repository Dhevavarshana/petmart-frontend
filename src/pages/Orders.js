import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const statusColor = { Pending: 'bg-yellow-100 text-yellow-700', Processing: 'bg-blue-100 text-blue-700', Shipped: 'bg-indigo-100 text-indigo-700', Delivered: 'bg-green-100 text-green-700', Cancelled: 'bg-red-100 text-red-700' };

export function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/orders/my').then(r => setOrders(r.data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders 📦</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-3">📦</p>
          <h2 className="text-xl font-bold mb-2">No orders yet</h2>
          <button onClick={() => navigate('/products')} className="btn-primary mt-3">Shop Now</button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o._id} className="card p-4 cursor-pointer hover:shadow-lg" onClick={() => navigate(`/orders/${o._id}`)}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm">Order #{o._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item(s)</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[o.status]}`}>{o.status}</span>
                  <p className="text-orange-500 font-bold mt-1">₹{o.totalPrice?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data));
  }, [id]);

  const cancelOrder = async () => {
    try {
      const { data } = await api.put(`/orders/${id}/cancel`);
      setOrder(data);
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel');
    }
  };

  if (!order) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Order #{order._id.slice(-8).toUpperCase()}</h1>
      <p className="text-gray-500 text-sm mb-6">{new Date(order.createdAt).toLocaleString()}</p>

      <div className="card p-5 mb-4 space-y-3">
        {order.items.map((item, i) => (
          <div key={i} className="flex gap-3 items-center">
            <img src={item.image || 'https://placehold.co/60x60'} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Shipping Address</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">📞 {order.shippingAddress?.phone}</p>
        </div>
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Payment</h3>
          <p className="text-sm">{order.paymentMethod}</p>
          <div className="mt-2 flex justify-between font-bold text-orange-500">
            <span>Total</span><span>₹{order.totalPrice?.toLocaleString()}</span>
          </div>
          <span className={`mt-2 inline-block text-xs px-2 py-1 rounded-full font-medium ${statusColor[order.status]}`}>{order.status}</span>
        </div>
      </div>

      {order.status === 'Pending' && (
        <button onClick={cancelOrder} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-semibold">Cancel Order</button>
      )}
    </div>
  );
}
