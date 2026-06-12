import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function PetCard({ pet }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="card group">
      <div className="relative overflow-hidden">
        <img
          src={pet.images?.[0] || 'https://placehold.co/300x200?text=Pet'}
          alt={pet.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={() => toggleWishlist(pet)}
          className={`absolute top-2 right-2 p-2 rounded-full bg-white shadow ${isWishlisted(pet._id) ? 'text-red-500' : 'text-gray-400'}`}
        >
          <FiHeart size={16} fill={isWishlisted(pet._id) ? 'currentColor' : 'none'} />
        </button>
        {pet.isAdoptable && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">Adoptable</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg">{pet.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{pet.breed} · {pet.species}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{pet.age} yr · {pet.gender}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-orange-500 font-bold">₹{pet.price?.toLocaleString()}</span>
          <div className="flex gap-2">
            {!pet.isAdoptable && (
              <button onClick={() => addToCart({ ...pet, type: 'pet' })} className="btn-primary text-xs py-1 px-3">Add to Cart</button>
            )}
            <Link to={`/pets/${pet._id}`} className="btn-secondary text-xs py-1 px-3">View</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
