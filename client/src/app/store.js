import { configureStore } from "@reduxjs/toolkit";

import { authApi } from "../features/auth/authApi";
import { productApi } from "../features/products/productApi";
import { categoryApi } from "../features/categories/categoryApi";
import { reviewApi } from "../features/reviews/reviewApi";
import { cartApi } from "../features/cart/cartApi";
import { orderApi } from "../features/orders/orderApi";


import authReducer from "../features/auth/authSlice";

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
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
[cartApi.reducerPath]: cartApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer
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
      productApi.middleware,
      categoryApi.middleware,
      reviewApi.middleware,
      cartApi.middleware,
      orderApi.middleware
    )


});

export const persistor = persistStore(store);