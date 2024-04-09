import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type StorageState = {
    storageID: string | null; // Update type to allow string
};
const initialState: StorageState = {
    storageID: null,
};

const storageSlice = createSlice({
    name: 'storage',
    initialState,
    reducers: {
        setStorageID: (state , action:PayloadAction<string>)=> {
            state.storageID = action.payload
        },
    },
});

export const { setStorageID } = storageSlice.actions;
export default storageSlice.reducer;