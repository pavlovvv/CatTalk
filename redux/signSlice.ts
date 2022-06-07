import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API } from "../DataAccessLayer/DAL";
import { AppDispatch } from "./store";

export interface ISignUp {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
}

export const signUp = createAsyncThunk<
  object,
  ISignUp,
  { dispatch: AppDispatch }
>(
  "sign/signUp",
  async function (
    { email, password, firstName, lastName, username },
    { dispatch }
  ) {
    try {
      dispatch(setPending(true));
      const response = await API.signAPI.signUp(
        email,
        password,
        firstName,
        lastName,
        username
      );

      dispatch(setPending(false));
      dispatch(confirmReg());
    } catch (error) {
      dispatch(setPending(false));

      if (!error.response) {
        return dispatch(setError("Some error occured. Try again later"));
      }

      const status = error.response.status;
      dispatch(
        setError(status ? error.response.data.msg : "Some error occured")
      );
    }
  }
);

export interface IAuth {
  email: string;
  password: string;
}

export const auth = createAsyncThunk<object, IAuth, { dispatch: AppDispatch }>(
  "sign/auth",
  async function ({ email, password }, { dispatch }) {
    try {
      dispatch(setPending(true));
      const response = await API.signAPI.auth(email, password);

      dispatch(setPending(false));
      const data = await response.data;

      dispatch(setUsername(data.username));
    } catch (error) {
      dispatch(setPending(false));

      if (!error.response) {
        return dispatch(setLogInError("Some error occured. Try again later"));
      }

      const status = error.response.status;
      dispatch(
        setLogInError(status ? error.response.data.msg : "Some error occured")
      );
    }
  }
);

export const logOut = createAsyncThunk<
  object,
  undefined,
  { dispatch: AppDispatch }
>("sign/logOut", async function (_, { dispatch }) {
  const response = await API.signAPI.logOut();
  dispatch(setAuth(false));
});

export const getOwnInfo = createAsyncThunk<
  object,
  undefined,
  { dispatch: AppDispatch }
>("sign/getInfo", async function (_, { dispatch }) {
  try {
    dispatch(setProfileDone(true));

    const response = await API.signAPI.getOwnInfo();

    dispatch(setUser(response.data));

    dispatch(setProfileDone(false));
  } catch (error) {
    dispatch(setAuthFulfilled(true));
    dispatch(setProfileDone(false));
  }
});

export interface IUpdateOwnInfo {
  name: string;
  surname: string;
  username: string;
  age: number | null;
  location: any;
}

export const updateOwnInfo = createAsyncThunk<
  object,
  IUpdateOwnInfo,
  { dispatch: AppDispatch }
>(
  "sign/updateInfo",
  async function ({ name, surname, username, age, location }, { dispatch }) {
    try {
      dispatch(setPending(true));
      const response = await API.signAPI.updateOwnInfo(
        name,
        surname,
        username,
        age,
        location
      );

      dispatch(getOwnInfo());
      dispatch(setProfileUpdatingConfirmed(true));
      dispatch(setPending(false));
    } catch (error) {
      dispatch(setPending(false));
      const status = error.response.status;
      dispatch(
        setProfileError(status ? error.response.data.msg : "Some error occured")
      );
    }
  }
);

interface ISetUser {
    info: object[];
    stats: object[];
    friends: {
      confirmedFriends: object[];
      pendingFriends: object[];
      waitingFriends: object[];
      totalFriendsCount: number;
    };
    limits: object;
}

type stringOrNull = string | null;

interface ISignState {
  userData: {
    info: Array<any>;
    stats: object[];
    friends: {
      confirmedFriends: object[];
      pendingFriends: object[];
      waitingFriends: object[];
      totalFriendsCount: number;
    };
    limits: {
      freeSpaceTaken?: string | null // bug
      filesSent?: number
    };
  };
  allUsers: object[];
  isRegConfirmed: boolean;
  username: stringOrNull;
  error: stringOrNull;
  logInError: stringOrNull;
  profileError: stringOrNull;
  isLogInConfirmed: boolean;
  isProfileUpdatingConfirmed: boolean;
  key: number;
  uniKey: number;
  isAuthed: boolean;
  isAuthFulfilled: boolean;
  isDynamicPage: boolean;
  isPending: boolean;
  isProfileDone: boolean;
}

const initialState: ISignState = {
  userData: {
    info: [],
    stats: [],
    friends: {
      confirmedFriends: [],
      pendingFriends: [],
      waitingFriends: [],
      totalFriendsCount: 0,
    },
    limits: {
      freeSpaceTaken: null,
      filesSent: 0
    },
  },
  allUsers: [],
  isRegConfirmed: false,
  username: null,
  error: null,
  logInError: null,
  profileError: null,
  isLogInConfirmed: false,
  isProfileUpdatingConfirmed: false,
  key: 1,
  uniKey: 1,
  isAuthed: false,
  isAuthFulfilled: false,
  isDynamicPage: false,
  isPending: false,
  isProfileDone: false,
};

const signSlice = createSlice({
  name: "sign",
  initialState,
  reducers: {
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
      state.isLogInConfirmed = true;
      state.isAuthed = true;
    },

    confirmReg(state) {
      state.isRegConfirmed = true;
      state.error = null;
      state.key++;
    },

    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isRegConfirmed = false;
      state.key++;
    },

    setLogInError(state, action: PayloadAction<string>) {
      state.logInError = action.payload;
      state.key++;
    },

    setAuth(state, action: PayloadAction<boolean>) {
      state.isAuthed = action.payload;
      state.uniKey++;
    },

    setDynamicPage(state, action: PayloadAction<boolean>) {
      state.isDynamicPage = action.payload;
    },

    setUser(state, action: PayloadAction<ISetUser>) {
      state.userData.info = Object.entries(action.payload.info).map(
        (entry) => ({ [entry[0]]: entry[1] })
      );
      state.userData.stats = Object.entries(action.payload.stats).map(
        (entry) => ({ [entry[0]]: entry[1] })
      );
      state.userData.friends = action.payload.friends;
      state.userData.limits = action.payload.limits;
      state.isAuthed = true;
      state.isAuthFulfilled = true;
    },

    setUsers(state, action: PayloadAction<any>) {
      state.allUsers = [];
      action.payload.allUsers.forEach((user: any) => {
        const data = {
          id: user.info.id,
          avatar: user.info.avatar,
          name: user.info.name,
          surname: user.info.surname,
          username: user.info.username,
          stats: user.stats,
          data:
            user.info.name.toLowerCase() +
            " " +
            user.info.surname.toLowerCase() +
            " " +
            user.info.username.toLowerCase(),
        };
        state.allUsers.push(data);
      });
    },

    setAuthFulfilled(state, action: PayloadAction<boolean>) {
      state.isAuthFulfilled = action.payload;
    },

    setPending(state, action: PayloadAction<boolean>) {
      state.isPending = action.payload;
    },

    setProfileDone(state, action: PayloadAction<boolean>) {
      state.isProfileDone = action.payload;
    },

    setProfileUpdatingConfirmed(state, action: PayloadAction<boolean>) {
      state.isProfileUpdatingConfirmed = action.payload;
    },

    setProfileError(state, action: PayloadAction<string | null>) {
      state.profileError = action.payload;
    },
  },
});

export const {
  setUsername,
  confirmReg,
  setError,
  setLogInError,
  setUser,
  setDynamicPage,
  setPending,
  setAuthFulfilled,
  setAuth,
  setProfileUpdatingConfirmed,
  setProfileError,
  setUsers,
  setProfileDone,
} = signSlice.actions;

export default signSlice.reducer;
