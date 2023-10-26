import { configureStore } from "@reduxjs/toolkit";
import choreDetailsReducer from "./choreDetailsSlice";
import choresReducer from "./choreSlice";
import householdReducer from "./houseHoldSlice";
import profilesReducer from "./profileSlice";

export const store = configureStore({
  reducer: {
    chores: choresReducer,
    household: householdReducer,
    choreDetails: choreDetailsReducer,
    profiles: profilesReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
