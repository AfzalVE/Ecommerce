import { configureStore } from "@reduxjs/toolkit";

import { authApi } from "../modules/auth/authApi";

// ✅ PRODUCTS (ALL 3)
import { productApi } from "../modules/products/productApi"; 
import { clientProductApi } from "../modules/products/client/productApi";
import { adminProductApi } from "../modules/products/admin/productApi";

// ✅ ORDERS
import { clientOrderApi } from "../modules/orders/client/orderApi";
import { adminOrderApi } from "../modules/orders/admin/orderApi";

// other APIs
import { categoryApi } from "../modules/categories/categoryApi";
import { reviewApi } from "../modules/reviews/reviewApi";
import { cartApi } from "../modules/cart/cartApi";

import authReducer from "../modules/auth/authSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist";

/* Persist Config */
const persistConfig = {
  key: "auth",
  storage
};

const persistedAuthReducer = persistReducer(
  persistConfig,
  authReducer
);

export const store = configureStore({

  reducer: {
    auth: persistedAuthReducer,

    [authApi.reducerPath]: authApi.reducer,

    // ✅ PRODUCTS (ALL 3)
    [productApi.reducerPath]: productApi.reducer,
    [clientProductApi.reducerPath]: clientProductApi.reducer,
    [adminProductApi.reducerPath]: adminProductApi.reducer,

    // ✅ ORDERS
    [clientOrderApi.reducerPath]: clientOrderApi.reducer,
    [adminOrderApi.reducerPath]: adminOrderApi.reducer,

    // others
    [categoryApi.reducerPath]: categoryApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER
        ]
      }
    }).concat(
      authApi.middleware,

      // ✅ PRODUCTS
      productApi.middleware,
      clientProductApi.middleware,
      adminProductApi.middleware,

      // ✅ ORDERS
      clientOrderApi.middleware,
      adminOrderApi.middleware,

      // others
      categoryApi.middleware,
      reviewApi.middleware,
      cartApi.middleware
    )

});

export const persistor = persistStore(store);