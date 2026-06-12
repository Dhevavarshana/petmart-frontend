import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export default function PetDetail() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/pets/${id}`).then(r => setPet(r.data));
  }, [id]);

  if (!pet) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={pet.images?.[imgIdx] || 'https://placehold.co/500x400?text=Pet'} alt={pet.name} className="w-full h-80 object-cover rounded-2xl" />
          {pet.images?.length > 1 && (
            <div className="flex gap-2 mt-3">
              {pet.images.map((img, i) => (
                <img key={i} src={img} alt="" onClick={() => setImgIdx(i)} className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${i === imgIdx ? 'border-orange-500' : 'border-transparent'}`} />
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">{pet.name}</h1>
            <button onClick={() => toggleWishlist(pet)} className={`p-2 rounded-full border ${isWishlisted(pet._id) ? 'text-red-500 border-red-300' : 'border-gray-300'}`}>
              <FiHeart fill={isWishlisted(pet._id) ? 'currentColor' : 'none'} />
            </button>
          </div>
          <p className="text-gray-500 mt-1">{pet.breed} · {pet.species}</p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[['Age', `${pet.age} years`], ['Gender', pet.gender], ['Weight', `${pet.weight} kg`], ['Color', pet.color]].map(([k, v]) => v && (
              <div key={k} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p className="text-xs text-gray-500">{k}</p>
                <p className="font-semibold">{v}</p>
              </div>
            ))}
          </div>
          {pet.vaccinated && <p className="mt-3 text-green-600 text-sm font-medium">✅ Vaccinated</p>}
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm">{pet.description}</p>
          <p className="text-3xl font-bold text-orange-500 mt-4">₹{pet.price?.toLocaleString()}</p>
          <div className="flex gap-3 mt-5">
            {pet.isAdoptable ? (
              <button onClick={() => user ? navigate(`/adopt?pet=${pet._id}`) : navigate('/login')} className="btn-primary flex-1 py-3">Apply for Adoption</button>
            ) : (
              <button onClick={() => addToCart({ ...pet, type: 'pet' })} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
                <FiShoppingCart /> Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
