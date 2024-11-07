"use client"
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IdState {
    idArray: string[];
}

const initialState: IdState = {
    idArray: [],
};

const idSlice = createSlice({
    name: 'ids',
    initialState,
    reducers: {
        addId: (state, action: PayloadAction<string>) => {
            state.idArray.push(action.payload);
        },
        removeId: (state, action: PayloadAction<string>) => {
            state.idArray = state.idArray.filter(id => id !== action.payload);
        },
        setIds: (state, action: PayloadAction<string[]>) => {
            state.idArray = action.payload;
        },
    },
});

export const { addId, removeId, setIds } = idSlice.actions;

const store = configureStore({
    reducer: {
        ids: idSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
