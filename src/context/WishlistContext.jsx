import { createContext, useState, useEffect, useContext } from 'react';

const WishlistContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem('telugu_christian_wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  useEffect(() => {
    localStorage.setItem('telugu_christian_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const toggleWishlist = (product) => {
    setWishlistItems(prev => {
      const isSaved = prev.some(item => item.id === product.id);
      if (isSaved) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      toggleWishlist,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
