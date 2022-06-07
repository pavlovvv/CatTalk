import { configureStore } from '@reduxjs/toolkit';
import signSlice from './signSlice';
import chatSlice from './chatSlice';
import tokenSlice from './tokenSlice';
import usersSlice from './usersSlice';
import settingsSlice from './settingsSlice';

const store = configureStore({
  reducer: {
    sign: signSlice,
    token: tokenSlice,
    chat: chatSlice,
    users: usersSlice,
    settings: settingsSlice
  },
});


export default store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;