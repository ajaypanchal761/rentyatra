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

  // Mock data for items - In real app, this would come from API
  useEffect(() => {
    const mockItems = [
      // ===== CARS =====
      // Sedan
      { id: 1, title: 'Toyota Camry 2020', description: 'Well maintained sedan, single owner', price: 35000, condition: 'good', category: 'cars', subcategory: 'Sedan', location: 'Mumbai, Maharashtra', images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400', 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400'], owner: { name: 'Raj Sharma', rating: 4.8 }, postedDate: new Date('2025-01-20') },
      { id: 2, title: 'Honda Accord 2021', description: 'Excellent condition, low mileage', price: 42000, condition: 'excellent', category: 'cars', subcategory: 'Sedan', location: 'Bangalore, Karnataka', images: ['https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400', 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=400', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400'], owner: { name: 'Amit Kumar', rating: 4.9 }, postedDate: new Date('2025-02-01') },
      { id: 3, title: 'Hyundai Elantra 2019', description: 'Fuel efficient sedan, perfect for city', price: 28000, condition: 'good', category: 'cars', subcategory: 'Sedan', location: 'Hyderabad, Telangana', images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400', 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400', 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=400'], owner: { name: 'Priya Singh', rating: 4.6 }, postedDate: new Date('2025-01-25') },
      // SUV
      { id: 4, title: 'Ford Explorer 2021', description: 'Spacious family SUV, 7 seater', price: 55000, condition: 'excellent', category: 'cars', subcategory: 'SUV', location: 'Jaipur, Rajasthan', images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400', 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=400', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400'], owner: { name: 'Vikram Patel', rating: 4.8 }, postedDate: new Date('2025-02-05') },
      { id: 5, title: 'Toyota RAV4 2022', description: 'Hybrid SUV, excellent fuel economy', price: 48000, condition: 'excellent', category: 'cars', subcategory: 'SUV', location: 'Kolkata, West Bengal', images: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400', 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=400', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400'], owner: { name: 'Neha Gupta', rating: 4.9 }, postedDate: new Date('2025-02-10') },
      { id: 6, title: 'Jeep Wrangler 2020', description: 'Off-road ready, 4x4 capability', price: 58000, condition: 'good', category: 'cars', subcategory: 'SUV', location: 'Ahmedabad, Gujarat', images: ['https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=400', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400'], owner: { name: 'Karan Mehta', rating: 4.7 }, postedDate: new Date('2025-01-28') },
      // Hatchback
      { id: 7, title: 'Honda Civic Hatchback 2021', description: 'Sporty hatchback, great handling', price: 32000, condition: 'excellent', category: 'cars', subcategory: 'Hatchback', location: 'Pune, Maharashtra', images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400', 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400', 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=400'], owner: { name: 'Anjali Desai', rating: 4.8 }, postedDate: new Date('2025-02-03') },
      { id: 8, title: 'Volkswagen Golf 2020', description: 'Compact and efficient hatchback', price: 29000, condition: 'good', category: 'cars', subcategory: 'Hatchback', location: 'Surat, Gujarat', images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400', 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400'], owner: { name: 'Rahul Joshi', rating: 4.6 }, postedDate: new Date('2025-01-30') },
      // Sports Car
      { id: 9, title: 'Ford Mustang 2019', description: 'V8 engine, powerful sports car', price: 75000, condition: 'excellent', category: 'cars', subcategory: 'Sports Car', location: 'Chennai, Tamil Nadu', images: ['https://images.unsplash.com/photo-1584345604476-8ec5f5212fd7?w=400', 'https://images.unsplash.com/photo-1552519507-b9e8b6c57f4f?w=400', 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=400', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400'], owner: { name: 'Arjun Reddy', rating: 4.9 }, postedDate: new Date('2025-02-08') },
      { id: 10, title: 'Chevrolet Camaro 2020', description: 'High performance, sleek design', price: 80000, condition: 'excellent', category: 'cars', subcategory: 'Sports Car', location: 'Agra, Uttar Pradesh', images: ['https://images.unsplash.com/photo-1552519507-b9e8b6c57f4f?w=400', 'https://images.unsplash.com/photo-1584345604476-8ec5f5212fd7?w=400', 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=400', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400'], owner: { name: 'Rohan Malhotra', rating: 4.8 }, postedDate: new Date('2025-02-12') },
      // Luxury
      { id: 11, title: 'BMW 3 Series 2021', description: 'Luxury sedan, loaded with features', price: 85000, condition: 'excellent', category: 'cars', subcategory: 'Luxury', location: 'Delhi, Delhi', images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400', 'https://images.unsplash.com/photo-1617531653520-bd466ee159b2?w=400', 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=400', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400'], owner: { name: 'Aditya Kapoor', rating: 4.9 }, postedDate: new Date('2025-02-15') },
      { id: 12, title: 'Mercedes-Benz E-Class', description: 'Premium comfort and technology', price: 125000, condition: 'excellent', category: 'cars', subcategory: 'Luxury', location: 'Mumbai, Maharashtra', images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400', 'https://images.unsplash.com/photo-1617531653520-bd466ee159b2?w=400', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400', 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=400'], owner: { name: 'Siddharth Malhotra', rating: 4.8 }, postedDate: new Date('2025-02-18') },
      // Electric
      { id: 13, title: 'Tesla Model 3 2021', description: 'Long range electric sedan, autopilot', price: 95000, condition: 'excellent', category: 'cars', subcategory: 'Electric', location: 'Nashik, Maharashtra', images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400'], owner: { name: 'Aryan Sharma', rating: 4.9 }, postedDate: new Date('2025-02-20') },
      { id: 14, title: 'Nissan Leaf 2022', description: 'Affordable electric car, eco-friendly', price: 45000, condition: 'excellent', category: 'cars', subcategory: 'Electric', location: 'Hyderabad, Telangana', images: ['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400'], owner: { name: 'Kavya Iyer', rating: 4.7 }, postedDate: new Date('2025-02-22') },

      // ===== BIKES =====
      // Sports Bike
      { id: 15, title: 'Yamaha R15 V3 2022', description: 'Sports bike, 155cc, low mileage', price: 8000, condition: 'excellent', category: 'bikes', subcategory: 'Sports Bike', location: 'Bhopal, Madhya Pradesh', images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=400', 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400'], owner: { name: 'Ravi Kumar', rating: 4.8 }, postedDate: new Date('2025-02-10') },
      { id: 16, title: 'Kawasaki Ninja 300', description: 'Beginner friendly sports bike', price: 12000, condition: 'good', category: 'bikes', subcategory: 'Sports Bike', location: 'Lucknow, Uttar Pradesh', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400', 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=400', 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400'], owner: { name: 'Varun Dhawan', rating: 4.7 }, postedDate: new Date('2025-02-12') },
      { id: 17, title: 'Suzuki GSX-R750', description: 'High performance sports bike', price: 18000, condition: 'excellent', category: 'bikes', subcategory: 'Sports Bike', location: 'Indore, Madhya Pradesh', images: ['https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=400', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400', 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400'], owner: { name: 'Abhishek Yadav', rating: 4.9 }, postedDate: new Date('2025-02-14') },
      // Cruiser
      { id: 18, title: 'Harley Davidson Street 750', description: 'Classic cruiser, V-twin engine', price: 15000, condition: 'good', category: 'bikes', subcategory: 'Cruiser', location: 'Indore, Madhya Pradesh', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400', 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=400', 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400'], owner: { name: 'Sanjay Dutt', rating: 4.6 }, postedDate: new Date('2025-02-11') },
      { id: 19, title: 'Indian Scout 2020', description: 'American cruiser, powerful engine', price: 20000, condition: 'excellent', category: 'bikes', subcategory: 'Cruiser', location: 'Chandigarh, Chandigarh', images: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=400', 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400'], owner: { name: 'Harpreet Singh', rating: 4.8 }, postedDate: new Date('2025-02-16') },
      // Scooter
      { id: 20, title: 'Vespa Primavera 150', description: 'Stylish Italian scooter', price: 6500, condition: 'excellent', category: 'bikes', subcategory: 'Scooter', location: 'Chennai, Tamil Nadu', images: ['https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400'], owner: { name: 'Meera Nair', rating: 4.7 }, postedDate: new Date('2025-02-18') },
      { id: 21, title: 'Honda Activa 125', description: 'Reliable commuter scooter', price: 3500, condition: 'good', category: 'bikes', subcategory: 'Scooter', location: 'Ahmedabad, Gujarat', images: ['https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400'], owner: { name: 'Priya Patel', rating: 4.6 }, postedDate: new Date('2025-02-20') },
      // Commuter
      { id: 22, title: 'Honda CB Shine 125cc', description: 'Fuel efficient commuter bike', price: 3500, condition: 'good', category: 'bikes', subcategory: 'Commuter', location: 'Ludhiana, Punjab', images: ['https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400'], owner: { name: 'Suresh Patel', rating: 4.5 }, postedDate: new Date('2025-02-12') },
      { id: 23, title: 'Bajaj Pulsar 150', description: 'Popular commuter, great mileage', price: 4000, condition: 'good', category: 'bikes', subcategory: 'Commuter', location: 'Nagpur, Maharashtra', images: ['https://images.unsplash.com/photo-1558980664-1db506751d10?w=400'], owner: { name: 'Rajesh Kumar', rating: 4.6 }, postedDate: new Date('2025-02-15') },

      // ===== MOBILES =====
      // Smartphones
      { id: 24, title: 'iPhone 13 Pro Max 256GB', description: 'Excellent condition, 95% battery health', price: 4500, condition: 'excellent', category: 'mobiles', subcategory: 'Smartphones', location: 'Delhi, Delhi', images: ['https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400', 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400', 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400', 'https://images.unsplash.com/photo-1592286927505-5d1afe0df387?w=400'], owner: { name: 'Rohit Verma', rating: 4.5 }, postedDate: new Date('2025-01-15') },
      { id: 25, title: 'Samsung Galaxy S23 Ultra 512GB', description: 'Latest flagship, excellent camera', price: 5000, condition: 'excellent', category: 'mobiles', subcategory: 'Smartphones', location: 'Hyderabad, Telangana', images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400'], owner: { name: 'Deepika Sharma', rating: 4.8 }, postedDate: new Date('2025-02-13') },
      { id: 26, title: 'Google Pixel 7 Pro', description: 'Best camera phone, pure Android', price: 3500, condition: 'excellent', category: 'mobiles', subcategory: 'Smartphones', location: 'Bangalore, Karnataka', images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400', 'https://images.unsplash.com/photo-1592286927505-5d1afe0df387?w=400'], owner: { name: 'Kunal Jain', rating: 4.7 }, postedDate: new Date('2025-02-16') },
      { id: 27, title: 'OnePlus 11 5G', description: 'Fast charging, flagship killer', price: 550, condition: 'excellent', category: 'mobiles', subcategory: 'Smartphones', location: 'Ahmedabad, Gujarat', images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'], owner: { name: 'Chris Lee', rating: 4.6 }, postedDate: new Date('2025-02-18') },
      // Feature Phones
      { id: 28, title: 'Nokia 3310 (2017)', description: 'Classic feature phone, long battery', price: 45, condition: 'good', category: 'mobiles', subcategory: 'Feature Phones', location: 'Pune, Maharashtra', images: ['https://images.unsplash.com/photo-1519001750763-e69ec4faf611?w=400'], owner: { name: 'Mary Wilson', rating: 4.4 }, postedDate: new Date('2025-02-10') },
      { id: 29, title: 'Samsung Guru Music', description: 'Basic phone with music player', price: 30, condition: 'good', category: 'mobiles', subcategory: 'Feature Phones', location: 'Nagpur, Maharashtra', images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'], owner: { name: 'Robert Chen', rating: 4.3 }, postedDate: new Date('2025-02-12') },
      // Tablets
      { id: 30, title: 'iPad Pro 12.9" M2 Chip', description: 'Professional tablet with Apple Pencil', price: 1100, condition: 'excellent', category: 'mobiles', subcategory: 'Tablets', location: 'Delhi, Delhi', images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400'], owner: { name: 'Nathan Brooks', rating: 4.9 }, postedDate: new Date('2025-02-14') },
      { id: 31, title: 'Samsung Galaxy Tab S8', description: 'Android tablet, perfect for media', price: 550, condition: 'excellent', category: 'mobiles', subcategory: 'Tablets', location: 'Mumbai, Maharashtra', images: ['https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400'], owner: { name: 'Emma Davis', rating: 4.7 }, postedDate: new Date('2025-02-16') },
      // Accessories
      { id: 32, title: 'AirPods Pro 2nd Gen', description: 'Active noise cancellation', price: 200, condition: 'excellent', category: 'mobiles', subcategory: 'Accessories', location: 'Bangalore, Karnataka', images: ['https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400'], owner: { name: 'Mike Johnson', rating: 4.8 }, postedDate: new Date('2025-02-18') },
      { id: 33, title: 'Samsung Fast Charger 45W', description: 'Super fast charging, original', price: 35, condition: 'new', category: 'mobiles', subcategory: 'Accessories', location: 'Hyderabad, Telangana', images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400'], owner: { name: 'Lisa Anderson', rating: 4.6 }, postedDate: new Date('2025-02-20') },
      // Smartwatches
      { id: 34, title: 'Apple Watch Series 8', description: 'Health tracking, fitness features', price: 350, condition: 'excellent', category: 'mobiles', subcategory: 'Smartwatches', location: 'Surat, Gujarat', images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400'], owner: { name: 'David Lee', rating: 4.8 }, postedDate: new Date('2025-02-22') },
      { id: 35, title: 'Samsung Galaxy Watch 5', description: 'Android smartwatch, AMOLED display', price: 250, condition: 'excellent', category: 'mobiles', subcategory: 'Smartwatches', location: 'Pune, Maharashtra', images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'], owner: { name: 'Sarah Kim', rating: 4.7 }, postedDate: new Date('2025-02-24') },

      // ===== ELECTRONICS =====
      // Washing Machine
      { id: 36, title: 'LG Front Load Washing Machine 7kg', description: 'Inverter technology, very quiet', price: 420, condition: 'good', category: 'electronics', subcategory: 'Washing Machine', location: 'Nagpur, Maharashtra', images: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400'], owner: { name: 'Charlotte Lee', rating: 4.9 }, postedDate: new Date('2025-02-25') },
      { id: 37, title: 'Samsung Top Load 6.5kg', description: 'Affordable, multiple wash programs', price: 320, condition: 'good', category: 'electronics', subcategory: 'Washing Machine', location: 'Indore, Madhya Pradesh', images: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400'], owner: { name: 'James Wilson', rating: 4.6 }, postedDate: new Date('2025-02-26') },
      // Refrigerator
      { id: 38, title: 'Samsung Double Door Refrigerator', description: 'Large capacity, energy efficient', price: 580, condition: 'good', category: 'electronics', subcategory: 'Refrigerator', location: 'Pune, Maharashtra', images: ['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400'], owner: { name: 'William Moore', rating: 4.7 }, postedDate: new Date('2025-02-24') },
      { id: 39, title: 'LG French Door Fridge', description: 'Premium fridge, smart features', price: 850, condition: 'excellent', category: 'electronics', subcategory: 'Refrigerator', location: 'Delhi, Delhi', images: ['https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400'], owner: { name: 'Olivia Brown', rating: 4.8 }, postedDate: new Date('2025-02-27') },
      // Air Conditioner
      { id: 40, title: 'Daikin Split AC 1.5 Ton', description: 'Inverter AC, energy saving', price: 450, condition: 'good', category: 'electronics', subcategory: 'Air Conditioner', location: 'Chennai, Tamil Nadu', images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400'], owner: { name: 'Daniel Garcia', rating: 4.7 }, postedDate: new Date('2025-02-28') },
      { id: 41, title: 'LG Dual Inverter AC 2 Ton', description: 'Fast cooling, low noise', price: 550, condition: 'excellent', category: 'electronics', subcategory: 'Air Conditioner', location: 'Lucknow, Uttar Pradesh', images: ['https://images.unsplash.com/photo-1631545806609-e2fa6c437f96?w=400'], owner: { name: 'Sophia Martinez', rating: 4.8 }, postedDate: new Date('2025-03-01') },
      // TV
      { id: 42, title: 'Samsung 55" 4K Smart TV', description: 'QLED technology, HDR support', price: 550, condition: 'excellent', category: 'electronics', subcategory: 'TV', location: 'Nagpur, Maharashtra', images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400'], owner: { name: 'Kevin White', rating: 4.9 }, postedDate: new Date('2025-02-04') },
      { id: 43, title: 'LG 65" OLED TV', description: 'Perfect blacks, cinema experience', price: 1800, condition: 'excellent', category: 'electronics', subcategory: 'TV', location: 'Mumbai, Maharashtra', images: ['https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400'], owner: { name: 'Matthew Taylor', rating: 4.9 }, postedDate: new Date('2025-03-02') },
      { id: 44, title: 'Sony Bravia 43" Full HD', description: 'Smart TV, excellent picture quality', price: 380, condition: 'good', category: 'electronics', subcategory: 'TV', location: 'Vadodara, Gujarat', images: ['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400'], owner: { name: 'Rachel Green', rating: 4.7 }, postedDate: new Date('2025-03-03') },
      // Camera
      { id: 45, title: 'Canon EOS R6 Camera Body', description: 'Professional mirrorless camera', price: 2100, condition: 'excellent', category: 'electronics', subcategory: 'Camera', location: 'Jaipur, Rajasthan', images: ['https://images.unsplash.com/photo-1606980707107-8e7d3e6c0c2d?w=400'], owner: { name: 'Lisa Anderson', rating: 4.8 }, postedDate: new Date('2025-02-02') },
      { id: 46, title: 'Sony A7 III Full Frame', description: 'Excellent for video and photos', price: 1800, condition: 'excellent', category: 'electronics', subcategory: 'Camera', location: 'Hyderabad, Telangana', images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400'], owner: { name: 'Paul Mitchell', rating: 4.9 }, postedDate: new Date('2025-03-04') },
      { id: 47, title: 'Nikon D850 DSLR', description: 'High resolution, professional', price: 2500, condition: 'excellent', category: 'electronics', subcategory: 'Camera', location: 'Kolkata, West Bengal', images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400'], owner: { name: 'Anna Schmidt', rating: 4.8 }, postedDate: new Date('2025-03-05') },
      // Microwave
      { id: 48, title: 'Samsung Convection Microwave', description: 'Multi-function oven, 28L capacity', price: 180, condition: 'good', category: 'electronics', subcategory: 'Microwave', location: 'Ahmedabad, Gujarat', images: ['https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400'], owner: { name: 'Brian Cooper', rating: 4.6 }, postedDate: new Date('2025-03-06') },
      { id: 49, title: 'LG Solo Microwave 20L', description: 'Compact microwave, easy to use', price: 95, condition: 'good', category: 'electronics', subcategory: 'Microwave', location: 'Pune, Maharashtra', images: ['https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400'], owner: { name: 'Jennifer Adams', rating: 4.5 }, postedDate: new Date('2025-03-07') },

      // ===== FURNITURE =====
      // Sofa Sets
      { id: 50, title: 'Modern L-Shaped Sofa', description: 'Grey fabric, comfortable, pet-free home', price: 450, condition: 'good', category: 'furniture', subcategory: 'Sofa Sets', location: 'Pune, Maharashtra', images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'], owner: { name: 'Sarah Williams', rating: 4.6 }, postedDate: new Date('2025-01-25') },
      { id: 51, title: 'Leather 3-Seater Sofa', description: 'Genuine leather, luxury comfort', price: 850, condition: 'excellent', category: 'furniture', subcategory: 'Sofa Sets', location: 'Delhi, Delhi', images: ['https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400'], owner: { name: 'Richard Clark', rating: 4.8 }, postedDate: new Date('2025-03-08') },
      // Beds
      { id: 52, title: 'King Size Bed with Mattress', description: 'Memory foam mattress, wooden frame', price: 850, condition: 'excellent', category: 'furniture', subcategory: 'Beds', location: 'Kanpur, Uttar Pradesh', images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400'], owner: { name: 'Sophia Martinez', rating: 4.8 }, postedDate: new Date('2025-02-16') },
      { id: 53, title: 'Queen Size Platform Bed', description: 'Modern design, storage underneath', price: 520, condition: 'good', category: 'furniture', subcategory: 'Beds', location: 'Surat, Gujarat', images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400'], owner: { name: 'Lucas Brown', rating: 4.7 }, postedDate: new Date('2025-03-09') },
      // Dining Tables
      { id: 54, title: 'Wooden Dining Table Set (6 chairs)', description: 'Solid oak, seats 6 people', price: 650, condition: 'good', category: 'furniture', subcategory: 'Dining Tables', location: 'Surat, Gujarat', images: ['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400'], owner: { name: 'Robert Wilson', rating: 4.5 }, postedDate: new Date('2025-01-30') },
      { id: 55, title: 'Glass Top Dining Table with 4 Chairs', description: 'Modern design, tempered glass', price: 420, condition: 'excellent', category: 'furniture', subcategory: 'Dining Tables', location: 'Chennai, Tamil Nadu', images: ['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400'], owner: { name: 'Isabella Turner', rating: 4.7 }, postedDate: new Date('2025-03-10') },
      // Wardrobes
      { id: 56, title: '4-Door Wooden Wardrobe', description: 'Spacious storage, mirrors included', price: 580, condition: 'good', category: 'furniture', subcategory: 'Wardrobes', location: 'Hyderabad, Telangana', images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400'], owner: { name: 'Henry Wilson', rating: 4.6 }, postedDate: new Date('2025-03-11') },
      { id: 57, title: 'Sliding Door Wardrobe', description: 'Modern sliding doors, ample space', price: 680, condition: 'excellent', category: 'furniture', subcategory: 'Wardrobes', location: 'Kolkata, West Bengal', images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400'], owner: { name: 'Mia Thompson', rating: 4.8 }, postedDate: new Date('2025-03-12') },
      // Study Tables
      { id: 58, title: 'Office Desk with Drawers', description: 'Large workspace, 3 drawers', price: 180, condition: 'good', category: 'furniture', subcategory: 'Study Tables', location: 'Indore, Madhya Pradesh', images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400'], owner: { name: 'Jennifer Garcia', rating: 4.6 }, postedDate: new Date('2025-02-06') },
      { id: 59, title: 'L-Shaped Computer Desk', description: 'Corner desk, cable management', price: 290, condition: 'excellent', category: 'furniture', subcategory: 'Study Tables', location: 'Jaipur, Rajasthan', images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400'], owner: { name: 'Oliver Harris', rating: 4.7 }, postedDate: new Date('2025-03-13') },
      // Office Furniture
      { id: 60, title: 'Ergonomic Office Chair', description: 'Adjustable height, lumbar support', price: 220, condition: 'excellent', category: 'furniture', subcategory: 'Office Furniture', location: 'Bangalore, Karnataka', images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400'], owner: { name: 'Noah Anderson', rating: 4.8 }, postedDate: new Date('2025-03-14') },
      { id: 61, title: 'Conference Table 8-Seater', description: 'Professional meeting table', price: 950, condition: 'excellent', category: 'furniture', subcategory: 'Office Furniture', location: 'Delhi, Delhi', images: ['https://images.unsplash.com/photo-1578898886155-e99f98c0ea6d?w=400'], owner: { name: 'Emma Davis', rating: 4.9 }, postedDate: new Date('2025-03-15') },

      // ===== FASHION =====
      // Men's Clothing
      { id: 62, title: 'Designer Leather Jacket - Mens Large', description: 'Genuine leather, worn once', price: 320, condition: 'excellent', category: 'fashion', subcategory: "Men's Clothing", location: 'Chandigarh, Chandigarh', images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'], owner: { name: 'Mark Thompson', rating: 4.5 }, postedDate: new Date('2025-01-29') },
      { id: 63, title: 'Formal Suit Set - Navy Blue', description: 'Business suit, size 40, slim fit', price: 280, condition: 'excellent', category: 'fashion', subcategory: "Men's Clothing", location: 'Surat, Gujarat', images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400'], owner: { name: 'James Anderson', rating: 4.7 }, postedDate: new Date('2025-03-16') },
      // Women's Clothing
      { id: 64, title: 'Designer Evening Gown', description: 'Elegant dress, worn once for event', price: 420, condition: 'excellent', category: 'fashion', subcategory: "Women's Clothing", location: 'Mumbai, Maharashtra', images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'], owner: { name: 'Emma Johnson', rating: 4.8 }, postedDate: new Date('2025-03-17') },
      { id: 65, title: 'Winter Coat - Womens Medium', description: 'Warm wool coat, perfect for winter', price: 180, condition: 'good', category: 'fashion', subcategory: "Women's Clothing", location: 'Pune, Maharashtra', images: ['https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400'], owner: { name: 'Sarah Wilson', rating: 4.6 }, postedDate: new Date('2025-03-18') },
      // Footwear
      { id: 66, title: 'Nike Air Max 270 - Size 10', description: 'Worn twice, like new condition', price: 95, condition: 'excellent', category: 'fashion', subcategory: 'Footwear', location: 'Chennai, Tamil Nadu', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'], owner: { name: 'Chris Brown', rating: 4.7 }, postedDate: new Date('2025-02-03') },
      { id: 67, title: 'Adidas Ultraboost Running Shoes', description: 'Size 9, boost technology', price: 110, condition: 'excellent', category: 'fashion', subcategory: 'Footwear', location: 'Kolkata, West Bengal', images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400'], owner: { name: 'Lucas Wright', rating: 4.8 }, postedDate: new Date('2025-02-20') },
      { id: 68, title: 'Formal Leather Shoes', description: 'Black oxford shoes, size 42', price: 85, condition: 'good', category: 'fashion', subcategory: 'Footwear', location: 'Delhi, Delhi', images: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400'], owner: { name: 'David Lee', rating: 4.6 }, postedDate: new Date('2025-03-19') },
      // Watches
      { id: 69, title: 'Rolex Submariner (Replica)', description: 'High quality replica watch', price: 150, condition: 'excellent', category: 'fashion', subcategory: 'Watches', location: 'Chennai, Tamil Nadu', images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400'], owner: { name: 'Tom Martinez', rating: 4.5 }, postedDate: new Date('2025-03-20') },
      { id: 70, title: 'Casio G-Shock Sports Watch', description: 'Durable, water resistant', price: 95, condition: 'excellent', category: 'fashion', subcategory: 'Watches', location: 'Ahmedabad, Gujarat', images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400'], owner: { name: 'Ryan Cooper', rating: 4.7 }, postedDate: new Date('2025-03-21') },
      // Bags
      { id: 71, title: 'Louis Vuitton Handbag', description: 'Authentic designer handbag', price: 1200, condition: 'excellent', category: 'fashion', subcategory: 'Bags', location: 'Gurgaon, Haryana', images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400'], owner: { name: 'Victoria Smith', rating: 4.9 }, postedDate: new Date('2025-03-22') },
      { id: 72, title: 'Backpack - Laptop Bag', description: 'Professional backpack, 15" laptop', price: 65, condition: 'good', category: 'fashion', subcategory: 'Bags', location: 'Bangalore, Karnataka', images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'], owner: { name: 'Mike Johnson', rating: 4.6 }, postedDate: new Date('2025-03-23') },
      // Accessories
      { id: 73, title: 'Ray-Ban Aviator Sunglasses', description: 'Polarized lenses, gold frame', price: 120, condition: 'excellent', category: 'fashion', subcategory: 'Accessories', location: 'Chennai, Tamil Nadu', images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'], owner: { name: 'Mia Johnson', rating: 4.7 }, postedDate: new Date('2025-02-19') },
      { id: 74, title: 'Gucci Belt - Authentic', description: 'Designer leather belt, size 95cm', price: 280, condition: 'excellent', category: 'fashion', subcategory: 'Accessories', location: 'Mumbai, Maharashtra', images: ['https://images.unsplash.com/photo-1624222247344-550fb60583e2?w=400'], owner: { name: 'Emma Davis', rating: 4.9 }, postedDate: new Date('2025-02-21') },

      // ===== BOOKS =====
      // Textbooks
      { id: 75, title: 'Engineering Mathematics Textbook', description: 'Complete syllabus covered', price: 45, condition: 'good', category: 'books', subcategory: 'Textbooks', location: 'Ahmedabad, Gujarat', images: ['https://images.unsplash.com/photo-1589998059171-988d887df646?w=400'], owner: { name: 'Ava Thomas', rating: 4.8 }, postedDate: new Date('2025-02-23') },
      { id: 76, title: 'Medical Anatomy Atlas', description: 'Detailed illustrations, MBBS', price: 85, condition: 'excellent', category: 'books', subcategory: 'Textbooks', location: 'Surat, Gujarat', images: ['https://images.unsplash.com/photo-1589998059171-988d887df646?w=400'], owner: { name: 'Dr. Sarah Johnson', rating: 4.9 }, postedDate: new Date('2025-03-24') },
      // Novels
      { id: 77, title: 'Harry Potter Complete Book Set', description: 'All 7 books, hardcover', price: 85, condition: 'excellent', category: 'books', subcategory: 'Novels', location: 'Patna, Bihar', images: ['https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400'], owner: { name: 'Anna Taylor', rating: 4.7 }, postedDate: new Date('2025-01-27') },
      { id: 78, title: 'The Lord of the Rings Box Set', description: 'Trilogy with maps', price: 95, condition: 'excellent', category: 'books', subcategory: 'Novels', location: 'Hyderabad, Telangana', images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'], owner: { name: 'Noah Anderson', rating: 4.6 }, postedDate: new Date('2025-02-22') },
      { id: 79, title: 'Game of Thrones Full Series', description: 'All 5 books, paperback', price: 75, condition: 'good', category: 'books', subcategory: 'Novels', location: 'Jaipur, Rajasthan', images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'], owner: { name: 'Chris Evans', rating: 4.7 }, postedDate: new Date('2025-03-25') },
      // Comics
      { id: 80, title: 'Marvel Comics Collection (50 issues)', description: 'Vintage comics, rare editions', price: 250, condition: 'good', category: 'books', subcategory: 'Comics', location: 'Mumbai, Maharashtra', images: ['https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400'], owner: { name: 'Peter Parker', rating: 4.8 }, postedDate: new Date('2025-03-26') },
      { id: 81, title: 'DC Batman Series (20 comics)', description: 'Classic Batman comics', price: 180, condition: 'good', category: 'books', subcategory: 'Comics', location: 'Delhi, Delhi', images: ['https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400'], owner: { name: 'Bruce Wayne', rating: 4.9 }, postedDate: new Date('2025-03-27') },
      // Magazines
      { id: 82, title: 'National Geographic (2023 Full Year)', description: '12 issues, excellent condition', price: 60, condition: 'excellent', category: 'books', subcategory: 'Magazines', location: 'Pune, Maharashtra', images: ['https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400'], owner: { name: 'Rachel Green', rating: 4.6 }, postedDate: new Date('2025-03-28') },
      { id: 83, title: 'Vogue Magazine Collection', description: 'Fashion magazines, 2022-2023', price: 45, condition: 'excellent', category: 'books', subcategory: 'Magazines', location: 'Chennai, Tamil Nadu', images: ['https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?w=400'], owner: { name: 'Monica Geller', rating: 4.7 }, postedDate: new Date('2025-03-29') },
      // Reference
      { id: 84, title: 'Oxford English Dictionary', description: 'Complete edition, hardcover', price: 120, condition: 'excellent', category: 'books', subcategory: 'Reference', location: 'Surat, Gujarat', images: ['https://images.unsplash.com/photo-1589998059171-988d887df646?w=400'], owner: { name: 'Prof. Johnson', rating: 4.9 }, postedDate: new Date('2025-03-30') },
      { id: 85, title: 'Encyclopedia Britannica Set', description: '32 volume set, rare', price: 350, condition: 'good', category: 'books', subcategory: 'Reference', location: 'Patna, Bihar', images: ['https://images.unsplash.com/photo-1589998059171-988d887df646?w=400'], owner: { name: 'Dr. Smith', rating: 4.8 }, postedDate: new Date('2025-03-31') },
      // Children Books
      { id: 86, title: 'Disney Stories Collection', description: '20 storybooks, colorful', price: 40, condition: 'good', category: 'books', subcategory: 'Children Books', location: 'Bhopal, Madhya Pradesh', images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'], owner: { name: 'Mary Johnson', rating: 4.7 }, postedDate: new Date('2025-04-01') },
      { id: 87, title: 'Dr. Seuss Complete Collection', description: 'All classic books, hardcover', price: 95, condition: 'excellent', category: 'books', subcategory: 'Children Books', location: 'Hyderabad, Telangana', images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'], owner: { name: 'Linda Brown', rating: 4.8 }, postedDate: new Date('2025-04-02') },

      // ===== SPORTS =====
      // Cricket
      { id: 88, title: 'MRF Cricket Bat - Kashmir Willow', description: 'Professional bat, well maintained', price: 85, condition: 'good', category: 'sports', subcategory: 'Cricket', location: 'Mumbai, India', images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400'], owner: { name: 'Rohit Sharma', rating: 4.7 }, postedDate: new Date('2025-04-03') },
      { id: 89, title: 'Complete Cricket Kit', description: 'Bat, pads, gloves, helmet included', price: 220, condition: 'excellent', category: 'sports', subcategory: 'Cricket', location: 'Delhi, India', images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400'], owner: { name: 'Virat Kohli', rating: 4.9 }, postedDate: new Date('2025-04-04') },
      // Football
      { id: 90, title: 'Nike Football - Official Size 5', description: 'Professional football, rarely used', price: 35, condition: 'excellent', category: 'sports', subcategory: 'Football', location: 'Kochi, Kerala', images: ['https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=400'], owner: { name: 'David Beckham', rating: 4.8 }, postedDate: new Date('2025-04-05') },
      { id: 91, title: 'Football Goal Post Set', description: 'Portable, easy to assemble', price: 120, condition: 'good', category: 'sports', subcategory: 'Football', location: 'Thiruvananthapuram, Kerala', images: ['https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400'], owner: { name: 'Wayne Rooney', rating: 4.6 }, postedDate: new Date('2025-04-06') },
      // Gym Equipment
      { id: 92, title: 'Home Gym Equipment Set', description: 'Dumbbells, bench, resistance bands', price: 650, condition: 'excellent', category: 'sports', subcategory: 'Gym Equipment', location: 'Agra, Uttar Pradesh', images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400'], owner: { name: 'Lily Garcia', rating: 4.9 }, postedDate: new Date('2025-03-02') },
      { id: 93, title: 'Treadmill - Motorized', description: 'Electric treadmill, multiple programs', price: 450, condition: 'good', category: 'sports', subcategory: 'Gym Equipment', location: 'Pune, Maharashtra', images: ['https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400'], owner: { name: 'John Smith', rating: 4.7 }, postedDate: new Date('2025-04-07') },
      { id: 94, title: 'Adjustable Dumbbells 20kg', description: 'Space-saving, adjustable weight', price: 180, condition: 'excellent', category: 'sports', subcategory: 'Gym Equipment', location: 'Surat, Gujarat', images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400'], owner: { name: 'Mike Johnson', rating: 4.8 }, postedDate: new Date('2025-04-08') },
      // Cycling
      { id: 95, title: 'Mountain Bike - Trek Marlin 7', description: '29" wheels, 21-speed', price: 420, condition: 'excellent', category: 'sports', subcategory: 'Cycling', location: 'Kolkata, West Bengal', images: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400'], owner: { name: 'Tom Martinez', rating: 4.6 }, postedDate: new Date('2025-01-22') },
      { id: 96, title: 'Road Bicycle - Giant TCR', description: 'Carbon fiber, lightweight', price: 950, condition: 'excellent', category: 'sports', subcategory: 'Cycling', location: 'Shimla, Himachal Pradesh', images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400'], owner: { name: 'Mason Lopez', rating: 4.8 }, postedDate: new Date('2025-03-03') },
      { id: 97, title: 'Electric Bicycle - 26 inch', description: 'E-bike, 50km range, pedal assist', price: 780, condition: 'excellent', category: 'sports', subcategory: 'Cycling', location: 'Bangalore, Karnataka', images: ['https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400'], owner: { name: 'Emma Wilson', rating: 4.9 }, postedDate: new Date('2025-04-09') },
      // Badminton
      { id: 98, title: 'Yonex Badminton Racket Set', description: '2 rackets, shuttlecocks included', price: 95, condition: 'excellent', category: 'sports', subcategory: 'Badminton', location: 'Bangalore, India', images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400'], owner: { name: 'PV Sindhu', rating: 4.8 }, postedDate: new Date('2025-04-10') },
      { id: 99, title: 'Li-Ning Professional Racket', description: 'Tournament grade, carbon fiber', price: 120, condition: 'excellent', category: 'sports', subcategory: 'Badminton', location: 'Jakarta, Indonesia', images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400'], owner: { name: 'Lin Dan', rating: 4.9 }, postedDate: new Date('2025-04-11') },
      // Swimming
      { id: 100, title: 'Swimming Goggles - Speedo', description: 'Anti-fog, UV protection', price: 25, condition: 'new', category: 'sports', subcategory: 'Swimming', location: 'Chennai, Tamil Nadu', images: ['https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=400'], owner: { name: 'Michael Phelps', rating: 4.8 }, postedDate: new Date('2025-04-12') },
      { id: 101, title: 'Swimming Fins and Snorkel Set', description: 'Perfect for training', price: 45, condition: 'excellent', category: 'sports', subcategory: 'Swimming', location: 'Hawaii', images: ['https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400'], owner: { name: 'Katie Ledecky', rating: 4.9 }, postedDate: new Date('2025-04-13') },

      // ===== PETS =====
      // Dogs
      { id: 102, title: 'Golden Retriever Puppies', description: 'Adorable puppies, 8 weeks old', price: 800, condition: 'new', category: 'pets', subcategory: 'Dogs', location: 'Coimbatore, Tamil Nadu', images: ['https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400'], owner: { name: 'Grace Wilson', rating: 4.9 }, postedDate: new Date('2025-02-27') },
      { id: 103, title: 'German Shepherd - 1 Year Old', description: 'Well trained, friendly', price: 650, condition: 'good', category: 'pets', subcategory: 'Dogs', location: 'Nagpur, Maharashtra', images: ['https://images.unsplash.com/photo-1568572933382-74d440642117?w=400'], owner: { name: 'Mark Johnson', rating: 4.7 }, postedDate: new Date('2025-04-14') },
      { id: 104, title: 'Labrador Puppy - 3 Months', description: 'Vaccinated, playful', price: 550, condition: 'new', category: 'pets', subcategory: 'Dogs', location: 'Hyderabad, Telangana', images: ['https://images.unsplash.com/photo-1612536223527-d0bceb0a5f43?w=400'], owner: { name: 'Sarah Davis', rating: 4.8 }, postedDate: new Date('2025-04-15') },
      // Cats
      { id: 105, title: 'Persian Cat - 2 Years Old', description: 'White Persian, very friendly', price: 450, condition: 'good', category: 'pets', subcategory: 'Cats', location: 'Patna, Bihar', images: ['https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=400'], owner: { name: 'Hannah Rodriguez', rating: 4.7 }, postedDate: new Date('2025-02-28') },
      { id: 106, title: 'British Shorthair Kittens', description: 'Grey kittens, 10 weeks old', price: 600, condition: 'new', category: 'pets', subcategory: 'Cats', location: 'Surat, Gujarat', images: ['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400'], owner: { name: 'Emily Brown', rating: 4.8 }, postedDate: new Date('2025-04-16') },
      { id: 107, title: 'Siamese Cat - 1 Year', description: 'Blue eyes, loving personality', price: 380, condition: 'good', category: 'pets', subcategory: 'Cats', location: 'Kolkata, West Bengal', images: ['https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400'], owner: { name: 'Olivia Wilson', rating: 4.6 }, postedDate: new Date('2025-04-17') },
      // Birds
      { id: 108, title: 'African Grey Parrot', description: 'Talking parrot, 3 years old', price: 1200, condition: 'good', category: 'pets', subcategory: 'Birds', location: 'Chennai, Tamil Nadu', images: ['https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400'], owner: { name: 'Carlos Martinez', rating: 4.8 }, postedDate: new Date('2025-04-18') },
      { id: 109, title: 'Cockatiel Pair', description: 'Friendly pair, with cage', price: 250, condition: 'good', category: 'pets', subcategory: 'Birds', location: 'Ahmedabad, Gujarat', images: ['https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400'], owner: { name: 'Lisa Anderson', rating: 4.7 }, postedDate: new Date('2025-04-19') },
      // Fish
      { id: 110, title: 'Aquarium with Fish - 50 Gallon', description: 'Complete setup, tropical fish', price: 320, condition: 'good', category: 'pets', subcategory: 'Fish', location: 'Vadodara, Gujarat', images: ['https://images.unsplash.com/photo-1520990622508-8cee6340d70c?w=400'], owner: { name: 'David Chen', rating: 4.6 }, postedDate: new Date('2025-04-20') },
      { id: 111, title: 'Goldfish Bowl Set', description: 'Small bowl, 3 goldfish', price: 45, condition: 'good', category: 'pets', subcategory: 'Fish', location: 'Pune, Maharashtra', images: ['https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400'], owner: { name: 'Anna Taylor', rating: 4.5 }, postedDate: new Date('2025-04-21') },
      // Pet Food
      { id: 112, title: 'Premium Dog Food - 20kg', description: 'Pedigree adult, sealed pack', price: 85, condition: 'new', category: 'pets', subcategory: 'Pet Food', location: 'Mumbai, Maharashtra', images: ['https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'], owner: { name: 'Pet Store Owner', rating: 4.9 }, postedDate: new Date('2025-04-22') },
      { id: 113, title: 'Cat Food Variety Pack', description: 'Whiskas, 24 pouches', price: 35, condition: 'new', category: 'pets', subcategory: 'Pet Food', location: 'Delhi, Delhi', images: ['https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400'], owner: { name: 'Cat Lover', rating: 4.8 }, postedDate: new Date('2025-04-23') },
      // Accessories
      { id: 114, title: 'Dog Collar and Leash Set', description: 'Leather, adjustable size', price: 28, condition: 'new', category: 'pets', subcategory: 'Accessories', location: 'Hyderabad, Telangana', images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400'], owner: { name: 'Pet Supplies', rating: 4.7 }, postedDate: new Date('2025-04-24') },
      { id: 115, title: 'Cat Scratching Post', description: 'Tall post, sisal rope', price: 45, condition: 'excellent', category: 'pets', subcategory: 'Accessories', location: 'Kolkata, West Bengal', images: ['https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400'], owner: { name: 'Feline Friend', rating: 4.6 }, postedDate: new Date('2025-04-25') },

      // ===== PROPERTIES =====
      // Apartments
      { id: 116, title: '2BHK Apartment for Rent', description: 'Spacious, modern amenities', price: 1500, condition: 'excellent', category: 'properties', subcategory: 'Apartments', location: 'Delhi, Delhi', images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'], owner: { name: 'Andrew Thompson', rating: 4.7 }, postedDate: new Date('2025-03-04') },
      { id: 117, title: 'Luxury 3BHK Penthouse', description: 'Top floor, panoramic views', price: 3500, condition: 'excellent', category: 'properties', subcategory: 'Apartments', location: 'Chennai, Tamil Nadu', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'], owner: { name: 'Elite Realty', rating: 4.9 }, postedDate: new Date('2025-04-26') },
      { id: 118, title: 'Studio Apartment - Downtown', description: 'Furnished, utilities included', price: 950, condition: 'good', category: 'properties', subcategory: 'Apartments', location: 'Bangalore, Karnataka', images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'], owner: { name: 'Chloe White', rating: 4.8 }, postedDate: new Date('2025-03-05') },
      // Villas
      { id: 119, title: '4BHK Villa with Pool', description: 'Spacious villa, private pool', price: 5500, condition: 'excellent', category: 'properties', subcategory: 'Villas', location: 'Mumbai, Maharashtra', images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400'], owner: { name: 'Luxury Homes', rating: 4.9 }, postedDate: new Date('2025-04-27') },
      { id: 120, title: 'Beachfront Villa', description: 'Ocean view, 5BHK, luxury', price: 8500, condition: 'excellent', category: 'properties', subcategory: 'Villas', location: 'Goa, Goa', images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400'], owner: { name: 'Coastal Properties', rating: 5.0 }, postedDate: new Date('2025-04-28') },
    ];
    setItems(mockItems);
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
