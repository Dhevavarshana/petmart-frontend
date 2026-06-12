import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const empty = { name: '', category: 'Food', petType: 'All', price: '', stock: '', description: '', images: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { api.get('/products').then(r => setProducts(r.data)); }, []);

  const f = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, images: form.images ? form.images.split(',').map(s => s.trim()) : [] };
    try {
      if (editing) {
        const { data } = await api.put(`/products/${editing}`, payload);
        setProducts(prev => prev.map(p => p._id === editing ? data : p));
        toast.success('Product updated!');
      } else {
        const { data } = await api.post('/products', payload);
        setProducts(prev => [data, ...prev]);
        toast.success('Product added!');
      }
      setForm(empty); setEditing(null); setShowForm(false);
    } catch { toast.error('Failed to save'); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete?')) return;
    await api.delete(`/products/${id}`);
    setProducts(prev => prev.filter(p => p._id !== id));
    toast.success('Deleted');
  };

  const startEdit = (p) => { setForm({ ...p, images: p.images?.join(', ') || '' }); setEditing(p._id); setShowForm(true); };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }} className="btn-primary flex items-center gap-2"><FiPlus /> Add Product</button>
      </div>

      {showForm && (
        <form onSubmit={save} className="card p-5 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <h2 className="col-span-full text-lg font-semibold">{editing ? 'Edit Product' : 'Add Product'}</h2>
          <input className="input col-span-full" placeholder="Product name" value={form.name} onChange={f('name')} required />
          <select className="input" value={form.category} onChange={f('category')}>
            {['Food', 'Toys', 'Accessories', 'Grooming', 'Medicine', 'Other'].map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="input" value={form.petType} onChange={f('petType')}>
            {['All', 'Dog', 'Cat', 'Bird', 'Fish'].map(p => <option key={p}>{p}</option>)}
          </select>
          <input className="input" type="number" placeholder="Price (₹)" value={form.price} onChange={f('price')} required />
          <input className="input" type="number" placeholder="Stock quantity" value={form.stock} onChange={f('stock')} required />
          <input className="input col-span-full" placeholder="Image URLs (comma separated)" value={form.images} onChange={f('images')} />
          <textarea className="input col-span-full" rows={2} placeholder="Description" value={form.description} onChange={f('description')} />
          <div className="col-span-full flex gap-3">
            <button type="submit" className="btn-primary">{editing ? 'Update' : 'Add'} Product</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 dark:bg-gray-700">
            {['Name', 'Category', 'Pet Type', 'Price', 'Stock', 'Rating', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}
          </tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">{p.petType}</td>
                <td className="px-4 py-3 text-orange-500">₹{p.price?.toLocaleString()}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.stock}</span></td>
                <td className="px-4 py-3">⭐ {p.rating?.toFixed(1)}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => startEdit(p)} className="text-blue-500 hover:text-blue-700"><FiEdit /></button>
                  <button onClick={() => deleteProduct(p._id)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="text-center py-10 text-gray-500">No products found.</p>}
      </div>
    </div>
  );
}
