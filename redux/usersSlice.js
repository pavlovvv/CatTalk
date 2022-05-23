import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../DataAccessLayer/DAL';
import {getOwnInfo} from './signSlice'

export const getUsers = createAsyncThunk(
    'users/getUsers',
    async function ({page}, {rejectWithValue, dispatch}) {
         try {
             dispatch(setPending({isPending: true}))
            const response = await API.usersAPI.getUsers(page)
            dispatch(setUsersData({usersData: response.data.items, totalUsersCount: response.data.totalUsersCount, sortBy: 'ID'}))
            dispatch(setPending({isPending: false}))
        }
         catch (error) {     
        }
    }
);

export const searchUsers = createAsyncThunk(
    'users/searchUsers',
    async function ({searchText}, {rejectWithValue, dispatch}) {
         try {
            dispatch(setPending({isPending: true}))
            const response = await API.usersAPI.searchUsers(searchText)
            dispatch(setFilteredUsers({filteredUsers: response.data}))
            dispatch(setPending({isPending: false}))
        }
         catch (error) {   
            dispatch(setPending({isPending: false}))  
        }
    }
);


export const sortByMostChats = createAsyncThunk(
    'users/sortByMostChats',
    async function ({page}, {rejectWithValue, dispatch}) {
         try {
             dispatch(setPending({isPending: true}))
            const response = await API.usersAPI.getByMostChats(page)
            dispatch(setUsersData({usersData: response.data.items, totalUsersCount: response.data.totalUsersCount, sortBy: 'Chats'}))
            dispatch(setPending({isPending: false}))
        }
         catch (error) {     
        }
    }
);

export const sortByMostSentMessages = createAsyncThunk(
    'users/sortByMostSentMessages',
    async function ({page}, {rejectWithValue, dispatch}) {
         try {
             dispatch(setPending({isPending: true}))
            const response = await API.usersAPI.getByMostSentMessages(page)
            dispatch(setUsersData({usersData: response.data.items, totalUsersCount: response.data.totalUsersCount, sortBy: 'Sent messages'}))
            dispatch(setPending({isPending: false}))
        }
         catch (error) {     
        }
    }
);

export const sortByMostEnteredCharacters = createAsyncThunk(
    'users/sortByMostEnteredCharacters',
    async function ({page}, {rejectWithValue, dispatch}) {
         try {
             dispatch(setPending({isPending: true}))
            const response = await API.usersAPI.getByMostEnteredCharacters(page)
            dispatch(setUsersData({usersData: response.data.items, totalUsersCount: response.data.totalUsersCount, sortBy: 'Entered characters'}))
            dispatch(setPending({isPending: false}))
        }
         catch (error) {     
        }
    }
);

export const addFriend = createAsyncThunk(
    'users/addFriend',
    async function ({id, name, surname, username, avatar}, {rejectWithValue, dispatch}) {
         try {
             dispatch(setProfilePending({isPending: true}))
            const response = await API.usersAPI.addFriend(id, name, surname, username, avatar)
            dispatch(getOwnInfo())
            dispatch(setProfilePending({isPending: false}))
            dispatch(updateKey())
        }
         catch (error) {     
        }
    }
);

export const refuseOwnFriendRequest = createAsyncThunk(
    'users/refuseOwnFriendRequest',
    async function ({id}, {rejectWithValue, dispatch}) {
         try {
             dispatch(setProfilePending({isPending: true}))
            const response = await API.usersAPI.refuseOwnFriendRequest(id)
            dispatch(getOwnInfo())
            dispatch(setProfilePending({isPending: false}))
        }
         catch (error) {     
        }
    }
);

export const deleteFriend = createAsyncThunk(
    'users/deleteFriend',
    async function ({id}, {rejectWithValue, dispatch}) {
         try {
             dispatch(setProfilePending({isPending: true}))
            const response = await API.usersAPI.deleteFriend(id)
            dispatch(getOwnInfo())
            dispatch(setProfilePending({isPending: false}))
            dispatch(updateKey())
        }
         catch (error) {     
        }
    }
);

export const confirmFriendRequest = createAsyncThunk(
    'users/confirmFriendRequest',
    async function ({id, name, surname, username, avatar}, {rejectWithValue, dispatch}) {
         try {
             debugger
             dispatch(setProfilePending({isPending: true}))
            const response = await API.usersAPI.confirmFriend(id, name, surname, username, avatar)
            dispatch(getOwnInfo())
            dispatch(setProfilePending({isPending: false}))
        }
         catch (error) {     
        }
    }
);

export const rejectFriendRequest = createAsyncThunk(
    'users/rejectFriendRequest',
    async function ({id}, {rejectWithValue, dispatch}) {
         try {
             dispatch(setProfilePending({isPending: true}))
            const response = await API.usersAPI.refuseFriendRequest(id)
            dispatch(getOwnInfo())
            dispatch(setProfilePending({isPending: false}))
        }
         catch (error) {     
        }
    }
);



const usersAPI = createSlice({
    name: 'users',
    initialState: {
        usersData: [],
        filteredUsers: [],
        totalUsersCount: 0,
        isPending: false,
        isProfilePending: false,
        sortBy: null,
        key: 0
    },
    reducers: {
        setUsersData(state, action) {
            state.usersData = action.payload.usersData
            state.totalUsersCount = action.payload.totalUsersCount
            state.sortBy = action.payload.sortBy
        }, 
        
        setPending(state, action) {
            state.isPending = action.payload.isPending
        },

        setProfilePending(state, action) {
            state.isProfilePending = action.payload.isPending
        },

        setFilteredUsers(state, action) {
            state.filteredUsers = action.payload.filteredUsers
        },

        updateKey(state, action) {
            state.key++
        },
       
    },
});


export const {
    setUsersData, setPending, setFilteredUsers, setProfilePending, updateKey
} = usersAPI.actions;


export default usersAPI.reducer;