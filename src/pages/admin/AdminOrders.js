import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const statusColor = { Pending: 'bg-yellow-100 text-yellow-700', Processing: 'bg-blue-100 text-blue-700', Shipped: 'bg-indigo-100 text-indigo-700', Delivered: 'bg-green-100 text-green-700', Cancelled: 'bg-red-100 text-red-700' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => { api.get('/orders/all').then(r => setOrders(r.data)); }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status });
      setOrders(prev => prev.map(o => o._id === id ? data : o));
      toast.success('Status updated');
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 dark:bg-gray-700">
            {['Order ID', 'Customer', 'Total', 'Payment', 'Status', 'Date', 'Update'].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}
          </tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-mono text-xs">#{o._id.slice(-8).toUpperCase()}</td>
                <td className="px-4 py-3">{o.user?.name}</td>
                <td className="px-4 py-3 font-semibold text-orange-500">₹{o.totalPrice?.toLocaleString()}</td>
                <td className="px-4 py-3">{o.paymentMethod}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[o.status]}`}>{o.status}</span></td>
                <td className="px-4 py-3 text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <select value={o.status} onChange={e => updateStatus(o._id, e.target.value)} className="text-xs border dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700">
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-center py-10 text-gray-500">No orders found.</p>}
      </div>
    </div>
  );
}
