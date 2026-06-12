import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const StatCard = ({ label, value, icon, color }) => (
  <div className={`card p-5 border-l-4 ${color}`}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <span className="text-4xl">{icon}</span>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setStats(r.data));
  }, []);

  if (!stats) return <div className="text-center py-20">Loading dashboard...</div>;

  const cards = [
    { label: 'Total Users', value: stats.users, icon: '👥', color: 'border-blue-500' },
    { label: 'Total Orders', value: stats.orders, icon: '📦', color: 'border-green-500' },
    { label: 'Total Revenue', value: `₹${stats.revenue?.toLocaleString()}`, icon: '💰', color: 'border-yellow-500' },
    { label: 'Pets Listed', value: stats.pets, icon: '🐾', color: 'border-orange-500' },
    { label: 'Products', value: stats.products, icon: '🛒', color: 'border-purple-500' },
    { label: 'Adoptions', value: stats.adoptions, icon: '🏡', color: 'border-red-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {cards.map(c => <StatCard key={c.label} {...c} />)}
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-gray-500 border-b dark:border-gray-700">
              <th className="text-left pb-2">Order ID</th>
              <th className="text-left pb-2">Customer</th>
              <th className="text-left pb-2">Amount</th>
              <th className="text-left pb-2">Status</th>
            </tr></thead>
            <tbody>
              {stats.recentOrders?.map(o => (
                <tr key={o._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-2">#{o._id.slice(-8).toUpperCase()}</td>
                  <td className="py-2">{o.user?.name}</td>
                  <td className="py-2 text-orange-500 font-semibold">₹{o.totalPrice?.toLocaleString()}</td>
                  <td className="py-2"><span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-600 rounded-full">{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link to="/admin/orders" className="text-orange-500 text-sm hover:underline mt-3 inline-block">View all orders →</Link>
      </div>
    </div>
  );
}
