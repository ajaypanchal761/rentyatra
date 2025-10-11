import { createContext, useContext, useState, useEffect } from 'react';

// Import default category images
import carImg from '../assets/car.png';
import mobileImg from '../assets/mobile.png';
import bikeImg from '../assets/bike.png';
import furnitureImg from '../assets/furniture.png';
import fashionImg from '../assets/fashion.png';
import bookImg from '../assets/book.png';
import sportImg from '../assets/sport.png';
import realstateImg from '../assets/realstate.png';
import petImg from '../assets/pet.png';

const CategoryContext = createContext();

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within CategoryProvider');
  }
  return context;
};

// Default categories with subcategories
const DEFAULT_CATEGORIES = [
  {
    id: 1,
    name: 'Cars',
    slug: 'cars',
    image: 'car.png',
    icon: '🚗',
    subcategories: [
      { id: 'car-1', name: 'Sedan', icon: '🚗' },
      { id: 'car-2', name: 'SUV', icon: '🚙' },
      { id: 'car-3', name: 'Hatchback', icon: '🚕' },
      { id: 'car-4', name: 'Sports Car', icon: '🏎️' },
      { id: 'car-5', name: 'Luxury', icon: '🚐' },
      { id: 'car-6', name: 'Electric', icon: '⚡' },
    ]
  },
  {
    id: 2,
    name: 'Bikes',
    slug: 'bikes',
    image: 'bike.png',
    icon: '🏍️',
    subcategories: [
      { id: 'bike-1', name: 'Sports Bike', icon: '🏍️' },
      { id: 'bike-2', name: 'Cruiser', icon: '🛵' },
      { id: 'bike-3', name: 'Scooter', icon: '🛴' },
      { id: 'bike-4', name: 'Commuter', icon: '🚲' },
      { id: 'bike-5', name: 'Electric', icon: '⚡' },
    ]
  },
  {
    id: 3,
    name: 'Mobiles',
    slug: 'mobiles',
    image: 'mobile.png',
    icon: '📱',
    subcategories: [
      { id: 'mobile-1', name: 'Smartphones', icon: '📱' },
      { id: 'mobile-2', name: 'Tablets', icon: '📱' },
      { id: 'mobile-3', name: 'Accessories', icon: '🔌' },
      { id: 'mobile-4', name: 'Smartwatches', icon: '⌚' },
    ]
  },
  {
    id: 4,
    name: 'Properties',
    slug: 'properties',
    image: 'realstate.png',
    icon: '🏠',
    subcategories: [
      { id: 'property-1', name: 'Apartments', icon: '🏢' },
      { id: 'property-2', name: 'Villas', icon: '🏠' },
      { id: 'property-3', name: 'Plots', icon: '🏗️' },
      { id: 'property-4', name: 'Commercial', icon: '🏬' },
      { id: 'property-5', name: 'PG/Hostel', icon: '🛏️' },
    ]
  },
  {
    id: 5,
    name: 'Furniture',
    slug: 'furniture',
    image: 'furniture.png',
    icon: '🛋️',
    subcategories: [
      { id: 'furniture-1', name: 'Sofa Sets', icon: '🛋️' },
      { id: 'furniture-2', name: 'Beds', icon: '🛏️' },
      { id: 'furniture-3', name: 'Dining Tables', icon: '🪑' },
      { id: 'furniture-4', name: 'Wardrobes', icon: '🚪' },
      { id: 'furniture-5', name: 'Study Tables', icon: '📚' },
    ]
  },
  {
    id: 6,
    name: 'Electronics',
    slug: 'electronics',
    image: 'mobile.png',
    icon: '💻',
    subcategories: [
      { id: 'electronics-1', name: 'Washing Machine', icon: '🧺' },
      { id: 'electronics-2', name: 'Refrigerator', icon: '❄️' },
      { id: 'electronics-3', name: 'Air Conditioner', icon: '🌬️' },
      { id: 'electronics-4', name: 'TV', icon: '📺' },
      { id: 'electronics-5', name: 'Camera', icon: '📷' },
    ]
  },
  {
    id: 7,
    name: 'Fashion',
    slug: 'fashion',
    image: 'fashion.png',
    icon: '👔',
    subcategories: [
      { id: 'fashion-1', name: "Men's Clothing", icon: '👔' },
      { id: 'fashion-2', name: "Women's Clothing", icon: '👗' },
      { id: 'fashion-3', name: 'Footwear', icon: '👞' },
      { id: 'fashion-4', name: 'Watches', icon: '⌚' },
      { id: 'fashion-5', name: 'Bags', icon: '👜' },
    ]
  },
  {
    id: 8,
    name: 'Books',
    slug: 'books',
    image: 'book.png',
    icon: '📚',
    subcategories: [
      { id: 'book-1', name: 'Textbooks', icon: '📚' },
      { id: 'book-2', name: 'Novels', icon: '📖' },
      { id: 'book-3', name: 'Comics', icon: '📰' },
      { id: 'book-4', name: 'Reference', icon: '📕' },
    ]
  },
  {
    id: 9,
    name: 'Sports',
    slug: 'sports',
    image: 'sport.png',
    icon: '⚽',
    subcategories: [
      { id: 'sport-1', name: 'Cricket', icon: '🏏' },
      { id: 'sport-2', name: 'Football', icon: '⚽' },
      { id: 'sport-3', name: 'Gym Equipment', icon: '💪' },
      { id: 'sport-4', name: 'Cycling', icon: '🚴' },
      { id: 'sport-5', name: 'Badminton', icon: '🏸' },
    ]
  },
  {
    id: 10,
    name: 'Pets',
    slug: 'pets',
    image: 'pet.png',
    icon: '🐕',
    subcategories: [
      { id: 'pet-1', name: 'Dogs', icon: '🐕' },
      { id: 'pet-2', name: 'Cats', icon: '🐈' },
      { id: 'pet-3', name: 'Birds', icon: '🦜' },
      { id: 'pet-4', name: 'Pet Food', icon: '🍖' },
    ]
  },
];

