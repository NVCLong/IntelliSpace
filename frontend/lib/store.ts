import { configureStore } from '@reduxjs/toolkit';
import storageSlice from '@/lib/features/todos/storageSlice';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import emailSlice from '@/lib/features/todos/emailSlice';

export const store = configureStore({
  reducer: {
    storageSlice,
    emailSlice,
  },
});

// Infer the type of makeStore
export type LoginStore = ReturnType<typeof store.getState>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
