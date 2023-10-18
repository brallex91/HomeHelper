import { configureStore } from "@reduxjs/toolkit";
import choresReducer from "../chore/choreSlice";

export const store = configureStore({
  reducer: {
    chores: choresReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
