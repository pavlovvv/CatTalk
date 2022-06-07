import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API } from '../DataAccessLayer/DAL';
import { AppDispatch } from "./store";


export const getToken = createAsyncThunk<
object,
undefined,
{ dispatch: AppDispatch }
>(
    'token/getToken',
    async function (_, {dispatch}) {
         try {
            dispatch(setGetPending(true))
            const response = await API.tokenAPI.getToken()
            dispatch(setToken(response.data._id))
            dispatch(setGetPending(false))
        }
         catch (error) {
            dispatch(setError('Some error occured. Try to reload'))
            dispatch(setGetPending(false))         
        }
    }
);


interface IToken {
    token: string | string[] | null
}

export const findToken = createAsyncThunk<
object,
IToken,
{ dispatch: AppDispatch }
>(
    'token/findToken',
    async function ({token}, {dispatch}) {
         try {
            dispatch(setFindPending(true))
            const response = await API.tokenAPI.findToken(token)
            dispatch(setFoundToken(response.data.found_token))
            dispatch(setFindPending(false))
        }
         catch (error) {
            dispatch(setError('Incorrect token'))
            dispatch(setFindPending(false))         
        }
    }
);

export const getConnectedUsers = createAsyncThunk<
object,
IToken,
{ dispatch: AppDispatch }
>(
    'token/getConnectedUsers',
    async function ({token}, {dispatch}) {
            const response = await API.tokenAPI.getConnectedUsers(token)
            dispatch(setConnectedUsersCount(response.data.connectedUsers))
    }
);

interface ITokenState {
    token: string | null
    connectedUsersCount: number
    foundToken: string | null
    error: string | null
    isGetPending: boolean
    isFindPending: boolean
}

const initialState: ITokenState = {
    token: null,
    connectedUsersCount: 0,
    foundToken: null,
    error: null,
    isGetPending: false,
    isFindPending: false
  }

const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload
        },    

        setFoundToken(state, action: PayloadAction<string | null>) {
            state.foundToken = action.payload
        },    
        
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload
        },       

        setGetPending(state, action: PayloadAction<boolean>) {
            state.isGetPending = action.payload
        },

        setFindPending(state, action: PayloadAction<boolean>) {
            state.isFindPending = action.payload
        },

        setConnectedUsersCount(state, action: PayloadAction<number>) {
            state.connectedUsersCount = action.payload
        }
       
    },
});


export const {
    setToken, setFoundToken, setGetPending, setError, setFindPending, setConnectedUsersCount
} = tokenSlice.actions;


export default tokenSlice.reducer;