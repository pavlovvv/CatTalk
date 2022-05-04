import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../DataAccessLayer/DAL';


export const signUp = createAsyncThunk(
    'sign/signUp',
    async function ({email, password, firstName, lastName, username}, {rejectWithValue, dispatch}) {
        try {
            
            dispatch(setPending({isPending: true}))
            const response = await API.signAPI.signUp(email, password, firstName, lastName, username)

            dispatch(setPending({isPending: false}))
            dispatch(confirmReg())
        } catch (error) {

            dispatch(setPending({isPending: false}))

            if(!error.response) {
                return dispatch(setError({error: "Some error occured. Try again later"}))
            }

            const status = error.response.status
            dispatch(setError({error: status ? error.response.data.msg : "Some error occured"}))
        }
    }
);

export const auth = createAsyncThunk(
    'sign/auth',
    async function ({email, password}, {rejectWithValue, dispatch}) {
        try {
    
            dispatch(setPending({isPending: true}))
            const response = await API.signAPI.auth(email, password)

            dispatch(setPending({isPending: false}))
            const data = await response.data

            dispatch(setUsername({username: data.username}))
        } catch (error) {

            dispatch(setPending({isPending: false}))

            if(!error.response) {
                return dispatch(setLogInError({error: "Some error occured. Try again later"}))
            }

            const status = error.response.status
            dispatch(setLogInError({error: status ? error.response.data.msg : "Some error occured"}))
            }
    }
);

export const logOut = createAsyncThunk(
    'sign/logOut',
    async function (_, {rejectWithValue, dispatch}) {
        try {

            const response = await API.signAPI.logOut()
            dispatch(setAuth({isAuthed: false}))
        } catch (error) {
        }
    }
);

export const getOwnInfo = createAsyncThunk(
    'sign/getInfo',
    async function (_, {rejectWithValue, dispatch}) {
         try {

            const response = await API.signAPI.getOwnInfo()

            dispatch(setUser({data: response.data}))
        }
         catch (error) {
            dispatch(setAuthFulfilled({isAuthFulfilled: true}))
        }
    }
);

export const updateOwnInfo = createAsyncThunk(
    'sign/updateInfo',
    async function ({name, surname, username, age, location}, {rejectWithValue, dispatch}) {
         try {

            dispatch(setPending({isPending: true}))
            const response = await API.signAPI.updateOwnInfo(name, surname, username, age, location)

            dispatch(getOwnInfo())
            dispatch(setProfileUpdatingConfirmed({isProfileUpdatingConfirmed: true}))
            dispatch(setPending({isPending: false}))
        }
         catch (error) {

            dispatch(setPending({isPending: false}))
            const status = error.response.status
            dispatch(setProfileError({profileError: status ? error.response.data.msg : "Some error occured"}))            
        }
    }
);


const signSlice = createSlice({
    name: 'sign',
    initialState: {
        userData: {
            info: [],
            stats: [],
            friends: [],
        },
        isRegConfirmed: false,
        error: null,
        logInError: null,
        profileError: null,
        isLogInConfirmed: false,
        isProfileUpdatingConfirmed: false,
        key: 1,
        uniKey: 1,
        isAuthed: false,
        isAuthFulfilled: false,
        isPending: false,
    },
    reducers: {

        setUsername(state, action) {
            state.username = action.payload.username
            state.isLogInConfirmed = true
            state.isAuthed = true
        },

        confirmReg(state, action) {
            state.isRegConfirmed = true
            state.error = null
            state.key++
            
        },

        setError(state, action) {
            state.error = action.payload.error
            state.isRegConfirmed = false
            state.key++
        },

        setLogInError(state, action) {
            state.logInError = action.payload.error
            state.key++
        },

        setAuth(state, action) {
            state.isAuthed = action.payload.isAuthed
            state.uniKey++
        },

        setUser(state, action) {
            state.userData.info = Object.entries(action.payload.data.info).map(entry => ({[entry[0]]: entry[1]}));
            state.userData.stats = Object.entries(action.payload.data.stats).map(entry => ({[entry[0]]: entry[1]}));
            state.userData.friends = action.payload.data.friends
            state.isAuthed = true
            state.isAuthFulfilled = true
        },

        setAuthFulfilled(state, action) {
            state.isAuthFulfilled = action.payload.isAuthFulfilled
        },

        setPending(state, action) {
            state.isPending = action.payload.isPending
        },

        setProfileUpdatingConfirmed(state, action) {
            state.isProfileUpdatingConfirmed = action.payload.isProfileUpdatingConfirmed
        },

        setProfileError(state, action) {
            state.profileError = action.payload.profileError
        }
        // toggleComplete(state, action) {
        //     const toggledTodo = state.todos.find(todo => todo.id === action.payload.id);
        //     toggledTodo.completed = !toggledTodo.completed;
        // },
        // removeTodo(state, action) {
        //     state.todos = state.todos.filter(todo => todo.id !== action.payload.id);
        // }

       
    },
});


export const {
    setUsername, confirmReg, setError, setLogInError, setUser, setPending, setAuthFulfilled, setAuth, 
    setProfileUpdatingConfirmed, setProfileError
} = signSlice.actions;


export default signSlice.reducer;