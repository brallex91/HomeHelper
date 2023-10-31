import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Profile {
    id: string;
    name: string;
    avatar: string; 
    userId?: string;
  }

export type ProfileCreate = Omit<Profile, "id">


export interface ProfileState {
    profiles: Profile[];
}

const initialState: ProfileState = {
    profiles: [],
};

export const profilesSlice = createSlice({
    name: "profiles",
    initialState,
    reducers: {
        addProfile: (state, action: PayloadAction<Profile>) => {
            state.profiles.push(action.payload);
        },
    },
});

export const { addProfile } = profilesSlice.actions;

export default profilesSlice.reducer;


