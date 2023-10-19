import { createSlice } from "@reduxjs/toolkit";

const choreDetailsSlice = createSlice({
  name: "choreDetails",
  initialState: { chore: {id: "", name: "", description: "" }, },
  reducers: {
    setChoreDetails: (state, action) => {
      state.chore = action.payload;
    },
    updateChoreDetails: (state, action) => {
        const { id, name, description } = action.payload;
        if (state.chore && state.chore.id === id) {
          state.chore = { ...state.chore, name, description };
        }
      },
  },
});

export const { setChoreDetails, } = choreDetailsSlice.actions;
export const { updateChoreDetails} = choreDetailsSlice.actions 
export default choreDetailsSlice.reducer;