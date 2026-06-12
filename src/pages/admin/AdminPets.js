import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const empty = { name: '', species: 'Dog', breed: '', age: '', gender: 'Male', price: '', description: '', images: '', isAdoptable: false, vaccinated: false, weight: '', color: '' };

export default function AdminPets() {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { api.get('/pets').then(r => setPets(r.data)); }, []);

  const f = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, images: form.images ? form.images.split(',').map(s => s.trim()) : [] };
    try {
      if (editing) {
        const { data } = await api.put(`/pets/${editing}`, payload);
        setPets(prev => prev.map(p => p._id === editing ? data : p));
        toast.success('Pet updated!');
      } else {
        const { data } = await api.post('/pets', payload);
        setPets(prev => [data, ...prev]);
        toast.success('Pet added!');
      }
      setForm(empty); setEditing(null); setShowForm(false);
    } catch { toast.error('Failed to save'); }
  };

  const deletePet = async (id) => {
    if (!window.confirm('Delete this pet?')) return;
    await api.delete(`/pets/${id}`);
    setPets(prev => prev.filter(p => p._id !== id));
    toast.success('Deleted');
  };

  const startEdit = (pet) => {
    setForm({ ...pet, images: pet.images?.join(', ') || '' });
    setEditing(pet._id); setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Pets</h1>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }} className="btn-primary flex items-center gap-2"><FiPlus /> Add Pet</button>
      </div>

      {showForm && (
        <form onSubmit={save} className="card p-5 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <h2 className="col-span-full text-lg font-semibold">{editing ? 'Edit Pet' : 'Add New Pet'}</h2>
          {[['name', 'text', 'Name'], ['breed', 'text', 'Breed'], ['age', 'number', 'Age (years)'], ['price', 'number', 'Price (₹)'], ['weight', 'number', 'Weight (kg)'], ['color', 'text', 'Color']].map(([k, t, p]) => (
            <input key={k} className="input" type={t} placeholder={p} value={form[k]} onChange={f(k)} />
          ))}
          <select className="input" value={form.species} onChange={f('species')}>
            {['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Other'].map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="input" value={form.gender} onChange={f('gender')}>
            <option>Male</option><option>Female</option>
          </select>
          <input className="input col-span-full" placeholder="Image URLs (comma separated)" value={form.images} onChange={f('images')} />
          <textarea className="input col-span-full" rows={2} placeholder="Description" value={form.description} onChange={f('description')} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isAdoptable} onChange={f('isAdoptable')} className="accent-orange-500" /> Adoptable</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.vaccinated} onChange={f('vaccinated')} className="accent-orange-500" /> Vaccinated</label>
          <div className="col-span-full flex gap-3">
            <button type="submit" className="btn-primary">{editing ? 'Update' : 'Add'} Pet</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            {['Name', 'Species', 'Breed', 'Age', 'Price', 'Status', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}
          </tr></thead>
          <tbody>
            {pets.map(p => (
              <tr key={p._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{p.species}</td>
                <td className="px-4 py-3">{p.breed}</td>
                <td className="px-4 py-3">{p.age} yrs</td>
                <td className="px-4 py-3 text-orange-500">₹{p.price?.toLocaleString()}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${p.isAdoptable ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{p.isAdoptable ? 'Adoptable' : 'For Sale'}</span></td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => startEdit(p)} className="text-blue-500 hover:text-blue-700"><FiEdit /></button>
                  <button onClick={() => deletePet(p._id)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pets.length === 0 && <p className="text-center py-10 text-gray-500">No pets found.</p>}
      </div>
    </div>
  );
}
