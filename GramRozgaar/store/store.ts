// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './UserSlice';
import preferencesReducer from './PreferencesSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        preferences: preferencesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
