// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './themeSlice';
import appReducer from './appSlice'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    app: appReducer
    // add other slices here
  },
})

// ✅ Typed RootState and Dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
