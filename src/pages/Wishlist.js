import { useWishlist } from '../context/WishlistContext';
import PetCard from '../components/PetCard';
import ProductCard from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';

export default function Wishlist() {
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  if (wishlist.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="text-6xl mb-4">❤️</p>
      <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
      <button onClick={() => navigate('/pets')} className="btn-primary mt-4 mr-2">Browse Pets</button>
      <button onClick={() => navigate('/products')} className="btn-secondary mt-4">Browse Products</button>
    </div>
  );

  const pets = wishlist.filter(i => i.species);
  const products = wishlist.filter(i => !i.species);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Wishlist ❤️</h1>
      {pets.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Pets ({pets.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {pets.map(pet => <PetCard key={pet._id} pet={pet} />)}
          </div>
        </>
      )}
      {products.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Products ({products.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </>
      )}
    </div>
  );
}
