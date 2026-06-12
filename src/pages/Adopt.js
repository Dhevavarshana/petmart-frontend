import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Adopt() {
  const [pets, setPets] = useState([]);
  const [searchParams] = useSearchParams();
  const [selectedPet, setSelectedPet] = useState(searchParams.get('pet') || '');
  const [showForm, setShowForm] = useState(!!searchParams.get('pet'));
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: user?.name || '', email: user?.email || '', phone: '', address: '', reason: '', hasOtherPets: false });

  useEffect(() => {
    api.get('/pets?adoptable=true').then(r => setPets(r.data));
  }, []);

  const f = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!selectedPet) return toast.error('Please select a pet');
    setLoading(true);
    try {
      await api.post('/adoptions', { ...form, pet: selectedPet });
      toast.success('Adoption request submitted! We will contact you soon.');
      setShowForm(false);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Adopt a Pet 🏡</h1>
        <p className="text-gray-600 dark:text-gray-300">Give a loving home to a pet in need</p>
      </div>

      {!showForm ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map(pet => (
              <div key={pet._id} className="card p-4">
                <img src={pet.images?.[0] || 'https://placehold.co/300x200'} alt={pet.name} className="w-full h-48 object-cover rounded-xl mb-3" />
                <h3 className="font-bold text-lg">{pet.name}</h3>
                <p className="text-sm text-gray-500">{pet.breed} · {pet.age} yrs · {pet.gender}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{pet.description}</p>
                <button
                  onClick={() => { setSelectedPet(pet._id); setShowForm(true); }}
                  className="btn-primary w-full mt-4"
                >
                  Adopt {pet.name}
                </button>
              </div>
            ))}
          </div>
          {pets.length === 0 && <p className="text-center py-20 text-gray-500">No pets available for adoption right now.</p>}
        </>
      ) : (
        <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Adoption Application</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="input" placeholder="Full Name" value={form.fullName} onChange={f('fullName')} required />
            <input className="input" type="email" placeholder="Email" value={form.email} onChange={f('email')} required />
            <input className="input" placeholder="Phone Number" value={form.phone} onChange={f('phone')} required />
            <input className="input" placeholder="Home Address" value={form.address} onChange={f('address')} required />
            <textarea className="input" rows={3} placeholder="Why do you want to adopt this pet?" value={form.reason} onChange={f('reason')} />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.hasOtherPets} onChange={f('hasOtherPets')} className="accent-orange-500" />
              <span className="text-sm">I currently have other pets at home</span>
            </label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Back</button>
              <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-60">
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
