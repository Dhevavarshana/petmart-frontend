import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
const statusColor = { Pending: 'bg-yellow-100 text-yellow-700', Confirmed: 'bg-green-100 text-green-700', Completed: 'bg-blue-100 text-blue-700', Cancelled: 'bg-red-100 text-red-700' };

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => { api.get('/appointments/all').then(r => setAppointments(r.data)); }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/appointments/${id}/status`, { status });
      setAppointments(prev => prev.map(a => a._id === id ? data : a));
      toast.success('Status updated');
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Appointments</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 dark:bg-gray-700">
            {['Customer', 'Type', 'Pet', 'Date', 'Time', 'Status', 'Update'].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}
          </tr></thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-medium">{a.user?.name}</td>
                <td className="px-4 py-3">{a.type}</td>
                <td className="px-4 py-3">{a.petName} ({a.petType})</td>
                <td className="px-4 py-3">{new Date(a.date).toLocaleDateString()}</td>
                <td className="px-4 py-3">{a.timeSlot}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[a.status]}`}>{a.status}</span></td>
                <td className="px-4 py-3">
                  <select value={a.status} onChange={e => updateStatus(a._id, e.target.value)} className="text-xs border dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700">
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {appointments.length === 0 && <p className="text-center py-10 text-gray-500">No appointments found.</p>}
      </div>
    </div>
  );
}
