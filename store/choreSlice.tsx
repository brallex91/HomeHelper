

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Chore {
  id: string;
  name: string;
  description: string;
  frequency: number; // Antal dagar
  energyLevel: number; // 1, 2, 4, 6 eller 8
  lastCompleted: Date | undefined  // Datum när sysslan senast slutfördes
  dateCreated: Date; // Datum när sysslan skapades
}

export interface ChoresState {
  chores: Chore[];
}

const initialState: ChoresState = {
  chores: [],
};

export const choresSlice = createSlice({
  name: "chores",
  initialState,
  reducers: {
    addChore: (state, action: PayloadAction<Chore>) => {
      state.chores.push(action.payload);
    },
  },
});

export const { addChore } = choresSlice.actions;

export default choresSlice.reducer;