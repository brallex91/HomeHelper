import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Profile {
    id: string;
    name: string;
    avatar: string;
}

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
        addChore: (state, action: PayloadAction<Profile>) => {
            state.profiles.push(action.payload);
        },
    },
});

export const { addChore } = profilesSlice.actions;

export default profilesSlice.reducer;


