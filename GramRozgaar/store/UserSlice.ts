// store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    name: string;
    phoneNumber: string;
    token?: string;
}

const initialState: UserState = {
    name: '',
    phoneNumber: '',
    token: undefined,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.name = action.payload.name;
            state.phoneNumber = action.payload.phoneNumber;
            state.token = action.payload.token;
        },
        clearUser: () => initialState,
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
