import { configureStore } from "@reduxjs/toolkit";
import choresReducer from "../chore/choreSlice";
import householdReducer from "../householdSlice/houseHoldSlice";

export const store = configureStore({
  reducer: {
    chores: choresReducer,
    household: householdReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
