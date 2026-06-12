import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const TYPES = ['Vet', 'Grooming', 'Training'];
const SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

export default function Appointments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ type: 'Vet', petName: '', petType: '', date: '', timeSlot: '', notes: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) api.get('/appointments/my').then(r => setAppointments(r.data));
  }, [user]);

  const f = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setLoading(true);
    try {
      const { data } = await api.post('/appointments', form);
      setAppointments(prev => [data, ...prev]);
      toast.success('Appointment booked!');
      setForm({ type: 'Vet', petName: '', petType: '', date: '', timeSlot: '', notes: '' });
    } catch {
      toast.error('Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const statusColor = { Pending: 'bg-yellow-100 text-yellow-700', Confirmed: 'bg-green-100 text-green-700', Completed: 'bg-blue-100 text-blue-700', Cancelled: 'bg-red-100 text-red-700' };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Book an Appointment 📅</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <h2 className="text-xl font-semibold">New Appointment</h2>
          <div className="flex gap-2">
            {TYPES.map(t => (
              <button key={t} type="button" onClick={() => setForm(p => ({ ...p, type: t }))} className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${form.type === t ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-300 dark:border-gray-600 hover:border-orange-400'}`}>{t}</button>
            ))}
          </div>
          <input className="input" placeholder="Pet's name" value={form.petName} onChange={f('petName')} required />
          <input className="input" placeholder="Pet type (Dog, Cat...)" value={form.petType} onChange={f('petType')} required />
          <input className="input" type="date" value={form.date} onChange={f('date')} min={new Date().toISOString().split('T')[0]} required />
          <select className="input" value={form.timeSlot} onChange={f('timeSlot')} required>
            <option value="">Select time slot</option>
            {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <textarea className="input" rows={2} placeholder="Additional notes (optional)" value={form.notes} onChange={f('notes')} />
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>

        <div>
          <h2 className="text-xl font-semibold mb-4">My Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-gray-500 text-sm">No appointments booked yet.</p>
          ) : (
            <div className="space-y-3">
              {appointments.map(a => (
                <div key={a._id} className="card p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{a.type} — {a.petName}</p>
                      <p className="text-sm text-gray-500">{new Date(a.date).toLocaleDateString()} at {a.timeSlot}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[a.status]}`}>{a.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
