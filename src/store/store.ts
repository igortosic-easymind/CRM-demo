import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import clientsReducer from "./clientsSlice";
import taskSlice from "./taskSlice";
import calendarSlice from "./calendarSlice";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { AuthState } from "@/types";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated"],
};

export const store = configureStore({
  reducer: {
    auth: persistReducer<AuthState>(authPersistConfig, authReducer),
    clients: clientsReducer,
    tasks: taskSlice,
    calendar: calendarSlice,
    // add other reducers here as needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // These actions are part of Redux Persist's lifecycle
        // Needed to prevent serialization errors during persistence
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
