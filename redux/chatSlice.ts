import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API } from "../DataAccessLayer/DAL";

interface IToken {
  token: string | string[];
}

export const join = createAsyncThunk<object, IToken>(
  "chat/join",
  async function ({ token }) {
    const response = await API.chatAPI.join(token);
  }
);

export const sendChatMessage = createAsyncThunk(
  "chat/sendMessage",
  async function (_) {
    const response = await API.chatAPI.sendMessage();
  }
);

export const enterCharacter = createAsyncThunk(
  "chat/enterCharacter",
  async function (_) {
    const response = await API.chatAPI.enterCharacter();
  }
);


interface IChatState {
  onChatPage: boolean
}

const initialState: IChatState = {
  onChatPage: false
};

const chatSlice = createSlice({
  name: "sign",
  initialState,
  reducers: {
    setChatPage(state, action: PayloadAction<boolean>) {
      state.onChatPage = action.payload;
    },
  },
});

export const {
  setChatPage
} = chatSlice.actions;

export default chatSlice.reducer;
