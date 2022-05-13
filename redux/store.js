import { configureStore } from '@reduxjs/toolkit';
import signSlice from './signSlice';
import chatSlice from './chatSlice';
import tokenSlice from './tokenSlice';
import usersSlice from './usersSlice';

const store = configureStore({
  reducer: {
    sign: signSlice,
    token: tokenSlice,
    chat: chatSlice,
    users: usersSlice
  },
});


export default store