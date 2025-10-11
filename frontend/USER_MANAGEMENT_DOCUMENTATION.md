# User Management Component - Documentation

## 🎯 Overview

The User Management component is a comprehensive, feature-rich admin interface for managing users in the RentYatra platform. It provides a clean, modern UI with powerful features for user administration.

## ✨ Features

### 1. **Statistics Dashboard**
- **Total Users**: Shows the total number of registered users
- **Active Users**: Count of currently active users
- **Inactive Users**: Count of inactive users
- **Banned Users**: Count of blocked/banned users

Each stat card features:
- Color-coded borders (Blue, Green, Yellow, Red)
- Icon representation
- Large, readable numbers
- Responsive grid layout

### 2. **Advanced Search & Filtering**
- **Search**: Real-time search by name, email, or user ID
- **Status Filter**: Filter by Active, Inactive, or Banned status
- **Plan Filter**: Filter by subscription plan (Basic, Pro, Premium)
- **Combined Filtering**: All filters work together seamlessly

### 3. **User Table**
Displays comprehensive user information:
- User avatar with profile image
- Full name and email
- User ID (monospace font for clarity)
- Subscription plan badge
- Status badge with colored indicators
- Join date
- Action buttons

### 4. **Bulk Actions**
- **Select All**: Checkbox to select all users on current page
- **Individual Selection**: Checkbox for each user
- **Bulk Delete**: Delete multiple users at once
- **Selection Counter**: Shows number of selected users

### 5. **User Actions**
Each user has quick action buttons:
- 👁️ **View**: Opens detailed user profile modal
- ✏️ **Edit**: Opens edit form modal
- 📧 **Email**: Opens email compose modal
- 🚫 **Block/Unblock**: Toggle user ban status
- 🗑️ **Delete**: Opens delete confirmation modal

### 6. **Pagination**
- Shows 10 users per page (configurable)
- Smart pagination with 5 visible page numbers
- Previous/Next navigation buttons
- Current page highlighting
- Displays result range (e.g., "Showing 1 to 10 of 45 users")

### 7. **Export Functionality**
- Export user data to CSV/Excel
- Export button in header
- Exports filtered results

### 8. **Modals**

#### View User Modal
- User avatar and basic info
- Status badge
- Detailed information grid:
  - User ID
  - Subscription plan
  - Join date
  - Account status
  - Total products
  - Total bookings
  - Revenue generated
  - Last login
- Recent activity feed
- Edit button quick access

#### Edit User Modal
- Form fields for:
  - Full name
  - Email address
  - Subscription plan (dropdown)
  - Account status (dropdown)
- Form validation
- Save/Cancel actions

#### Delete Confirmation Modal
- Warning icon
- User name confirmation
- Detailed warning message
- Irreversibility notice
- Cancel/Confirm buttons

#### Send Email Modal
- To: field (auto-filled, disabled)
- Subject line input
- Message textarea
- Send/Cancel actions

### 9. **Empty State**
- Displays when no users match filters
- User icon
- "No users found" message
- Helpful text to adjust filters

### 10. **Responsive Design**
- ✅ Desktop: Full table layout with all features
- ✅ Tablet: Adjusted grid and spacing
- ✅ Mobile: Horizontal scroll for table, stacked filters

## 🎨 UI/UX Features

### Color Scheme
- **Primary**: Indigo (buttons, highlights)
- **Success**: Green (active status)
- **Warning**: Yellow (inactive status)  
- **Danger**: Red (banned status, delete)
- **Neutral**: Slate (text, borders)

### Interactive Elements
- Hover effects on all clickable elements
- Smooth transitions (200ms)
- Focus states for keyboard navigation
- Loading states for async operations
- Disabled states for unavailable actions

### Typography
- **Headers**: Bold, large text for hierarchy
- **Body**: Clear, readable slate colors
- **IDs**: Monospace font for user IDs
- **Badges**: Small, uppercase text with icons

### Spacing & Layout
- Consistent padding (4, 6, 8 units)
- Card-based design with shadows
- White background for content areas
- Border separators for sections

## 📊 Data Management

### State Management
```javascript
- users: Array of user objects
- searchTerm: Current search query
- filterStatus: Selected status filter
- filterPlan: Selected plan filter
- currentPage: Active pagination page
- selectedUsers: Array of selected user IDs
- Modal states: emailingUser, viewingUser, editingUser, deletingUser
```

### User Object Structure
```javascript
{
  id: 'USR001',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://...',
  plan: 'Premium',
  status: 'Active',
  joinedDate: '2024-01-15'
}
```

## 🔧 Functions

### Filtering Functions
- `filteredUsers`: Filters users based on search and filter criteria
- Resets to page 1 when filters change

### Pagination Functions
- `paginatedUsers`: Slices filtered users for current page
- `totalPages`: Calculates total number of pages

### Action Handlers
- `handleSelectAll()`: Toggle all checkboxes on page
- `handleSelectUser()`: Toggle individual user checkbox
- `handleBlockUser()`: Toggle user ban status
- `handleDeleteUser()`: Remove user from list
- `handleSaveUser()`: Update user information
- `handleExport()`: Export user data
- `handleBulkDelete()`: Delete multiple selected users

## 🚀 How to Use

### 1. Search Users
Type in the search box to filter by name, email, or ID in real-time.

### 2. Apply Filters
Use the status and plan dropdowns to narrow down results.

### 3. View User Details
Click the eye icon to see comprehensive user information.

### 4. Edit User
Click the edit icon to modify user details. Changes are saved immediately.

### 5. Send Email
Click the mail icon to compose and send an email to the user.

### 6. Block/Unblock User
Click the block icon to ban or unban a user account.

### 7. Delete User
Click the trash icon and confirm to permanently delete a user.

### 8. Bulk Operations
1. Select multiple users using checkboxes
2. Use "Delete Selected" for bulk deletion

### 9. Export Data
Click the "Export" button to download user data.

### 10. Navigate Pages
Use pagination controls at the bottom to browse through pages.

## 💡 Best Practices

1. **Always confirm** before deleting users
2. **Use filters** to find specific users quickly
3. **Block instead of delete** when temporary restriction needed
4. **Export data** before bulk operations
5. **Review user details** before making changes

## 🔒 Security Considerations

- Confirm all destructive actions
- Audit trail for user modifications
- Role-based access control
- Email validation
- Status change logging

## 📱 Mobile Responsiveness

- Stats cards stack vertically on mobile
- Table scrolls horizontally
- Filters stack in mobile view
- Action buttons remain accessible
- Modals are full-screen on mobile

## 🎯 Performance Optimizations

- Pagination reduces DOM elements
- Efficient filtering with array methods
- Debounced search (can be added)
- Lazy loading for avatars
- Optimized re-renders

## 🔄 Future Enhancements

- [ ] Advanced sorting options
- [ ] Date range filters
- [ ] Activity history per user
- [ ] User analytics dashboard
- [ ] Bulk email sending
- [ ] CSV import functionality
- [ ] Role management
- [ ] Permission settings
- [ ] Login history
- [ ] Two-factor authentication toggle

## 📝 Notes

- Mock data is used for demonstration
- Replace with actual API calls in production
- Add error handling for API failures
- Implement loading states
- Add success/error notifications
- Consider adding real-time updates with WebSocket

---

**Component Location**: `src/components/admin/views/UserManagementView.jsx`

**Dependencies**:
- AdminIcons (all icons)
- SendEmailModal
- ViewUserModal
- EditUserModal
- DeleteConfirmModal
- adminMockData (user data)

**Access**: Navigate to `/admin` → Click "Users" in sidebar




