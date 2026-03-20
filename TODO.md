# Checkout & Orders Implementation TODO

## Backend
- [x] 1. Create server/controllers/order.controller.js (createOrder from cart+address+payment, getUserOrders)
- [x] 2. Create server/routes/order.routes.js (POST /orders, GET /orders protected)
- [x] 3. Update server/server.js to mount `/api/orders` router

## Frontend RTK
- [x] 4. Populate client/src/features/orders/orderApi.js (useGetUserOrdersQuery, useCreateOrderMutation)

## Components
- [x] 5. Created inline OrderCard in OrdersPage
- [x] 6. Created inline forms in CheckoutPage
- [x] 7. Edit client/src/components/cart/CartSummery.jsx (add Link to /checkout)

## Pages
- [ ] 8. Enhance client/src/pages/CartPage.jsx (eye-catching UI)
- [x] 9. Create client/src/pages/CheckoutPage.jsx (fully functional)
- [x] 10. Create client/src/pages/OrdersPage.jsx (professional track/expand)

## Routing & Navbar
- [x] 11. Edit client/src/routes/AppRouter.jsx (added protected routes)
- [ ] 12. Optional: Navbar cart count

## Integrations & Polish
- [x] 13. Razorpay integrated in Checkout (use test key)
- [ ] 14. UI polish
- [x] 15. Cart clears on order (backend)

## Testing & Deps
- [ ] Deps
- [ ] Test flow

## Integrations & Polish
- [ ] 13. Integrate Razorpay in CheckoutPage (load script, handle checkout, COD flag)
- [ ] 14. Add UI polish (animations, confetti success, responsive, professional theme)
- [ ] 15. Clear cart on successful order (already in backend)

## Testing & Deps
- [ ] Install server/client deps (razorpay)
- [ ] Test full flow
- [ ] npm run dev
