import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Static categories for now - can be replaced with dynamic data later
  const categories = [
    { id: 'cars', name: 'Cars', icon: '🚗' },
    { id: 'bikes', name: 'Bikes', icon: '🏍️' },
    { id: 'mobiles', name: 'Mobiles', icon: '📱' },
    { id: 'properties', name: 'Properties', icon: '🏠' },
    { id: 'jobs', name: 'Jobs', icon: '💼' },
    { id: 'furniture', name: 'Furniture', icon: '🪑' },
    { id: 'electronics', name: 'Electronics', icon: '📺' },
    { id: 'fashion', name: 'Fashion', icon: '👕' },
    { id: 'books', name: 'Books', icon: '📚' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'pets', name: 'Pets', icon: '🐕' }
  ];
  
  const [items, setItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [location, setLocation] = useState('');

  // Load favorites, recently viewed, reviews, and bookings from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
    
    const storedRecentlyViewed = localStorage.getItem('recentlyViewed');
    if (storedRecentlyViewed) {
      setRecentlyViewed(JSON.parse(storedRecentlyViewed));
    }

    const storedReviews = localStorage.getItem('reviews');
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    }

    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  // Initialize with empty items array - data will come from API
  useEffect(() => {
    setItems([]);
  }, []);

  const addToFavorites = useCallback((itemId) => {
    setFavorites((prev) => {
      if (!prev.includes(itemId)) {
        const updatedFavorites = [...prev, itemId];
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        return updatedFavorites;
      }
      return prev;
    });
  }, []);

  const removeFromFavorites = useCallback((itemId) => {
    setFavorites((prev) => {
      const updatedFavorites = prev.filter((id) => id !== itemId);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, []);

  const toggleFavorite = useCallback((itemId) => {
    setFavorites((prev) => {
      const isInFavorites = prev.includes(itemId);
      const updatedFavorites = isInFavorites
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, []);

  const isFavorite = (itemId) => favorites.includes(itemId);

  const addItem = (newItem) => {
    const item = {
      ...newItem,
      id: Date.now(),
      postedDate: new Date(),
    };
    setItems([item, ...items]);
  };

  const updateItem = (itemId, updatedData) => {
    setItems(items.map((item) => (item.id === itemId ? { ...item, ...updatedData } : item)));
  };

  const deleteItem = (itemId) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const getFilteredItems = () => {
    return items.filter((item) => {
      const matchesSearch = searchQuery
        ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
      const matchesPrice = item.price >= priceRange.min && item.price <= priceRange.max;
      const matchesLocation = location ? item.location.toLowerCase().includes(location.toLowerCase()) : true;

      return matchesSearch && matchesCategory && matchesPrice && matchesLocation;
    });
  };

  const addToRecentlyViewed = useCallback((itemId) => {
    // Remove the item if it already exists to avoid duplicates
    setRecentlyViewed((prev) => {
      const filteredViewed = prev.filter((id) => id !== itemId);
      // Add the item to the beginning of the array
      const updatedRecentlyViewed = [itemId, ...filteredViewed].slice(0, 10); // Keep only last 10 items
      localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecentlyViewed));
      return updatedRecentlyViewed;
    });
  }, []);

  const getRecentlyViewedItems = () => {
    return recentlyViewed
      .map((id) => items.find((item) => item.id === id))
      .filter((item) => item !== undefined);
  };

  // Review management functions
  const addReview = (review) => {
    const newReview = {
      ...review,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
  };

  const getItemReviews = (itemId) => {
    return reviews.filter((review) => review.itemId === itemId);
  };

  const getAverageRating = (itemId) => {
    const itemReviews = getItemReviews(itemId);
    if (itemReviews.length === 0) return 0;
    const sum = itemReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / itemReviews.length;
  };

  const getReviewsCount = (itemId) => {
    return getItemReviews(itemId).length;
  };

  // Booking management functions
  const addBooking = (booking) => {
    // Ensure booking has proper structure with item object
    if (!booking.item) {
      console.error('Booking must include an item object');
      return;
    }
    
    const newBooking = {
      ...booking,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  const updateBookingStatus = (bookingId, status) => {
    const updatedBookings = bookings.map((booking) =>
      booking.id === bookingId ? { ...booking, status } : booking
    );
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  const cancelBooking = (bookingId) => {
    updateBookingStatus(bookingId, 'cancelled');
  };

  const getUserBookings = (userEmail) => {
    // In a real app, bookings would have userId
    // For now, we'll return all bookings
    return bookings;
  };

  const value = {
    items,
    favorites,
    recentlyViewed,
    reviews,
    bookings,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    location,
    setLocation,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    addItem,
    updateItem,
    deleteItem,
    getFilteredItems,
    addToRecentlyViewed,
    getRecentlyViewedItems,
    addReview,
    getItemReviews,
    getAverageRating,
    getReviewsCount,
    addBooking,
    updateBookingStatus,
    cancelBooking,
    getUserBookings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
