import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/products/${id}`).then(r => setProduct(r.data));
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/products/${id}/reviews`, review);
      toast.success('Review submitted!');
      api.get(`/products/${id}`).then(r => setProduct(r.data));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  if (!product) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={product.images?.[imgIdx] || 'https://placehold.co/500x400?text=Product'} alt={product.name} className="w-full h-80 object-cover rounded-2xl" />
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, i) => (
                <img key={i} src={img} alt="" onClick={() => setImgIdx(i)} className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${i === imgIdx ? 'border-orange-500' : 'border-transparent'}`} />
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <button onClick={() => toggleWishlist(product)} className={`p-2 rounded-full border ${isWishlisted(product._id) ? 'text-red-500 border-red-300' : 'border-gray-300'}`}>
              <FiHeart fill={isWishlisted(product._id) ? 'currentColor' : 'none'} />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">{product.category} · For {product.petType}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex text-yellow-400">{[...Array(5)].map((_, i) => <FiStar key={i} size={14} fill={i < Math.round(product.rating) ? 'currentColor' : 'none'} />)}</div>
            <span className="text-sm text-gray-500">{product.rating?.toFixed(1)} ({product.numReviews} reviews)</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-3 text-sm">{product.description}</p>
          <p className="text-3xl font-bold text-orange-500 mt-4">₹{product.price?.toLocaleString()}</p>
          <p className={`text-sm mt-1 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
          </p>
          <div className="flex gap-3 mt-5">
            <button onClick={() => addToCart({ ...product, type: 'product' })} disabled={product.stock === 0} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-50">
              <FiShoppingCart /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
        {product.reviews?.length === 0 && <p className="text-gray-500 text-sm">No reviews yet.</p>}
        <div className="space-y-4 mb-6">
          {product.reviews?.map((r, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">{r.name}</span>
                <span className="text-yellow-400 text-xs">{'⭐'.repeat(r.rating)}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{r.comment}</p>
            </div>
          ))}
        </div>

        {user && (
          <form onSubmit={submitReview} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow space-y-3">
            <h3 className="font-semibold">Write a Review</h3>
            <select className="input w-32" value={review.rating} onChange={e => setReview({ ...review, rating: Number(e.target.value) })}>
              {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} ⭐</option>)}
            </select>
            <textarea className="input" rows={3} placeholder="Share your experience..." value={review.comment} onChange={e => setReview({ ...review, comment: e.target.value })} />
            <button type="submit" className="btn-primary">Submit Review</button>
          </form>
        )}
      </div>
    </div>
  );
}
