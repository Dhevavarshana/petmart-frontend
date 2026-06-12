import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name: form.name, email: form.email, password: form.password });
      login(data);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const field = (key, type, placeholder) => (
    <input className="input" type={type} placeholder={placeholder} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required />
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-2">Join PetMart 🐾</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Create your account today</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {field('name', 'text', 'Full name')}
          {field('email', 'email', 'Email address')}
          {field('password', 'password', 'Password')}
          {field('confirm', 'password', 'Confirm password')}
          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 disabled:opacity-60">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-500">
          Already have an account? <Link to="/login" className="text-orange-500 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
