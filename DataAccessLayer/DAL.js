import * as axios from 'axios'

const instance = axios.create({
    withCredentials: true,
    baseURL: 'https://cattalkapi.herokuapp.com/',
    // headers: {
    //     'API-KEY': 'a8dab053-cce8-4320-be78-9be947286577'
    // }
    headers: {
        'Content-Type': 'application/json'
    }
})

export const API = {
    signAPI : {
        signUp: (email, password, name, surname, username) => {
            return instance.post(`auth/signup`, {email, password, name, surname, username})
                .then(response => response)
        },

        auth: (email, password) => {
            return instance.post(`auth/login`, {email, password})
                .then(response => response)
        },

        getOwnInfo: () => {
            return instance.get(`auth/checkMyOwnInfo`)
                .then(response => response)
        },

        logOut: () => {
            return instance.delete(`auth/logout`)
                .then(response => response)
        },

        updateOwnInfo: (name, surname, username, age, location) => {
            return instance.put(`auth/updateMyOwnInfo`, {name, surname, username, age, location})
                .then(response => response)
        }
    },

    tokenAPI: {
        getToken: () => {
            return instance.get(`token/get`)
                .then(response => response)
        },

        findToken: (token) => {
            return instance.post(`token/find`, {token})
                .then(response => response)
        },

        getConnectedUsers: (token) => {
            return instance.post(`token/getConnectedUsers`, {token})
                .then(response => response)
        }
    },

    chatAPI: {
        join: (token) => {
            return instance.post(`chat/join`, {token})
                .then(response => response)
        },

        sendMessage: () => {
            return instance.post(`chat/sendMessage`)
                .then(response => response)
        },

        enterCharacter: () => {
            return instance.post(`chat/enterCharacter`)
                .then(response => response)
        }
        
        // leave: (token) => {
        //     return axios.post(`https://cattalkapi.herokuapp.com/chat/leave`, {token} , {
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         keepalive: true
        //     })
        //         .then(response => response)
        // }
    }
}