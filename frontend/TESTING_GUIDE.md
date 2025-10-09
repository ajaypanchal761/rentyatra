# 🧪 Testing Guide - RentX Application

## Quick Start Testing

### 1️⃣ Homepage Testing

**Navigate to**: http://localhost:5175/

✅ **What to Test**:
- [ ] Hero section displays with search bar
- [ ] 8 category cards are visible and clickable
- [ ] Featured listings show 2 sample items (iPhone, Toyota)
- [ ] Search bar works (type "iPhone" and press Enter)
- [ ] Popular search tags work (Cars, Laptops, etc.)
- [ ] Navbar is sticky on scroll
- [ ] Footer displays at bottom

**Mobile Testing**:
- [ ] Resize browser to mobile width (< 768px)
- [ ] Hamburger menu appears
- [ ] Search bar moves below navbar
- [ ] Categories display in 2 columns
- [ ] Featured items in single column

---

### 2️⃣ Search & Listings Page

**Navigate to**: http://localhost:5175/listings

✅ **What to Test**:
- [ ] All items display in grid (2 items currently)
- [ ] Filter sidebar shows on left (desktop)
- [ ] Click "Filters" button on mobile to show sidebar
- [ ] Select different categories (filter works)
- [ ] Adjust price range sliders
- [ ] Type location in location filter
- [ ] "Clear All" button resets filters
- [ ] Heart icon adds to favorites (red when clicked)
- [ ] Item count shows "2 items found"
- [ ] Clicking item card navigates to detail page

**Filter Testing**:
```
Test 1: Category Filter
- Select "Electronics" → Should show iPhone
- Select "Cars" → Should show Toyota

Test 2: Price Filter
- Set min: 0, max: 1000 → Should show iPhone only
- Set min: 20000, max: 30000 → Should show Toyota only

Test 3: Search + Filter Combo
- Search "iPhone" + Select "Electronics" → 1 result
```

---

### 3️⃣ Item Detail Page

**Navigate to**: Click any item OR http://localhost:5175/item/1

✅ **What to Test**:
- [ ] Large image displays
- [ ] Thumbnail images (if multiple)
- [ ] Item title, description, price visible
- [ ] Location and posted date show (DD/MM/YYYY format)
- [ ] Seller information card on right
- [ ] "Chat with Seller" button present
- [ ] "Show Phone Number" button present
- [ ] Heart icon toggles favorite
- [ ] Share button works (copies URL or opens share dialog)
- [ ] "Back" button returns to previous page
- [ ] Safety tips section at bottom

**Mobile Testing**:
- [ ] Seller card moves below item details
- [ ] Image gallery scrollable horizontally
- [ ] All buttons easily tappable

---

### 4️⃣ Authentication Flow

#### Login Test

**Navigate to**: http://localhost:5175/login

✅ **What to Test**:
- [ ] Login form displays
- [ ] Email and password fields work
- [ ] Eye icon toggles password visibility
- [ ] "Remember me" checkbox
- [ ] Form validation (empty fields show error)
- [ ] Enter any email/password and click Login
- [ ] Redirects to homepage after login
- [ ] Navbar shows user name instead of Login button
- [ ] "Sell" button appears in navbar
- [ ] User dropdown menu works

**Test Credentials** (mock - any works):
```
Email: test@example.com
Password: password123
```

#### Signup Test

**Navigate to**: http://localhost:5175/signup

✅ **What to Test**:
- [ ] All form fields display (Name, Email, Phone, Password, Confirm)
- [ ] Password validation (min 6 characters)
- [ ] Confirm password matching
- [ ] Form validation messages
- [ ] Sign up with valid data
- [ ] Auto-login and redirect to homepage
- [ ] User data persists on page reload

**Test Data**:
```
Name: John Doe
Email: john@example.com
Phone: +1 555 123 4567
Password: password123
Confirm: password123
```

#### Logout Test
- [ ] Click user dropdown in navbar
- [ ] Click "Logout"
- [ ] Redirects to homepage
- [ ] Navbar shows Login/Signup buttons again
- [ ] Cannot access Dashboard without login

---

### 5️⃣ Post Ad (Sell Item)

**Navigate to**: http://localhost:5175/post-ad (Must be logged in)

✅ **What to Test**:
- [ ] Redirects to login if not authenticated
- [ ] Image upload section visible
- [ ] Click upload button to select images
- [ ] Multiple images uploadable (up to 10)
- [ ] X button removes uploaded images
- [ ] Preview shows uploaded images
- [ ] All form fields present (Title, Category, Description, Price, Location)
- [ ] Category dropdown has 8 options
- [ ] Form validation works
- [ ] "Publish Ad" button submits form
- [ ] After submit, redirects to Dashboard
- [ ] New ad appears in "My Ads" section

**Test Post**:
```
Title: MacBook Pro 2023
Category: Electronics
Description: Excellent condition, barely used. Includes charger and case.
Price: 1500
Location: New York, NY
Images: Upload 2-3 images
```

---

### 6️⃣ User Dashboard

**Navigate to**: http://localhost:5175/dashboard (Must be logged in)

✅ **What to Test**:

