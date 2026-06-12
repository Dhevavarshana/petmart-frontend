import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { FiTrash2 } from 'react-icons/fi';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => { api.get('/admin/users').then(r => setUsers(r.data)); }, []);

  const toggleBlock = async (id) => {
    try {
      await api.put(`/admin/users/${id}/block`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
      toast.success('User status updated');
    } catch { toast.error('Failed'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await api.delete(`/admin/users/${id}`);
    setUsers(prev => prev.filter(u => u._id !== id));
    toast.success('User deleted');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 dark:bg-gray-700">
            {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}
          </tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span></td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{u.isBlocked ? 'Blocked' : 'Active'}</span></td>
                <td className="px-4 py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => toggleBlock(u._id)} className={`text-xs px-2 py-1 rounded-lg font-medium ${u.isBlocked ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}>
                    {u.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                  <button onClick={() => deleteUser(u._id)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="text-center py-10 text-gray-500">No users found.</p>}
      </div>
    </div>
  );
}
