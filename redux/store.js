import { configureStore } from '@reduxjs/toolkit';
import signSlice from './signSlice';
import chatSlice from './chatSlice';

const store = configureStore({
  reducer: {
    sign: signSlice,
    chat: chatSlice
  },
});


export default store