import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API } from "../other/DataAccessLayer";
import { getOwnInfo } from "./signSlice";
import { AppDispatch } from "./store";

interface IGetUsers {
  page: number;
}

export const getUsers = createAsyncThunk<
  object,
  IGetUsers,
  { dispatch: AppDispatch }
>("users/getUsers", async function ({ page }, { dispatch }) {
  dispatch(setPending(true));
  const response = await API.usersAPI.getUsers(page);
  dispatch(
    setUsersData({
      usersData: response.data.items,
      totalUsersCount: response.data.totalUsersCount,
      sortBy: "ID",
    })
  );
  dispatch(setPending(false));
});

interface ISearchUsers {
  searchText: string | null;
}

export const searchUsers = createAsyncThunk<
  object,
  ISearchUsers,
  { dispatch: AppDispatch }
>("users/searchUsers", async function ({ searchText }, { dispatch }) {
  try {
    dispatch(setPending(true));
    const response = await API.usersAPI.searchUsers(searchText);
    dispatch(setFilteredUsers(response.data));
    dispatch(setPending(false));
  } catch (error) {
    dispatch(setPending(false));
  }
});

export const sortByMostChats = createAsyncThunk<
  object,
  IGetUsers,
  { dispatch: AppDispatch }
>("users/sortByMostChats", async function ({ page }, { dispatch }) {
  dispatch(setPending(true));
  const response = await API.usersAPI.getByMostChats(page);
  dispatch(
    setUsersData({
      usersData: response.data.items,
      totalUsersCount: response.data.totalUsersCount,
      sortBy: "Chats",
    })
  );
  dispatch(setPending(false));
});

export const sortByMostSentMessages = createAsyncThunk<
  object,
  IGetUsers,
  { dispatch: AppDispatch }
>("users/sortByMostSentMessages", async function ({ page }, { dispatch }) {
  dispatch(setPending(true));
  const response = await API.usersAPI.getByMostSentMessages(page);
  dispatch(
    setUsersData({
      usersData: response.data.items,
      totalUsersCount: response.data.totalUsersCount,
      sortBy: "Sent messages",
    })
  );
  dispatch(setPending(false));
});

export const sortByMostEnteredCharacters = createAsyncThunk<
  object,
  IGetUsers,
  { dispatch: AppDispatch }
>("users/sortByMostEnteredCharacters", async function ({ page }, { dispatch }) {
  dispatch(setPending(true));
  const response = await API.usersAPI.getByMostEnteredCharacters(page);
  dispatch(
    setUsersData({
      usersData: response.data.items,
      totalUsersCount: response.data.totalUsersCount,
      sortBy: "Entered characters",
    })
  );
  dispatch(setPending(false));
});

interface IAddFriend {
  id: number;
  name?: string;
  surname?: string;
  username: string;
  avatar: string | null;
}

export const addFriend = createAsyncThunk<
  object,
  IAddFriend,
  { dispatch: AppDispatch }
>(
  "users/addFriend",
  async function ({ id, name, surname, username, avatar }, { dispatch }) {
    dispatch(setProfilePending(true));
    const response = await API.usersAPI.addFriend(
      id,
      name,
      surname,
      username,
      avatar
    );
    dispatch(getOwnInfo());
    dispatch(setProfilePending(false));
    dispatch(updateKey());
  }
);

interface IRefuseFriendRequest {
  id: number;
}

export const refuseOwnFriendRequest = createAsyncThunk<
  object,
  IRefuseFriendRequest,
  { dispatch: AppDispatch }
>("users/refuseOwnFriendRequest", async function ({ id }, { dispatch }) {
  dispatch(setProfilePending(true));
  const response = await API.usersAPI.refuseOwnFriendRequest(id);
  dispatch(getOwnInfo());
  dispatch(setProfilePending(false));
});

export const deleteFriend = createAsyncThunk<
  object,
  IRefuseFriendRequest,
  { dispatch: AppDispatch }
>("users/deleteFriend", async function ({ id }, { dispatch }) {
  dispatch(setProfilePending(true));
  const response = await API.usersAPI.deleteFriend(id);
  dispatch(getOwnInfo());
  dispatch(setProfilePending(false));
  dispatch(updateKey());
});

export const confirmFriendRequest = createAsyncThunk<
  object,
  IAddFriend,
  { dispatch: AppDispatch }
>(
  "users/confirmFriendRequest",
  async function ({ id, name, surname, username, avatar }, { dispatch }) {
    dispatch(setProfilePending(true));
    const response = await API.usersAPI.confirmFriend(
      id,
      name,
      surname,
      username,
      avatar
    );
    dispatch(getOwnInfo());
    dispatch(setProfilePending(false));
  }
);

export const rejectFriendRequest = createAsyncThunk<
  object,
  IRefuseFriendRequest,
  { dispatch: AppDispatch }
>("users/rejectFriendRequest", async function ({ id }, { dispatch }) {
  dispatch(setProfilePending(true));
  const response = await API.usersAPI.refuseFriendRequest(id);
  dispatch(getOwnInfo());
  dispatch(setProfilePending(false));
});

interface IUsersState {
  usersData: object[];
  filteredUsers: object[];
  totalUsersCount: number;
  isPending: boolean;
  isProfilePending: boolean;
  sortBy: null | string;
  key: number;
}

const initialState: IUsersState = {
  usersData: [],
  filteredUsers: [],
  totalUsersCount: 0,
  isPending: false,
  isProfilePending: false,
  sortBy: null,
  key: 0,
};

interface iSetUsersData {
  usersData: object[];
  totalUsersCount: number;
  sortBy: string;
}

const usersAPI = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsersData(state, action: PayloadAction<iSetUsersData>) {
      state.usersData = action.payload.usersData;
      state.totalUsersCount = action.payload.totalUsersCount;
      state.sortBy = action.payload.sortBy;
    },

    setPending(state, action: PayloadAction<boolean>) {
      state.isPending = action.payload;
    },

    setProfilePending(state, action: PayloadAction<boolean>) {
      state.isProfilePending = action.payload;
    },

    setFilteredUsers(state, action: PayloadAction<object[]>) {
      state.filteredUsers = action.payload;
    },

    updateKey(state) {
      state.key++;
    },
  },
});

export const {
  setUsersData,
  setPending,
  setFilteredUsers,
  setProfilePending,
  updateKey,
} = usersAPI.actions;

export default usersAPI.reducer;
