// Mock data for Admin Dashboard

export const MOCK_STATS = [
  { id: 1, title: 'Total Users', value: '12,458', icon: 'UsersIcon', color: 'text-blue-500' },
  { id: 2, title: 'Total Products', value: '3,890', icon: 'ProductsIcon', color: 'text-indigo-500' },
  { id: 3, title: 'Total Revenue', value: '₹36,18,480', icon: 'RevenueIcon', color: 'text-green-500' },
  { id: 4, title: 'Monthly Revenue', value: '₹4,62,560', icon: 'RevenueIcon', color: 'text-teal-500' },
  { id: 5, title: 'Active Subscriptions', value: '1,240', icon: 'SubscriptionIcon', color: 'text-yellow-500' },
  { id: 6, title: 'Active Boosts', value: '312', icon: 'BoostIcon', color: 'text-purple-500' }
];

export const MOCK_ALL_USERS = [
  {
    id: 'USR001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://placehold.co/40x40/3B82F6/FFFFFF?text=JD',
    plan: 'Premium',
    status: 'Active',
    joinedDate: '2024-01-15',
    aadharCardFront: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=400&h=250&fit=crop',
    aadharCardBack: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=250&fit=crop'
  },
  {
    id: 'USR002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://placehold.co/40x40/8B5CF6/FFFFFF?text=JS',
    plan: 'Basic',
    status: 'Active',
    joinedDate: '2024-02-20',
    aadharCardFront: 'https://images.unsplash.com/photo-1554224311-beee4ece0933?w=400&h=250&fit=crop',
    aadharCardBack: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=250&fit=crop'
  },
  {
    id: 'USR003',
    name: 'Mike Johnson',
    email: 'mike.j@example.com',
    avatar: 'https://placehold.co/40x40/EC4899/FFFFFF?text=MJ',
    plan: 'Pro',
    status: 'Active',
    joinedDate: '2024-01-10',
    aadharCardFront: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=250&fit=crop',
    aadharCardBack: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop'
  },
  {
    id: 'USR004',
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    avatar: 'https://placehold.co/40x40/10B981/FFFFFF?text=SW',
    plan: 'Basic',
    status: 'Inactive',
    joinedDate: '2024-03-05',
    aadharCardFront: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=250&fit=crop',
    aadharCardBack: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=250&fit=crop'
  },
  {
    id: 'USR005',
    name: 'David Brown',
    email: 'david.brown@example.com',
    avatar: 'https://placehold.co/40x40/F59E0B/FFFFFF?text=DB',
    plan: 'Premium',
    status: 'Banned',
    joinedDate: '2023-12-12',
    aadharCardFront: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=400&h=250&fit=crop',
    aadharCardBack: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=250&fit=crop'
  },
  {
    id: 'USR006',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    avatar: 'https://placehold.co/40x40/EF4444/FFFFFF?text=ED',
    plan: 'Pro',
    status: 'Active',
    joinedDate: '2024-02-28',
    aadharCardFront: 'https://images.unsplash.com/photo-1554224311-beee4ece0933?w=400&h=250&fit=crop',
    aadharCardBack: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=250&fit=crop'
  },
  {
    id: 'USR007',
    name: 'Robert Wilson',
    email: 'robert.w@example.com',
    avatar: 'https://placehold.co/40x40/06B6D4/FFFFFF?text=RW',
    plan: 'Basic',
    status: 'Active',
    joinedDate: '2024-03-15',
    aadharCardFront: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=250&fit=crop',
    aadharCardBack: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop'
  },
  {
    id: 'USR008',
    name: 'Lisa Anderson',
    email: 'lisa.a@example.com',
    avatar: 'https://placehold.co/40x40/84CC16/FFFFFF?text=LA',
    plan: 'Premium',
    status: 'Active',
    joinedDate: '2024-01-25',
    aadharCardFront: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=250&fit=crop',
    aadharCardBack: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=250&fit=crop'
  }
];

