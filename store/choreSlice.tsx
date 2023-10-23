import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Chore {
  description: string;
  energyLevel: string;
  frequency: string;
  // lastCompletedDate: Date;
  dateCreated: Date;
  name: string;
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