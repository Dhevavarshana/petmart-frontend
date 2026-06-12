import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import PetCard from '../components/PetCard';
import ProductCard from '../components/ProductCard';

const categories = [
  { label: 'Dogs', icon: '🐕', species: 'Dog' },
  { label: 'Cats', icon: '🐈', species: 'Cat' },
  { label: 'Birds', icon: '🐦', species: 'Bird' },
  { label: 'Fish', icon: '🐠', species: 'Fish' },
  { label: 'Rabbits', icon: '🐇', species: 'Rabbit' },
  { label: 'Others', icon: '🦎', species: 'Other' },
];

const testimonials = [
  { name: 'Priya S.', text: 'Found my perfect furry friend here! The adoption process was seamless.', rating: 5 },
  { name: 'Rahul M.', text: 'Amazing quality pet food and super fast delivery. Highly recommend!', rating: 5 },
  { name: 'Ananya K.', text: 'The vet booking feature saved us so much time. Love PetMart!', rating: 4 },
];

export default function Home() {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    api.get('/pets?limit=4').then(r => setFeaturedPets(r.data.slice(0, 4)));
    api.get('/products?limit=4').then(r => setFeaturedProducts(r.data.slice(0, 4)));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-900 py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-5xl font-extrabold leading-tight mb-4">
              Find Your <span className="text-orange-500">Perfect</span> Pet Companion
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">Shop premium pet products, adopt loving pets, and book expert vet appointments — all in one place.</p>
            <div className="flex gap-3 flex-wrap">
              <Link to="/pets" className="btn-primary">Browse Pets</Link>
              <Link to="/adopt" className="btn-secondary">Adopt Now</Link>
            </div>
          </div>
          <div className="flex-1 text-center text-9xl">🐾</div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Browse by Category</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map(c => (
            <Link key={c.species} to={`/pets?species=${c.species}`} className="card p-4 flex flex-col items-center gap-2 hover:border-orange-400 border border-transparent transition-colors cursor-pointer">
              <span className="text-4xl">{c.icon}</span>
              <span className="text-sm font-medium">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Pets */}
      {featuredPets.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Pets</h2>
            <Link to="/pets" className="text-orange-500 hover:underline text-sm">View All →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPets.map(pet => <PetCard key={pet._id} pet={pet} />)}
          </div>
        </section>
      )}

      {/* Adoption Banner */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12 px-4 my-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Give a Pet a Loving Home ❤️</h2>
          <p className="mb-6 text-orange-100">Hundreds of adorable pets are waiting for adoption. Make a difference today.</p>
          <Link to="/adopt" className="bg-white text-orange-500 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition-colors">Start Adoption Process</Link>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Popular Products</h2>
            <Link to="/products" className="text-orange-500 hover:underline text-sm">View All →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="bg-gray-50 dark:bg-gray-800 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card p-6">
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">{t.name[0]}</div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-yellow-400 text-xs">{'⭐'.repeat(t.rating)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