export const MOCK_PRODUCTS = [
  {
    id: 'PRD001',
    title: 'Canon EOS R6 Camera',
    description: 'Professional mirrorless camera with 20MP full-frame sensor, 4K video recording, and advanced autofocus system.',
    category: 'Electronics',
    owner: 'John Doe',
    ownerId: 'USR001',
    ownerEmail: 'john.doe@example.com',
    price: 450,
    priceType: 'per day',
    status: 'Active',
    views: 1245,
    favorites: 89,
    bookings: 23,
    revenue: 10350,
    location: 'Delhi, Delhi',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400'],
    featured: true,
    boosted: false,
    condition: 'Excellent',
    createdDate: '2024-03-01',
    lastUpdated: '2024-03-15'
  },
  {
    id: 'PRD002',
    title: 'Mountain Bike Pro',
    description: 'High-performance mountain bike with carbon frame, 29-inch wheels, and hydraulic disc brakes.',
    category: 'Sports',
    owner: 'Jane Smith',
    ownerId: 'USR002',
    ownerEmail: 'jane.smith@example.com',
    price: 85,
    priceType: 'per day',
    status: 'Active',
    views: 892,
    favorites: 54,
    bookings: 18,
    revenue: 1530,
    location: 'Mumbai, Maharashtra',
    images: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400', 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=400'],
    featured: false,
    boosted: true,
    condition: 'Good',
    createdDate: '2024-03-05',
    lastUpdated: '2024-03-18'
  },
  {
    id: 'PRD003',
    title: 'Gaming Laptop RTX 4070',
    description: 'Powerful gaming laptop with RTX 4070 GPU, 32GB RAM, 1TB SSD, and 165Hz display.',
    category: 'Electronics',
    owner: 'Mike Johnson',
    ownerId: 'USR003',
    ownerEmail: 'mike.j@example.com',
    price: 320,
    priceType: 'per day',
    status: 'Pending',
    views: 2134,
    favorites: 156,
    bookings: 0,
    revenue: 0,
    location: 'Pune, Maharashtra',
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400', 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400'],
    featured: false,
    boosted: false,
    condition: 'Like New',
    createdDate: '2024-03-10',
    lastUpdated: '2024-03-10'
  },
  {
    id: 'PRD004',
    title: '2-Bedroom Apartment Downtown',
    description: 'Spacious 2-bedroom apartment in downtown area with modern amenities, parking, and city views.',
    category: 'Real Estate',
    owner: 'Sarah Williams',
    ownerId: 'USR004',
    ownerEmail: 'sarah.w@example.com',
    price: 1200,
    priceType: 'per month',
    status: 'Active',
    views: 3567,
    favorites: 289,
    bookings: 67,
    revenue: 80400,
    location: 'Bangalore, Karnataka',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'],
    featured: true,
    boosted: true,
    condition: 'Excellent',
    createdDate: '2024-02-20',
    lastUpdated: '2024-03-12'
  },
  {
    id: 'PRD005',
    title: 'Tesla Model 3',
    description: 'Electric sedan with autopilot, long-range battery, and premium interior.',
    category: 'Vehicles',
    owner: 'David Brown',
    ownerId: 'USR005',
    ownerEmail: 'david.brown@example.com',
    price: 890,
    priceType: 'per day',
    status: 'Rejected',
    views: 4523,
    favorites: 412,
    bookings: 0,
    revenue: 0,
    location: 'Chennai, Tamil Nadu',
    images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400', 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=400'],
    featured: false,
    boosted: false,
    condition: 'Good',
    createdDate: '2024-02-15',
    lastUpdated: '2024-02-16',
    rejectionReason: 'Missing required documentation'
  },
  {
    id: 'PRD006',
    title: 'DJ Equipment Set',
    description: 'Complete DJ setup with controllers, mixer, speakers, and lighting equipment.',
    category: 'Electronics',
    owner: 'Emily Davis',
    ownerId: 'USR006',
    ownerEmail: 'emily.d@example.com',
    price: 250,
    priceType: 'per day',
    status: 'Pending',
    views: 567,
    favorites: 34,
    bookings: 0,
    revenue: 0,
    location: 'Austin, TX',
    images: ['https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=400'],
    featured: false,
    boosted: false,
    condition: 'Good',
    createdDate: '2024-03-18',
    lastUpdated: '2024-03-18'
  },
  {
    id: 'PRD007',
    title: 'Wedding Dress Designer',
    description: 'Elegant white wedding dress with lace details, perfect for special occasions.',
    category: 'Fashion',
    owner: 'Lisa Anderson',
    ownerId: 'USR008',
    ownerEmail: 'lisa.a@example.com',
    price: 180,
    priceType: 'per day',
    status: 'Active',
    views: 1876,
    favorites: 234,
    bookings: 15,
    revenue: 2700,
    location: 'Seattle, WA',
    images: ['https://images.unsplash.com/photo-1594552072238-b6c5a76d1e0f?w=400'],
    featured: false,
    boosted: false,
    condition: 'Excellent',
    createdDate: '2024-02-28',
    lastUpdated: '2024-03-14'
  },
  {
    id: 'PRD008',
    title: 'Luxury Yacht 50ft',
    description: 'Spacious luxury yacht with 3 cabins, fully equipped kitchen, and professional crew.',
    category: 'Vehicles',
    owner: 'Robert Wilson',
    ownerId: 'USR007',
    ownerEmail: 'robert.w@example.com',
    price: 2500,
    priceType: 'per day',
    status: 'Inactive',
    views: 8234,
    favorites: 678,
    bookings: 42,
    revenue: 105000,
    location: 'Miami Beach, FL',
    images: ['https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=400'],
    featured: true,
    boosted: false,
    condition: 'Excellent',
    createdDate: '2024-01-10',
    lastUpdated: '2024-03-10'
  }
];

