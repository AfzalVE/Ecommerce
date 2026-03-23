import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "../modules/auth/authSlice";

import { authApi } from "../modules/auth/authApi";

// PRODUCTS
import { productApi } from "../modules/products/productApi"; 
import { clientProductApi } from "../modules/products/client/productApi";
import { adminProductApi } from "../modules/products/admin/productApi";

// ORDERS
import { clientOrderApi } from "../modules/orders/client/orderApi";
import { adminOrderApi } from "../modules/orders/admin/orderApi";

// OTHER
import { categoryApi } from "../modules/categories/categoryApi";
import { reviewApi } from "../modules/reviews/reviewApi";
import { cartApi } from "../modules/cart/cartApi";

// DASHBOARD
import { dashboardApi } from "../modules/dashboard/admin/dashboardApi";

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

/* Persist Config */
const persistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,

    [authApi.reducerPath]: authApi.reducer,

    // PRODUCTS
    [productApi.reducerPath]: productApi.reducer,
    [clientProductApi.reducerPath]: clientProductApi.reducer,
    [adminProductApi.reducerPath]: adminProductApi.reducer,

    // ORDERS
    [clientOrderApi.reducerPath]: clientOrderApi.reducer,
    [adminOrderApi.reducerPath]: adminOrderApi.reducer,

    // OTHER
    [categoryApi.reducerPath]: categoryApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,

    //Dashboard
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,

      // PRODUCTS
      productApi.middleware,
      clientProductApi.middleware,
      adminProductApi.middleware,

      // ORDERS
      clientOrderApi.middleware,
      adminOrderApi.middleware,

      // DASHBOARD
      dashboardApi.middleware,

      // OTHER
      categoryApi.middleware,
      reviewApi.middleware,
      cartApi.middleware
    ),
});

export const persistor = persistStore(store);