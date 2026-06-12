import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import PetCard from '../components/PetCard';

const SPECIES = ['', 'Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Other'];
const GENDERS = ['', 'Male', 'Female'];

export default function Pets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: '', species: searchParams.get('species') || '', gender: '', minPrice: '', maxPrice: '', adoptable: '',
  });

  useEffect(() => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    setLoading(true);
    api.get('/pets', { params }).then(r => setPets(r.data)).finally(() => setLoading(false));
  }, [filters]);

  const f = (key, value) => setFilters(p => ({ ...p, [key]: value }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find Your Pet 🐾</h1>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow flex flex-wrap gap-3">
        <input className="input flex-1 min-w-48" placeholder="Search pets..." value={filters.search} onChange={e => f('search', e.target.value)} />
        <select className="input w-36" value={filters.species} onChange={e => f('species', e.target.value)}>
          {SPECIES.map(s => <option key={s} value={s}>{s || 'All Species'}</option>)}
        </select>
        <select className="input w-32" value={filters.gender} onChange={e => f('gender', e.target.value)}>
          {GENDERS.map(g => <option key={g} value={g}>{g || 'All Genders'}</option>)}
        </select>
        <input className="input w-28" type="number" placeholder="Min ₹" value={filters.minPrice} onChange={e => f('minPrice', e.target.value)} />
        <input className="input w-28" type="number" placeholder="Max ₹" value={filters.maxPrice} onChange={e => f('maxPrice', e.target.value)} />
        <select className="input w-36" value={filters.adoptable} onChange={e => f('adoptable', e.target.value)}>
          <option value="">All Pets</option>
          <option value="true">Adoptable Only</option>
          <option value="false">For Sale Only</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading pets...</div>
      ) : pets.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No pets found. Try different filters.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pets.map(pet => <PetCard key={pet._id} pet={pet} />)}
        </div>
      )}
    </div>
  );
}
