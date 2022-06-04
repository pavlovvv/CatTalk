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
    signAPI: {
        signUp: (email, password, name, surname, username) => {
            return instance.post(`auth/signup`, { email, password, name, surname, username })
                .then(response => response)
        },

        auth: (email, password) => {
            return instance.post(`auth/login`, { email, password })
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
            return instance.put(`auth/updateMyOwnInfo`, { name, surname, username, age, location })
                .then(response => response)
        }
    },

    tokenAPI: {
        getToken: () => {
            return instance.get(`token/get`)
                .then(response => response)
        },

        findToken: (token) => {
            return instance.post(`token/find`, { token })
                .then(response => response)
        },

        getConnectedUsers: (token) => {
            return instance.post(`token/getConnectedUsers`, { token })
                .then(response => response)
        }
    },

    chatAPI: {
        join: (token) => {
            return instance.post(`chat/join`, { token })
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
    },

    usersAPI: {
        getUsers: (page = 0) => {
            return instance.get(`users/get?page=${page}`)
                .then(response => response)
        },

        searchUsers: (searchText) => {
            return instance.post(`users/search`, {searchText})
                .then(response => response)
        },

        getByMostChats: (page = 0) => {
            return instance.get(`users/mostChats?page=${page}`)
                .then(response => response)
        },

        getByMostSentMessages: (page = 0) => {
            return instance.get(`users/mostSentMessages?page=${page}`)
                .then(response => response)
        },

        getByMostEnteredCharacters: (page = 0) => {
            return instance.get(`users/mostCharactersEntered?page=${page}`)
                .then(response => response)
        },

        addFriend: (id, name, surname, username, avatar) => {
            return instance.post(`users/addFriend`, {id, name, surname, username, avatar})
                .then(response => response)
        },

        refuseOwnFriendRequest: (id) => {
            return instance.post(`users/refuseOwnFriendRequest`, {id})
                .then(response => response)
        },

        refuseFriendRequest: (id) => {
            return instance.post(`users/refuseFriendRequest`, {id})
                .then(response => response)
        },

        confirmFriend: (id, name, surname, username, avatar) => {
            debugger
            return instance.post(`users/confirmFriend`, {id, name, surname, username, avatar})
                .then(response => response)
        },

        deleteFriend: (id) => {
            return instance.delete(`users/deleteFriend/${id}`)
                .then(response => response)
        },

    },

    settingsAPI: {

        updateSecurityData: (email, password) => {
            return instance.put(`auth/updateSecurityData`, { email, password })
                .then(response => response)
        },

        updatePersonalData: (instagramLink, telegramUsername, discordUsername) => {
            return instance.put(`auth/updatePersonalData`, { instagramLink, telegramUsername, discordUsername })
                .then(response => response)
        },

        updateAvatar: (file) => {
            const formData = new FormData()
            formData.append('avatar', file)
            return axios.put(`https://cattalkapi.herokuapp.com/auth/updateAvatar`, formData, {
                withCredentials: true,
            })
                .then(response => response)
        },

        deleteAvatar: () => {
            return instance.delete(`auth/deleteAvatar`)
                .then(response => response)
        },

    }
}