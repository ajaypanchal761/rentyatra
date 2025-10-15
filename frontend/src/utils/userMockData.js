// Mock data for User Profile

export const DEMO_USER_PROFILE = {
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  phone: '+91 98765 43210',
  address: '123 Green Park, Sector 15',
  city: 'New Delhi',
  state: 'Delhi',
  pincode: '110015',
  profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  documents: [
    {
      type: 'aadhar',
      front: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=400&h=250&fit=crop',
      back: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=250&fit=crop',
      status: 'verified',
      uploadDate: '2024-01-15'
    },
    {
      type: 'pan',
      front: 'https://images.unsplash.com/photo-1554224311-beee4ece0933?w=400&h=250&fit=crop',
      status: 'verified',
      uploadDate: '2024-01-16'
    }
  ],
  accountStatus: 'verified',
  memberSince: '2024-01-10',
  totalListings: 8,
  activeListings: 5,
  totalBookings: 23,
  totalRevenue: '₹45,600',
  rating: 4.8,
  totalReviews: 34,
  subscription: {
    plan: 'Premium',
    status: 'active',
    expiresAt: '2024-12-31'
  }
};

export const DEMO_RECENT_ACTIVITY = [
  {
    id: 1,
    type: 'booking',
    title: 'New booking for Canon Camera',
    description: 'Someone booked your Canon EOS R6 Camera for 3 days',
    amount: '₹1,350',
    date: '2024-03-20',
    status: 'completed'
  },
  {
    id: 2,
    type: 'listing',
    title: 'Listing approved',
    description: 'Your Mountain Bike listing has been approved and is now live',
    amount: null,
    date: '2024-03-18',
    status: 'completed'
  },
  {
    id: 3,
    type: 'payment',
    title: 'Payment received',
    description: 'Payment received for Gaming Laptop rental',
    amount: '₹960',
    date: '2024-03-15',
    status: 'completed'
  },
  {
    id: 4,
    type: 'review',
    title: 'New review received',
    description: 'You received a 5-star review from Sarah Williams',
    amount: null,
    date: '2024-03-12',
    status: 'completed'
  }
];

export const DEMO_MY_LISTINGS = [
  {
    id: 'LST001',
    title: 'Canon EOS R6 Camera',
    category: 'Electronics',
    price: 450,
    priceType: 'per day',
    status: 'Active',
    views: 1245,
    bookings: 23,
    revenue: '₹10,350',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop',
    featured: true,
    boosted: false
  },
  {
    id: 'LST002',
    title: 'Mountain Bike Pro',
    category: 'Sports',
    price: 85,
    priceType: 'per day',
    status: 'Active',
    views: 892,
    bookings: 18,
    revenue: '₹1,530',
    image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=100&h=100&fit=crop',
    featured: false,
    boosted: true
  },
  {
    id: 'LST003',
    title: 'Gaming Laptop RTX 4070',
    category: 'Electronics',
    price: 320,
    priceType: 'per day',
    status: 'Pending',
    views: 2134,
    bookings: 0,
    revenue: '₹0',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=100&h=100&fit=crop',
    featured: false,
    boosted: false
  },
  {
    id: 'LST004',
    title: 'Wedding Dress Designer',
    category: 'Fashion',
    price: 180,
    priceType: 'per day',
    status: 'Active',
    views: 1876,
    bookings: 15,
    revenue: '₹2,700',
    image: 'https://images.unsplash.com/photo-1594552072238-b6c5a76d1e0f?w=100&h=100&fit=crop',
    featured: false,
    boosted: false
  }
];

export const DEMO_RECENT_BOOKINGS = [
  {
    id: 'BK001',
    listingTitle: 'Canon EOS R6 Camera',
    customerName: 'Priya Patel',
    customerPhone: '+91 87654 32109',
    startDate: '2024-03-25',
    endDate: '2024-03-27',
    duration: '3 days',
    amount: '₹1,350',
    status: 'confirmed',
    bookingDate: '2024-03-20'
  },
  {
    id: 'BK002',
    listingTitle: 'Mountain Bike Pro',
    customerName: 'Amit Kumar',
    customerPhone: '+91 76543 21098',
    startDate: '2024-03-22',
    endDate: '2024-03-24',
    duration: '2 days',
    amount: '₹170',
    status: 'completed',
    bookingDate: '2024-03-18'
  },
  {
    id: 'BK003',
    listingTitle: 'Gaming Laptop RTX 4070',
    customerName: 'Neha Singh',
    customerPhone: '+91 65432 10987',
    startDate: '2024-03-16',
    endDate: '2024-03-18',
    duration: '2 days',
    amount: '₹640',
    status: 'completed',
    bookingDate: '2024-03-15'
  }
];

export const DEMO_ACCOUNT_STATS = {
  totalEarnings: '₹45,600',
  thisMonthEarnings: '₹8,920',
  averageRating: 4.8,
  totalReviews: 34,
  responseRate: '98%',
  completionRate: '96%'
};
