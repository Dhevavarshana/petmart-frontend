import { createContext, useContext, useState } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (item) => {
    setWishlist(prev =>
      prev.find(i => i._id === item._id) ? prev.filter(i => i._id !== item._id) : [...prev, item]
    );
  };

  const isWishlisted = (id) => wishlist.some(i => i._id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