export const MOCK_SUBSCRIPTIONS = [
  {
    id: 'SUB001',
    userId: 'USR001',
    userName: 'John Doe',
    plan: 'Premium',
    price: '$49.99',
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    status: 'Active',
    autoRenew: true
  },
  {
    id: 'SUB002',
    userId: 'USR002',
    userName: 'Jane Smith',
    plan: 'Basic',
    price: '$9.99',
    startDate: '2024-02-20',
    endDate: '2025-02-20',
    status: 'Active',
    autoRenew: true
  },
  {
    id: 'SUB003',
    userId: 'USR003',
    userName: 'Mike Johnson',
    plan: 'Pro',
    price: '$29.99',
    startDate: '2024-01-10',
    endDate: '2024-07-10',
    status: 'Expiring Soon',
    autoRenew: false
  }
];

export const MOCK_BOOSTS = [
  {
    id: 'BST001',
    productId: 'PRD001',
    productTitle: 'Canon EOS R6 Camera',
    userId: 'USR001',
    userName: 'John Doe',
    plan: '30-Day Boost',
    price: '$49.99',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    status: 'Active'
  },
  {
    id: 'BST002',
    productId: 'PRD004',
    productTitle: '2-Bedroom Apartment Downtown',
    userId: 'USR004',
    userName: 'Sarah Williams',
    plan: '15-Day Boost',
    price: '$29.99',
    startDate: '2024-03-10',
    endDate: '2024-03-25',
    status: 'Active'
  }
];

export const MOCK_PAYMENTS = [
  {
    id: 'PAY001',
    userId: 'USR001',
    userName: 'John Doe',
    type: 'Subscription',
    amount: '$49.99',
    status: 'Completed',
    method: 'Credit Card',
    date: '2024-01-15'
  },
  {
    id: 'PAY002',
    userId: 'USR001',
    userName: 'John Doe',
    type: 'Boost',
    amount: '$49.99',
    status: 'Completed',
    method: 'PayPal',
    date: '2024-03-01'
  },
  {
    id: 'PAY003',
    userId: 'USR002',
    userName: 'Jane Smith',
    type: 'Subscription',
    amount: '$9.99',
    status: 'Pending',
    method: 'Credit Card',
    date: '2024-02-20'
  },
  {
    id: 'PAY004',
    userId: 'USR003',
    userName: 'Mike Johnson',
    type: 'Subscription',
    amount: '$29.99',
    status: 'Failed',
    method: 'Debit Card',
    date: '2024-01-10'
  }
];

export const MOCK_BANNERS = [
  {
    id: 'BAN001',
    title: 'Summer Rental Specials 2024',
    type: 'Promotional',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    status: 'Scheduled',
    clicks: 0,
    impressions: 0
  },
  {
    id: 'BAN002',
    title: 'New Category Launch',
    type: 'Announcement',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    status: 'Active',
    clicks: 2345,
    impressions: 45678
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'NOT001',
    title: 'Welcome to RentYatra',
    message: 'Thank you for joining our platform!',
    type: 'System',
    recipients: 'All New Users',
    sentDate: '2024-03-01',
    status: 'Sent'
  },
  {
    id: 'NOT002',
    title: 'Subscription Expiring Soon',
    message: 'Your subscription will expire in 7 days.',
    type: 'Alert',
    recipients: 'Expiring Subscriptions',
    sentDate: '2024-03-10',
    status: 'Sent'
  }
];

export const MOCK_REFERRALS = [
  {
    id: 'REF001',
    referrerId: 'USR001',
    referrerName: 'John Doe',
    referredId: 'USR007',
    referredName: 'Robert Wilson',
    status: 'Completed',
    reward: '$10',
    date: '2024-03-15'
  },
  {
    id: 'REF002',
    referrerId: 'USR002',
    referrerName: 'Jane Smith',
    referredId: 'USR008',
    referredName: 'Lisa Anderson',
    status: 'Pending',
    reward: '$10',
    date: '2024-01-25'
  }
];



