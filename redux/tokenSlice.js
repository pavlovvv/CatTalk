import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../DataAccessLayer/DAL';


export const getToken = createAsyncThunk(
    'token/getToken',
    async function (_, {rejectWithValue, dispatch}) {
         try {
            dispatch(setGetPending({isPending: true}))
            const response = await API.tokenAPI.getToken()
            dispatch(setToken({token: response.data._id}))
            dispatch(setGetPending({isPending: false}))
        }
         catch (error) {
            dispatch(setError({error: 'Some error occured. Try to reload'}))
            dispatch(setGetPending({isPending: false}))         
        }
    }
);

export const findToken = createAsyncThunk(
    'token/findToken',
    async function ({token}, {rejectWithValue, dispatch}) {
         try {
            dispatch(setFindPending({isPending: true}))
            const response = await API.tokenAPI.findToken(token)
            dispatch(setFoundToken({token : response.data.found_token}))
            dispatch(setFindPending({isPending: false}))
        }
         catch (error) {
            dispatch(setError({error: 'Incorrect token'}))
            dispatch(setFindPending({isPending: false}))         
        }
    }
);

export const getConnectedUsers = createAsyncThunk(
    'token/getConnectedUsers',
    async function ({token}, {rejectWithValue, dispatch}) {
         try {
            const response = await API.tokenAPI.getConnectedUsers(token)
            debugger
            dispatch(setConnectedUsersCount({connectedUsersCount: response.data.connectedUsers}))
        }
         catch (error) {      
        }
    }
);

const tokenSlice = createSlice({
    name: 'token',
    initialState: {
        token: null,
        connectedUsersCount: 0,
        foundToken: null,
        error: null,
        isGetPending: false,
        isFindPending: false
    },
    reducers: {
        setToken(state, action) {
            state.token = action.payload.token
        },    

        setFoundToken(state, action) {
            state.foundToken = action.payload.token
        },    
        
        setError(state, action) {
            state.error = action.payload.error
        },       

        setGetPending(state, action) {
            state.isGetPending = action.payload.isPending
        },

        setFindPending(state, action) {
            state.isFindPending = action.payload.isPending
        },

        setConnectedUsersCount(state, action) {
            state.connectedUsersCount = action.payload.connectedUsersCount
        }
       
    },
});


export const {
    setToken, setFoundToken, setGetPending, setError, setFindPending, setConnectedUsersCount
} = tokenSlice.actions;


export default tokenSlice.reducer;