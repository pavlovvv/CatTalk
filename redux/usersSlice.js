import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../DataAccessLayer/DAL';

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



const usersAPI = createSlice({
    name: 'users',
    initialState: {
        usersData: [],
        totalUsersCount: 0,
        isPending: false,
        sortBy: null
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
       
    },
});


export const {
    setUsersData, setPending
} = usersAPI.actions;


export default usersAPI.reducer;