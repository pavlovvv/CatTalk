import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../DataAccessLayer/DAL';

export const join = createAsyncThunk(
    'chat/join',
    async function ({token}, {rejectWithValue, dispatch}) {
         try {
            const response = await API.chatAPI.join(token)
        }
         catch (error) {     
        }
    }
);

export const leave = createAsyncThunk(
    'chat/leave',
    async function ({token}, {rejectWithValue, dispatch}) {
         try {
            const response = await API.chatAPI.leave(token)
        }
         catch (error) {     
        }
    }
);

export const sendChatMessage = createAsyncThunk(
    'chat/sendMessage',
    async function (_, {rejectWithValue, dispatch}) {
         try {
            const response = await API.chatAPI.sendMessage()
        }
         catch (error) {     
        }
    }
);

export const enterCharacter = createAsyncThunk(
    'chat/enterCharacter',
    async function (_, {rejectWithValue, dispatch}) {
         try {
            const response = await API.chatAPI.enterCharacter()
        }
         catch (error) {     
        }
    }
);


const chatSlice = createSlice({
    name: 'sign',
    initialState: {
        onChatPage: false
    },
    reducers: {
        
        setChatPage(state, action) {
            state.onChatPage = action.payload.onChatPage
        },

       
    },
});


export const {
setChatPage
} = chatSlice.actions;


export default chatSlice.reducer;