#### My Ads Tab
- [ ] Shows user profile card (name, email, avatar)
- [ ] Lists all ads posted by user
- [ ] Each ad shows image, title, description, price, date
- [ ] "Edit" button (currently shows alert)
- [ ] "Delete" button removes ad (with confirmation)
- [ ] "Post New Ad" button navigates to post page
- [ ] Empty state shows "No ads yet" message

#### Favorites Tab
- [ ] Click "Favorites" tab
- [ ] Shows all favorited items
- [ ] Click on favorite navigates to item detail
- [ ] Empty state if no favorites
- [ ] "Browse Listings" button works

#### Messages Tab
- [ ] Click "Messages" tab
- [ ] Shows placeholder "No messages" state
- [ ] (Feature to be implemented with backend)

#### Profile Tab
- [ ] Click "Profile" tab
- [ ] Form shows user data
- [ ] Can edit name, email, phone
- [ ] "Save Changes" button present
- [ ] (Currently mock, will update with backend)

**Mobile Testing**:
- [ ] Sidebar collapses to tabs at bottom
- [ ] Tab switching works smoothly
- [ ] All content readable on small screen

---

### 7️⃣ Favorites System

✅ **What to Test**:
1. Go to Listings page
2. Click heart icon on any item (turns red)
3. Go to Dashboard → Favorites
4. Item appears in favorites list
5. Go back to Listings
6. Heart icon still red on that item
7. Refresh page (F5)
8. Favorite persists (stored in localStorage)
9. Click heart again to remove (turns gray)
10. Favorite removed from Dashboard

---

### 8️⃣ Responsive Design Testing

#### Desktop (> 1024px)
- [ ] Full navbar with search
- [ ] 4 columns for categories
- [ ] 3 columns for listings
- [ ] Sidebar visible
- [ ] User dropdown menu

#### Tablet (768px - 1024px)
- [ ] 3 columns for categories
- [ ] 2 columns for listings
- [ ] Sidebar narrower
- [ ] Compact spacing

#### Mobile (< 768px)
- [ ] Hamburger menu
- [ ] 2 columns for categories
- [ ] Single column listings
- [ ] Collapsible filters
- [ ] Bottom navigation (Dashboard)
- [ ] Stacked layouts

**Test Breakpoints**:
```
- 375px (iPhone SE)
- 768px (iPad)
- 1024px (Desktop)
- 1440px (Large Desktop)
```

---

### 9️⃣ Navigation Testing

✅ **All Routes to Test**:
- [ ] `/` - Homepage
- [ ] `/listings` - All listings
- [ ] `/item/1` - Item detail (ID: 1)
- [ ] `/item/2` - Item detail (ID: 2)
- [ ] `/login` - Login page
- [ ] `/signup` - Signup page
- [ ] `/post-ad` - Post ad (protected)
- [ ] `/dashboard` - User dashboard (protected)
- [ ] `/favorites` - Favorites (same as dashboard)

**Browser Navigation**:
- [ ] Back button works
- [ ] Forward button works
- [ ] URLs update correctly
- [ ] Page doesn't reload on navigation (SPA)

---

### 🔟 Context API Testing

✅ **AuthContext**:
- [ ] Login updates global state
- [ ] User data persists across pages
- [ ] Logout clears state
- [ ] Protected routes redirect to login
- [ ] LocalStorage syncs with context

✅ **AppContext**:
- [ ] Search query updates globally
- [ ] Category filter works across pages
- [ ] Favorites sync with localStorage
- [ ] New items added to global state
- [ ] Deleted items removed from state
- [ ] Filters reset properly

---

## 🐛 Common Issues & Solutions

### Issue: Images not uploading
**Solution**: Images are converted to base64 and stored in browser memory. For real app, connect to cloud storage.

### Issue: Data disappears on refresh
**Solution**: Only favorites and user data persist (localStorage). Items need backend database.

### Issue: Can't delete item
**Solution**: Confirm deletion dialog should appear. Check browser console for errors.

### Issue: Styles not applying
**Solution**: Tailwind CSS should be loaded. Check `index.css` imports Tailwind.

---

## 📊 Test Checklist Summary

- [ ] Homepage loads successfully
- [ ] All 8 categories clickable
- [ ] Search functionality works
- [ ] Listings page displays items
- [ ] Filters work (category, price, location)
- [ ] Item detail page shows all info
- [ ] Login/Signup flow complete
- [ ] Post ad with image upload
- [ ] Dashboard shows user data
- [ ] Favorites system working
- [ ] Delete ad functionality
- [ ] Mobile responsive (< 768px)
- [ ] Tablet responsive (768-1024px)
- [ ] Desktop responsive (> 1024px)
- [ ] Navigation works smoothly
- [ ] No console errors
- [ ] Context API state management working

---

## 🎯 Success Criteria

✅ **All 17 checkboxes should be checked**

If any feature doesn't work:
1. Check browser console for errors
2. Verify you're logged in (for protected routes)
3. Check network tab for failed requests
4. Ensure dev server is running on port 5175

---

## 🚀 Performance Testing

### Load Time
- [ ] Homepage loads < 2 seconds
- [ ] Navigation instant (SPA)
- [ ] Images load progressively

### Interactions
- [ ] Buttons respond immediately
- [ ] Hover effects smooth
- [ ] Transitions under 300ms
- [ ] No layout shift on load

---

## 📱 Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

---

**Happy Testing! 🎉**

Report any bugs or issues for immediate fixing.

