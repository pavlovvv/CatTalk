import { configureStore } from '@reduxjs/toolkit';
import signSlice from './signSlice';
import chatSlice from './chatSlice';
import tokenSlice from './tokenSlice';

const store = configureStore({
  reducer: {
    sign: signSlice,
    token: tokenSlice,
    chat: chatSlice
  },
});


export default store