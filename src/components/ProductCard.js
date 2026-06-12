import { Link } from 'react-router-dom';
import { FiHeart, FiStar } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="card group">
      <div className="relative overflow-hidden">
        <img
          src={product.images?.[0] || 'https://placehold.co/300x200?text=Product'}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={() => toggleWishlist(product)}
          className={`absolute top-2 right-2 p-2 rounded-full bg-white shadow ${isWishlisted(product._id) ? 'text-red-500' : 'text-gray-400'}`}
        >
          <FiHeart size={16} fill={isWishlisted(product._id) ? 'currentColor' : 'none'} />
        </button>
        {product.stock === 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">Out of Stock</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold">{product.name}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">{product.category} · {product.petType}</p>
        <div className="flex items-center gap-1 mt-1">
          <FiStar size={12} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-gray-500">{product.rating?.toFixed(1)} ({product.numReviews})</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-orange-500 font-bold">₹{product.price?.toLocaleString()}</span>
          <div className="flex gap-2">
            <button
              onClick={() => addToCart({ ...product, type: 'product' })}
              disabled={product.stock === 0}
              className="btn-primary text-xs py-1 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
            <Link to={`/products/${product._id}`} className="btn-secondary text-xs py-1 px-3">View</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
