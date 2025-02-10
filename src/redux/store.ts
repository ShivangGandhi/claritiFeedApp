import { configureStore } from "@reduxjs/toolkit";
import feedReducer from './slices/feedSlice';
import themeSlice from './slices/themeSlice'

export const store = configureStore({
    reducer: {
        feed: feedReducer,
        theme: themeSlice,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;