import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API } from "../DataAccessLayer/DAL";
import { getOwnInfo } from "./signSlice";
import { AppDispatch } from "./store";

interface IUpdateSecurityData {
  email: string;
  password: string | null;
}

export const updateSecurityData = createAsyncThunk<
  object,
  IUpdateSecurityData,
  { dispatch: AppDispatch }
>(
  "auth/updateSecurityData",
  async function ({ email, password }, { dispatch }) {
    try {
      dispatch(setSecurityDataChangingPending(true));
      const response = await API.settingsAPI.updateSecurityData(
        email,
        password
      );
      dispatch(getOwnInfo());
      dispatch(setSecurityDataChangingPending(false));
      dispatch(setSecurityDataChangingConfirmed(true));
      dispatch(setSecurityDataChangingError(null));
    } catch (error) {
      dispatch(setSecurityDataChangingPending(false));
      dispatch(setSecurityDataChangingConfirmed(false));
      const status = error.response.status;
      dispatch(
        setSecurityDataChangingError(
          status ? error.response.data.msg : "Some error occured"
        )
      );
    }
  }
);

interface IUpdatePersonalData {
  instagramLink: string | null;
  telegramUsername: string | null;
  discordUsername: string | null;
}

export const updatePersonalData = createAsyncThunk<
  object,
  IUpdatePersonalData,
  { dispatch: AppDispatch }
>(
  "auth/updatePersonalData",
  async function (
    { instagramLink, telegramUsername, discordUsername },
    { dispatch }
  ) {
    try {
      dispatch(setPersonalDataChangingPending(true));
      const response = await API.settingsAPI.updatePersonalData(
        instagramLink,
        telegramUsername,
        discordUsername
      );
      dispatch(getOwnInfo());
      dispatch(setPersonalDataChangingPending(false));
      dispatch(setPersonalDataChangingConfirmed(true));
      dispatch(setPersonalDataChangingError(null));
    } catch (error) {
      dispatch(setPersonalDataChangingPending(false));
      dispatch(setPersonalDataChangingConfirmed(false));
      const status = error.response.status;
      dispatch(
        setPersonalDataChangingError(
          status ? error.response.data.msg : "Some error occured"
        )
      );
    }
  }
);

interface IUpdateAvatar {
  file: File;
}

export const updateAvatar = createAsyncThunk<
  object,
  IUpdateAvatar,
  { dispatch: AppDispatch }
>("auth/updateAvatar", async function ({ file }, { dispatch }) {
  try {
    dispatch(setAvatarChangingPending(true));
    const response = await API.settingsAPI.updateAvatar(file);
    dispatch(getOwnInfo());
    dispatch(setAvatarChangingPending(false));
    dispatch(setAvatarChangingConfirmed(true));
    dispatch(setAvatarChangingError(null));
  } catch (error) {
    dispatch(setAvatarChangingPending(false));
    dispatch(setAvatarChangingConfirmed(false));
    const status = error.response.status;
    dispatch(
      setAvatarChangingError(
        status ? error.response.data.msg : "Some error occured"
      )
    );
  }
});

export const deleteAvatar = createAsyncThunk<
  object,
  undefined,
  { dispatch: AppDispatch }
>("auth/deleteAvatar", async function (_, { dispatch }) {
  try {
    dispatch(setAvatarChangingPending(true));
    const response = await API.settingsAPI.deleteAvatar();
    dispatch(getOwnInfo());
    dispatch(setAvatarChangingPending(false));
    dispatch(setAvatarChangingError(null));
  } catch (error) {
    dispatch(setAvatarChangingPending(false));
    const status = error.response.status;
    dispatch(
      setAvatarChangingError(
        status ? error.response.data.msg : "Some error occured"
      )
    );
  }
});

interface ISettingsState {
  isSecurityDataChangingPending: boolean;
  securityDataChangingError: string | null;
  isSecurityDataChangingConfirmed: boolean;
  isPersonalDataChangingPending: boolean;
  personalDataChangingError: string | null;
  isPersonalDataChangingConfirmed: boolean;
  isAvatarChangingPending: boolean;
  avatarChangingError: string | null;
  isAvatarChangingConfirmed: boolean;
}

const initialState: ISettingsState = {
  isSecurityDataChangingPending: false,
  securityDataChangingError: null,
  isSecurityDataChangingConfirmed: false,
  isPersonalDataChangingPending: false,
  personalDataChangingError: null,
  isPersonalDataChangingConfirmed: false,
  isAvatarChangingPending: false,
  avatarChangingError: null,
  isAvatarChangingConfirmed: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSecurityDataChangingPending(state, action: PayloadAction<boolean>) {
      state.isSecurityDataChangingPending = action.payload;
    },

    setSecurityDataChangingError(state, action: PayloadAction<string | null>) {
      state.securityDataChangingError = action.payload;
    },

    setSecurityDataChangingConfirmed(state, action: PayloadAction<boolean>) {
      state.isSecurityDataChangingConfirmed = action.payload;
    },

    setPersonalDataChangingPending(state, action: PayloadAction<boolean>) {
      state.isPersonalDataChangingPending = action.payload;
    },

    setPersonalDataChangingError(state, action: PayloadAction<string | null>) {
      state.personalDataChangingError = action.payload;
    },

    setPersonalDataChangingConfirmed(state, action: PayloadAction<boolean>) {
      state.isPersonalDataChangingConfirmed = action.payload;
    },

    setAvatarChangingPending(state, action: PayloadAction<boolean>) {
      state.isAvatarChangingPending = action.payload;
    },

    setAvatarChangingError(state, action: PayloadAction<string | null>) {
      state.avatarChangingError = action.payload;
    },

    setAvatarChangingConfirmed(state, action: PayloadAction<boolean>) {
      state.isAvatarChangingConfirmed = action.payload;
    },
  },
});

export const {
  setSecurityDataChangingPending,
  setSecurityDataChangingConfirmed,
  setSecurityDataChangingError,
  setPersonalDataChangingPending,
  setPersonalDataChangingError,
  setPersonalDataChangingConfirmed,
  setAvatarChangingPending,
  setAvatarChangingError,
  setAvatarChangingConfirmed,
} = settingsSlice.actions;

export default settingsSlice.reducer;
