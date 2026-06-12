import { useEffect, useState } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['', 'Food', 'Toys', 'Accessories', 'Grooming', 'Medicine', 'Other'];
const PET_TYPES = ['', 'Dog', 'Cat', 'Bird', 'Fish', 'All'];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '', petType: '', minPrice: '', maxPrice: '' });

  useEffect(() => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    setLoading(true);
    api.get('/products', { params }).then(r => setProducts(r.data)).finally(() => setLoading(false));
  }, [filters]);

  const f = (key, value) => setFilters(p => ({ ...p, [key]: value }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pet Store 🛒</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow flex flex-wrap gap-3">
        <input className="input flex-1 min-w-48" placeholder="Search products..." value={filters.search} onChange={e => f('search', e.target.value)} />
        <select className="input w-36" value={filters.category} onChange={e => f('category', e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
        </select>
        <select className="input w-32" value={filters.petType} onChange={e => f('petType', e.target.value)}>
          {PET_TYPES.map(p => <option key={p} value={p}>{p || 'All Pets'}</option>)}
        </select>
        <input className="input w-28" type="number" placeholder="Min ₹" value={filters.minPrice} onChange={e => f('minPrice', e.target.value)} />
        <input className="input w-28" type="number" placeholder="Max ₹" value={filters.maxPrice} onChange={e => f('maxPrice', e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
