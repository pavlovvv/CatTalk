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
            return instance.post(`users/sign`, {email, password, name, surname, username})
                .then(response => {
                    return response
                })
        },

        auth: (email, password) => {
            return instance.post(`users/auth`, {email, password})
                .then(response => {
                    return response
                })
        },

        getOwnInfo: () => {
            return instance.get(`users/checkMyOwnInfo`)
                .then(response => {
                    return response
                })
        },

        logOut: () => {
            return instance.delete(`users/logout`)
                .then(response => {
                    return response
                })
        },

        updateOwnInfo: (name, surname, username, age, location) => {
            return instance.put(`users/updateMyOwnInfo`, {name, surname, username, age, location})
                .then(response => {
                    return response
                })
        },
    
        // follow: (id) => {
        //     return instance.post(`follow/${id}`)
        //         .then(response => {
        //             return response.data
        //         })
        // },
    
        // unFollow: (id) => {
        //     return instance.delete(`follow/${id}`)
        //         .then(response => {
        //             return response.data
        //         })
        // }
    }
}