# Cart Page Implementation TODO

## Approved Plan Steps:

### 1. **✅ Create cartApi.js** 
   - `client/src/features/cart/cartApi.js` with RTK Query endpoints

### 2. **✅ Create CartPage.jsx**
   - `client/src/pages/CartPage.jsx` - UI with items table, qty +/-, remove, totals, empty state

### 3. **⏳ Update store.js**
   - Add `[cartApi.reducerPath]: cartApi.reducer` & `cartApi.middleware`

### 4. **Update AppRouter.jsx** 
   - Add `<Route path="/cart" element={<CartPage />} />` in ProtectedRoute

### 5. **Update Navbar.jsx**
   - Add Cart NavLink with badge from useGetCartQuery

### 6. **Test**
   - `cd client && npm run dev`
   - Login, visit /cart (empty until backend API)

# Cart Page ✅ COMPLETE

## Implemented:
- ✅ cartApi.js - RTK Query for cart operations
- ✅ CartPage.jsx - Full UI (empty state, items list, qty update/remove/clear, totals)
- ✅ store.js - Integrated cartApi reducer/middleware
- ✅ AppRouter.jsx - `/cart` route (protected)
- ✅ Navbar.jsx - Cart icon with badge placeholder

## Status:
- Frontend ready! Login -> Navbar cart icon -> /cart shows empty loader (no backend API yet)
- API calls setup for future backend integration (`POST /api/cart`, etc.)

## Test:
```
cd client && npm run dev
```
Visit http://localhost:5173/login -> login -> click cart icon -> /cart

**Next**: Implement backend cart routes/controller OR add "Add to Cart" buttons in ProductList/ProductPage.jsx
