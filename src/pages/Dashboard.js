import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
  const { user, login } = useAuth();
  const [orders, setOrders] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [tab, setTab] = useState('orders');
  const [profile, setProfile] = useState({ name: user?.name, phone: '', address: '' });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    api.get('/orders/my').then(r => setOrders(r.data));
    api.get('/adoptions/my').then(r => setAdoptions(r.data));
    api.get('/auth/profile').then(r => setProfile({ name: r.data.name, phone: r.data.phone || '', address: r.data.address || '' }));
  }, []);

  const saveProfile = async () => {
    try {
      const { data } = await api.put('/auth/profile', profile);
      login(data);
      setEditing(false);
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
  };

  const statusColor = { Pending: 'text-yellow-600', Approved: 'text-green-600', Rejected: 'text-red-600' };
  const tabs = ['orders', 'adoptions', 'profile'];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
      <div className="flex gap-2 mb-6 border-b dark:border-gray-700">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${tab === t ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{t}</button>
        ))}
      </div>

      {tab === 'orders' && (
        <div className="space-y-3">
          {orders.length === 0 ? <p className="text-gray-500">No orders yet. <Link to="/products" className="text-orange-500">Shop now</Link></p> :
            orders.map(o => (
              <Link key={o._id} to={`/orders/${o._id}`} className="card p-4 flex justify-between items-center hover:shadow-lg">
                <div>
                  <p className="font-semibold">Order #{o._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString()} · {o.items.length} items</p>
                </div>
                <div className="text-right">
                  <p className="text-orange-500 font-bold">₹{o.totalPrice?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{o.status}</p>
                </div>
              </Link>
            ))
          }
        </div>
      )}

      {tab === 'adoptions' && (
        <div className="space-y-3">
          {adoptions.length === 0 ? <p className="text-gray-500">No adoption requests. <Link to="/adopt" className="text-orange-500">Adopt a pet</Link></p> :
            adoptions.map(a => (
              <div key={a._id} className="card p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img src={a.pet?.images?.[0] || 'https://placehold.co/50x50'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <p className="font-semibold">{a.pet?.name} ({a.pet?.species})</p>
                    <p className="text-xs text-gray-500">{new Date(a.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${statusColor[a.status]}`}>{a.status}</span>
              </div>
            ))
          }
        </div>
      )}

      {tab === 'profile' && (
        <div className="max-w-md space-y-4">
          <input className="input" placeholder="Full Name" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} disabled={!editing} />
          <input className="input opacity-60" value={user?.email} disabled />
          <input className="input" placeholder="Phone" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} disabled={!editing} />
          <input className="input" placeholder="Address" value={profile.address} onChange={e => setProfile(p => ({ ...p, address: e.target.value }))} disabled={!editing} />
          {editing ? (
            <div className="flex gap-3">
              <button onClick={saveProfile} className="btn-primary flex-1">Save</button>
              <button onClick={() => setEditing(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="btn-primary">Edit Profile</button>
          )}
        </div>
      )}
    </div>
  );
}
