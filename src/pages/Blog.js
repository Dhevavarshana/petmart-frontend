import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const CATEGORIES = ['', 'Dog Care', 'Cat Care', 'Bird Care', 'Nutrition', 'Health', 'Training', 'General'];

export function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    api.get('/blogs', { params }).then(r => setBlogs(r.data));
  }, [category, search]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pet Care Blog 📖</h1>
      <div className="flex flex-wrap gap-3 mb-6">
        <input className="input flex-1 min-w-48" placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="input w-40" value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
        </select>
      </div>
      {blogs.length === 0 ? (
        <p className="text-center py-20 text-gray-500">No articles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(b => (
            <div key={b._id} className="card cursor-pointer group" onClick={() => navigate(`/blog/${b._id}`)}>
              <img src={b.image || 'https://placehold.co/400x200?text=Blog'} alt={b.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="p-4">
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">{b.category}</span>
                <h3 className="font-bold mt-2 line-clamp-2">{b.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{b.excerpt}</p>
                <p className="text-xs text-gray-400 mt-2">By {b.author?.name} · {new Date(b.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/blogs/${id}`).then(r => setBlog(r.data));
  }, [id]);

  const submitComment = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/blogs/${id}/comments`, { text: comment });
      toast.success('Comment added!');
      setComment('');
      api.get(`/blogs/${id}`).then(r => setBlog(r.data));
    } catch { toast.error('Failed to comment'); }
  };

  if (!blog) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <img src={blog.image || 'https://placehold.co/800x400?text=Blog'} alt={blog.title} className="w-full h-64 object-cover rounded-2xl mb-6" />
      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">{blog.category}</span>
      <h1 className="text-3xl font-bold mt-3 mb-2">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-6">By {blog.author?.name} · {new Date(blog.createdAt).toLocaleDateString()}</p>
      <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{blog.content}</div>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Comments ({blog.comments?.length})</h2>
        {blog.comments?.map((c, i) => (
          <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-3">
            <p className="font-semibold text-sm">{c.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{c.text}</p>
          </div>
        ))}
        {user && (
          <form onSubmit={submitComment} className="mt-4 space-y-3">
            <textarea className="input" rows={3} placeholder="Write a comment..." value={comment} onChange={e => setComment(e.target.value)} required />
            <button type="submit" className="btn-primary">Post Comment</button>
          </form>
        )}
      </div>
    </div>
  );
}
