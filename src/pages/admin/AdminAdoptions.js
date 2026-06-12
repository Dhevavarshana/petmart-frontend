import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const statusColor = { Pending: 'bg-yellow-100 text-yellow-700', Approved: 'bg-green-100 text-green-700', Rejected: 'bg-red-100 text-red-700' };

export default function AdminAdoptions() {
  const [requests, setRequests] = useState([]);
  const [note, setNote] = useState({});

  useEffect(() => { api.get('/adoptions/all').then(r => setRequests(r.data)); }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/adoptions/${id}/status`, { status, adminNote: note[id] || '' });
      setRequests(prev => prev.map(r => r._id === id ? data : r));
      toast.success(`Request ${status}`);
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Adoption Requests</h1>
      <div className="space-y-4">
        {requests.length === 0 && <p className="text-gray-500">No adoption requests yet.</p>}
        {requests.map(r => (
          <div key={r._id} className="card p-5">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <p className="font-bold">{r.fullName} <span className="text-gray-500 font-normal text-sm">— {r.email}</span></p>
                <p className="text-sm text-gray-500 mt-0.5">Pet: <span className="font-medium">{r.pet?.name} ({r.pet?.species})</span> · {new Date(r.createdAt).toLocaleDateString()}</p>
                <p className="text-sm mt-1">📞 {r.phone} · 📍 {r.address}</p>
                {r.reason && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">"{r.reason}"</p>}
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium h-fit ${statusColor[r.status]}`}>{r.status}</span>
            </div>
            {r.status === 'Pending' && (
              <div className="mt-3 flex flex-wrap gap-2 items-center">
                <input className="input flex-1 min-w-48 text-sm" placeholder="Admin note (optional)" value={note[r._id] || ''} onChange={e => setNote(p => ({ ...p, [r._id]: e.target.value }))} />
                <button onClick={() => updateStatus(r._id, 'Approved')} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium">Approve</button>
                <button onClick={() => updateStatus(r._id, 'Rejected')} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium">Reject</button>
              </div>
            )}
            {r.adminNote && <p className="text-xs text-gray-500 mt-2">Admin note: {r.adminNote}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
