import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Profile {
  id: string;
  name: string;
  avatar: string;
}

export interface Household {
  id: string;
  name: string;
  key: string;
  members: string[];
  chores: string[];
  ownerID: string;
  userId: string[];
}

export interface HouseholdState {
  households: Household[];
}

const initialState: HouseholdState = {
  households: [],
};

export const householdSlice = createSlice({
  name: 'household',
  initialState,
  reducers: {
    addHousehold: (state, action: PayloadAction<Household>) => {
      state.households.push(action.payload);
    },
  },
});

export const { addHousehold } = householdSlice.actions;

export default householdSlice.reducer;
