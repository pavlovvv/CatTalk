import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../DataAccessLayer/DAL';


const chatSlice = createSlice({
    name: 'sign',
    initialState: {
        onChatPage: false
    },
    reducers: {
        
        setChatPage(state, action) {
            state.onChatPage = true
        },

       
    },
});


export const {
setChatPage, setSocketStarted
} = chatSlice.actions;


export default chatSlice.reducer;