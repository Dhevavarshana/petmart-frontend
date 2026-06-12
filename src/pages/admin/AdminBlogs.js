import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const empty = { title: '', content: '', excerpt: '', image: '', category: 'General', tags: '' };
const CATEGORIES = ['Dog Care', 'Cat Care', 'Bird Care', 'Nutrition', 'Health', 'Training', 'General'];

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { api.get('/blogs').then(r => setBlogs(r.data)); }, []);

  const f = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, tags: form.tags ? form.tags.split(',').map(s => s.trim()) : [] };
    try {
      if (editing) {
        const { data } = await api.put(`/blogs/${editing}`, payload);
        setBlogs(prev => prev.map(b => b._id === editing ? data : b));
        toast.success('Blog updated!');
      } else {
        const { data } = await api.post('/blogs', payload);
        setBlogs(prev => [data, ...prev]);
        toast.success('Blog published!');
      }
      setForm(empty); setEditing(null); setShowForm(false);
    } catch { toast.error('Failed'); }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm('Delete blog?')) return;
    await api.delete(`/blogs/${id}`);
    setBlogs(prev => prev.filter(b => b._id !== id));
    toast.success('Deleted');
  };

  const startEdit = (b) => { setForm({ ...b, tags: b.tags?.join(', ') || '' }); setEditing(b._id); setShowForm(true); };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Blogs</h1>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }} className="btn-primary flex items-center gap-2"><FiPlus /> New Blog</button>
      </div>

      {showForm && (
        <form onSubmit={save} className="card p-5 mb-6 space-y-4">
          <h2 className="text-lg font-semibold">{editing ? 'Edit Blog' : 'New Blog Post'}</h2>
          <input className="input" placeholder="Title" value={form.title} onChange={f('title')} required />
          <input className="input" placeholder="Excerpt (short description)" value={form.excerpt} onChange={f('excerpt')} />
          <input className="input" placeholder="Cover image URL" value={form.image} onChange={f('image')} />
          <select className="input w-48" value={form.category} onChange={f('category')}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <input className="input" placeholder="Tags (comma separated)" value={form.tags} onChange={f('tags')} />
          <textarea className="input" rows={8} placeholder="Blog content..." value={form.content} onChange={f('content')} required />
          <div className="flex gap-3">
            <button type="submit" className="btn-primary">{editing ? 'Update' : 'Publish'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {blogs.map(b => (
          <div key={b._id} className="card p-4 flex items-center gap-4">
            <img src={b.image || 'https://placehold.co/80x60'} alt="" className="w-16 h-12 object-cover rounded-lg" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{b.title}</p>
              <p className="text-xs text-gray-500">{b.category} · {new Date(b.createdAt).toLocaleDateString()} · {b.comments?.length} comments</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(b)} className="text-blue-500 hover:text-blue-700"><FiEdit /></button>
              <button onClick={() => deleteBlog(b._id)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
            </div>
          </div>
        ))}
        {blogs.length === 0 && <p className="text-center py-10 text-gray-500">No blogs yet.</p>}
      </div>
    </div>
  );
}