// Image map for category images
export const imageMap = {
  'car.png': carImg,
  'mobile.png': mobileImg,
  'bike.png': bikeImg,
  'furniture.png': furnitureImg,
  'fashion.png': fashionImg,
  'book.png': bookImg,
  'sport.png': sportImg,
  'realstate.png': realstateImg,
  'pet.png': petImg,
};

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState(() => {
    const stored = localStorage.getItem('categories');
    return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
  });

  // Save to localStorage whenever categories change
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  // Add new category
  const addCategory = (categoryData) => {
    const newCategory = {
      id: Date.now(),
      ...categoryData,
      slug: categoryData.name.toLowerCase().replace(/\s+/g, '-'),
      subcategories: categoryData.subcategories || []
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  // Update category
  const updateCategory = (categoryId, updates) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, ...updates, slug: updates.name ? updates.name.toLowerCase().replace(/\s+/g, '-') : cat.slug }
          : cat
      )
    );
  };

  // Delete category
  const deleteCategory = (categoryId) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  // Add subcategory to a category
  const addSubcategory = (categoryId, subcategoryData) => {
    setCategories(prev =>
      prev.map(cat => {
        if (cat.id === categoryId) {
          const newSubcategory = {
            id: `${cat.slug}-${Date.now()}`,
            ...subcategoryData
          };
          return {
            ...cat,
            subcategories: [...(cat.subcategories || []), newSubcategory]
          };
        }
        return cat;
      })
    );
  };

  // Update subcategory
  const updateSubcategory = (categoryId, subcategoryId, updates) => {
    setCategories(prev =>
      prev.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.map(sub =>
              sub.id === subcategoryId ? { ...sub, ...updates } : sub
            )
          };
        }
        return cat;
      })
    );
  };

  // Delete subcategory
  const deleteSubcategory = (categoryId, subcategoryId) => {
    setCategories(prev =>
      prev.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.filter(sub => sub.id !== subcategoryId)
          };
        }
        return cat;
      })
    );
  };

  // Reset to default categories
  const resetToDefaults = () => {
    setCategories(DEFAULT_CATEGORIES);
  };

  // Get category by slug
  const getCategoryBySlug = (slug) => {
    return categories.find(cat => cat.slug === slug);
  };

  // Get category by ID
  const getCategoryById = (id) => {
    return categories.find(cat => cat.id === id);
  };

  const value = {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    resetToDefaults,
    getCategoryBySlug,
    getCategoryById,
    imageMap,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryContext;

