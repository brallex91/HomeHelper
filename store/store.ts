import { configureStore } from "@reduxjs/toolkit";
import choresReducer from "./choreSlice";
import householdReducer from "./houseHoldSlice";
import choreDetailsReducer from "./choreDetailsSlice";

export const store = configureStore({
  reducer: {
    chores: choresReducer,
    household: householdReducer,
    choreDetails: choreDetailsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
