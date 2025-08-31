import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authSlice from "./authSlice";


const persistConfig = {
  key: "root",
  version: 1,
  storage,
};


const rootReducer = combineReducers({
author:authSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 👇 Middleware is configured in `configureStore`, not `combineReducers`
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // This disables warnings related to non-serializable data (dev only)
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        warnAfter: 100, // optional: increases the warning threshold
      },
    }),
});

export const persistor = persistStore(store);
export default store;