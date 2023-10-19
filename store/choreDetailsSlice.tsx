import { createSlice } from "@reduxjs/toolkit";

const choreDetailsSlice = createSlice({
  name: "choreDetails",
  initialState: { chore: { id: "", name: "", description: "", dateCreated: "", frequency: "", energyLevel: "" }, },
  reducers: {
    setChoreDetails: (state, action) => {
      state.chore = action.payload;
    },
    updateChoreDetails: (state, action) => {
      const { id, name, description, dateCreated, frequency, energyLevel } = action.payload;
      if (state.chore && state.chore.id === id) {
        state.chore = { ...state.chore, name, description, dateCreated, frequency, energyLevel };
      }
    },
  },
});

export const { setChoreDetails } = choreDetailsSlice.actions;
export const { updateChoreDetails } = choreDetailsSlice.actions;
export default choreDetailsSlice.reducer;