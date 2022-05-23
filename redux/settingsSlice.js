import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../DataAccessLayer/DAL';
import { getOwnInfo } from './signSlice';


export const updateSecurityData = createAsyncThunk(
    'auth/updateSecurityData',
    async function ({email, password}, {rejectWithValue, dispatch}) {
         try {
             dispatch(setSecurityDataChangingPending({isPending: true}))
            const response = await API.settingsAPI.updateSecurityData(email, password)
            dispatch(getOwnInfo())
            dispatch(setSecurityDataChangingPending({isPending: false}))
            dispatch(setSecurityDataChangingConfirmed({isSecurityDataChangingConfirmed: true}))
            dispatch(setSecurityDataChangingError({error: null}))
        }
         catch (error) {     
            dispatch(setPending({isPending: false}))
            dispatch(setSecurityDataChangingConfirmed({isSecurityDataChangingConfirmed: false}))
            const status = error.response.status
            dispatch(setSecurityDataChangingError({error: status ? error.response.data.msg : "Some error occured"}))
        }
    }
);

export const updatePersonalData = createAsyncThunk(
    'auth/updatePersonalData',
    async function ({instagramLink, telegramUsername, discordUsername}, {rejectWithValue, dispatch}) {
         try {
             dispatch(setPersonalDataChangingPending({isPending: true}))
            const response = await API.settingsAPI.updatePersonalData(instagramLink, telegramUsername, discordUsername)
            dispatch(getOwnInfo())
            dispatch(setPersonalDataChangingPending({isPending: false}))
            dispatch(setPersonalDataChangingConfirmed({isSecurityDataChangingConfirmed: true}))
            dispatch(setPersonalDataChangingError({error: null}))
        }
         catch (error) {     
            dispatch(setPersonalDataChangingPending({isPending: false}))
            dispatch(setPersonalDataChangingConfirmed({isSecurityDataChangingConfirmed: false}))
            const status = error.response.status
            dispatch(setPersonalDataChangingError({error: status ? error.response.data.msg : "Some error occured"}))
        }
    }
);

export const updateAvatar = createAsyncThunk(
    'auth/updateAvatar',
    async function ({file}, {rejectWithValue, dispatch}) {
         try {
             dispatch(setAvatarChangingPending({isPending: true}))
            const response = await API.settingsAPI.updateAvatar(file)
            dispatch(getOwnInfo())
            dispatch(setAvatarChangingPending({isPending: false}))
            dispatch(setAvatarChangingConfirmed({isSecurityDataChangingConfirmed: true}))
            dispatch(setAvatarChangingError({error: null}))
        }
         catch (error) {     
            dispatch(setAvatarChangingPending({isPending: false}))
            dispatch(setAvatarChangingConfirmed({isSecurityDataChangingConfirmed: false}))
            const status = error.response.status
            dispatch(setAvatarChangingError({error: status ? error.response.data.msg : "Some error occured"}))
        }
    }
);

export const deleteAvatar = createAsyncThunk(
    'auth/deleteAvatar',
    async function (_, {rejectWithValue, dispatch}) {
         try {
             dispatch(setAvatarChangingPending({isPending: true}))
            const response = await API.settingsAPI.deleteAvatar()
            dispatch(getOwnInfo())
            dispatch(setAvatarChangingPending({isPending: false}))
            dispatch(setAvatarChangingError({error: null}))
        }
         catch (error) {     
            dispatch(setAvatarChangingPending({isPending: false}))
            const status = error.response.status
            dispatch(setAvatarChangingError({error: status ? error.response.data.msg : "Some error occured"}))
        }
    }
);



const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        isSecurityDataChangingPending: false,
        securityDataChangingError: null,
        isSecurityDataChangingConfirmed: false,
        isPersonalDataChangingPending: false,
        personalDataChangingError: null,
        isPersonalDataChangingConfirmed: false,
        isAvatarChangingPending: false,
        avatarChangingError: null,
        isAvatarChangingConfirmed: false
    },
    reducers: {

        setSecurityDataChangingPending(state, action) {
            state.isSecurityDataChangingPending = action.payload.isPending
        },

        setSecurityDataChangingError(state, action) {
            state.securityDataChangingError = action.payload.error
        },
        
        setSecurityDataChangingConfirmed(state, action) {
            state.isSecurityDataChangingConfirmed = action.payload.isSecurityDataChangingConfirmed
        },

        setPersonalDataChangingPending(state, action) {
            state.isPersonalDataChangingPending = action.payload.isPending
        },

        setPersonalDataChangingError(state, action) {
            state.personalDataChangingError = action.payload.error
        },
        
        setPersonalDataChangingConfirmed(state, action) {
            state.isPersonalDataChangingConfirmed = action.payload.isSecurityDataChangingConfirmed
        },

        setAvatarChangingPending(state, action) {
            state.isAvatarChangingPending = action.payload.isPending
        },

        setAvatarChangingError(state, action) {
            state.avatarChangingError = action.payload.error
        },
        
        setAvatarChangingConfirmed(state, action) {
            state.isAvatarChangingConfirmed = action.payload.isSecurityDataChangingConfirmed
        },

       
    },
});


export const {
    setSecurityDataChangingPending, setSecurityDataChangingConfirmed, setSecurityDataChangingError, setPersonalDataChangingPending,
    setPersonalDataChangingError, setPersonalDataChangingConfirmed, setAvatarChangingPending, setAvatarChangingError,
    setAvatarChangingConfirmed
} = settingsSlice.actions;


export default settingsSlice.reducer;