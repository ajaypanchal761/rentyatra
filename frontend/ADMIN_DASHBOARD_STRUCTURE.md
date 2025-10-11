# Admin Dashboard - Organized Structure

## 📁 Folder Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── admin/
│   │       ├── layout/
│   │       │   ├── AdminSidebar.jsx      # Sidebar navigation component
│   │       │   └── AdminHeader.jsx       # Header with user dropdown
│   │       ├── views/
│   │       │   ├── DashboardView.jsx     # Main dashboard with stats
│   │       │   ├── UserManagementView.jsx # User management table
│   │       │   ├── ProductManagementView.jsx # Product management table
│   │       │   └── PlaceholderView.jsx   # Reusable placeholder for unbuilt pages
│   │       ├── common/
│   │       │   └── StatCard.jsx          # Reusable stat card component
│   │       ├── icons/
│   │       │   └── AdminIcons.jsx        # All SVG icons in one file
│   │       └── modals/
│   │           └── SendEmailModal.jsx    # Email modal for user management
│   ├── pages/
│   │   └── Admindashboard/
│   │       └── AdminDashboard.jsx        # Main admin dashboard container
│   └── utils/
│       └── adminMockData.js              # All mock data for admin features
```

## 🎯 Features Implemented

### ✅ Layout Components
- **AdminSidebar**: Fixed sidebar with 9 navigation items
  - Dashboard, Users, Products, Subscriptions, Boosts, Payments, Ad Banners, Notifications, Referrals
  - Mobile responsive with drawer functionality
  - Active state highlighting

- **AdminHeader**: Fixed header with dropdown menu
  - Mobile menu toggle button
  - Admin profile dropdown with logout functionality
  - Responsive design

### ✅ View Components
- **DashboardView**: 
  - 6 stat cards (Users, Products, Revenue, Subscriptions, Boosts)
  - Recent activity feed
  - Quick action buttons

- **UserManagementView**:
  - Search functionality
  - User table with avatars, status badges
  - Email users directly with modal
  - Action menu for each user (View, Edit, Block/Unblock, Delete)

- **ProductManagementView**:
  - Search and filter by status
  - Product table with detailed info
  - Approve/Reject actions for pending products

- **PlaceholderView**:
  - Generic component for unbuilt pages
  - Used for Subscriptions, Boosts, Payments, Ad Banners, Notifications, Referrals

### ✅ Common Components
- **StatCard**: Reusable card for displaying statistics with icons
- **SendEmailModal**: Modal for sending emails to users

### ✅ Icons
- All SVG icons consolidated in `AdminIcons.jsx`
- Exported as named components
- Easy to import and use throughout the admin section

### ✅ Mock Data
- Comprehensive mock data in `adminMockData.js`:
  - MOCK_STATS (dashboard statistics)
  - MOCK_ALL_USERS (user data)
  - MOCK_PRODUCTS (product listings)
  - MOCK_SUBSCRIPTIONS (subscription data)
  - MOCK_BOOSTS (boost data)
  - MOCK_PAYMENTS (payment transactions)
  - MOCK_BANNERS (ad banners)
  - MOCK_NOTIFICATIONS (system notifications)
  - MOCK_REFERRALS (referral data)

## 🚀 How to Access

Visit `/admin` route to access the admin dashboard.

The admin dashboard is rendered separately from the main app (no navbar/footer) as configured in `App.jsx`.

## 🎨 Design System

- **Color Scheme**: Slate + Indigo accent colors
- **Typography**: Inter font family
- **Components**: Modern card-based UI with shadows and hover effects
- **Responsive**: Fully responsive with mobile drawer sidebar
- **Icons**: Custom SVG icons for all sections

## 📝 Future Enhancements

The following pages need to be built out (currently using PlaceholderView):
1. Subscription Management
2. Boost Management  
3. Payment Management
4. Ad Banner Management
5. Notification Management
6. Referral System

Simply create new view components in `components/admin/views/` and import them in `AdminDashboard.jsx`.

## 🔧 How to Extend

### Adding a New Page:
1. Create a new view component in `components/admin/views/YourNewView.jsx`
2. Import it in `pages/Admindashboard/AdminDashboard.jsx`
3. Add a case in the `renderContent()` switch statement
4. Add navigation item in `AdminSidebar.jsx` if needed

### Adding New Mock Data:
1. Add your mock data in `utils/adminMockData.js`
2. Export it and import where needed

### Adding New Icons:
1. Add new SVG icon component in `components/admin/icons/AdminIcons.jsx`
2. Export it as a named export
3. Import and use: `import { YourIcon } from '../icons/AdminIcons'`

## ✨ Benefits of This Structure

1. **Organized**: Clear separation of concerns
2. **Maintainable**: Easy to find and update components
3. **Reusable**: Components can be reused across different views
4. **Scalable**: Easy to add new features
5. **Clean**: No duplicate code or messy imports
6. **Professional**: Industry-standard folder structure




