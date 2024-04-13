import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type EmailState = {
    email: string | null; // Update type to allow string
};
const initialState: EmailState = {
    email: null,
};

const emailSlice = createSlice({
    name: 'email',
    initialState,
    reducers: {
        setEmail: (state , action:PayloadAction<string>)=> {
            state.email = action.payload
        },
    },
});

export const { setEmail } = emailSlice.actions;
export default emailSlice.reducer;