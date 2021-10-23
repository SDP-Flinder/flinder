/* eslint-disable no-undef */
import axios from 'axios';
import { Config } from '../config';

const unauthaxios = axios.create({
    baseURL : Config.Local_API_URL,
    timeout: 1000,
    headers: { 
        'Content-Type': 'application/json'
    }
});

const authaxios = (jwt) => { 
    return axios.create({
        baseURL : Config.Local_API_URL,
        timeout: 1000,
        headers: { 
            'Authorization': `Bearer ${jwt}`, 
            'Content-Type': 'application/json'
        }
    });
}

const authparamaxios = (jwt, param) => { 
    return axios.create({
        baseURL : Config.Local_API_URL,
        timeout: 1000,
        params: param,
        headers: { 
            'Authorization': `Bearer ${jwt}`, 
            'Content-Type': 'application/json'
        }
    });
}

// User Requests
const authenticate = async ( payload)  => await unauthaxios.post(`/users/authenticate`, payload);
const register = async ()  => await unauthaxios.post(`/users/register`);
const logout = async (jwt) => await authaxios(jwt).post(`logout`);
const getAllUsers = async (jwt)  => await authaxios(jwt).get(`/users/`);
const getUserById = async (id, jwt)  => await authaxios(jwt).get(`/users/${id}`);
const getJWTUser = async (jwt)  => await authaxios(jwt).get(`/users/current` );
const updateUserById = async (id, jwt, payload)  => await authaxios(jwt).put(`/users/${id}`, payload);
const deleteUserById = async (id, jwt)  => await authaxios(jwt).delete(`/users/${id}`);

// Flat Requests
const getOwnedFlats = async (jwt)  => await authaxios(jwt).get(`/flats/`);
const getFlatById = async (id, jwt)  => await authaxios(jwt).get(`/flats/${id}`);
const getAllFlats = async (jwt)  => await authaxios(jwt).get(`/flats/all`);
const updateFlatById = async (id, jwt, payload)  => await authaxios(jwt).put(`/flats/${id}`, payload);
const deleteFlatById = async (id, jwt)  => await authaxios(jwt).delete(`/flats/${id}`);

// Location Requests
const addLocation = async (jwt, payload)  => await authaxios(jwt).post(`/locations/`, payload)
const getAllLocations = async (jwt)  => await authaxios(jwt).get(`/locations/`);
const getLocationById = async (id, jwt)  => await authaxios(jwt).get(`/locations/${id}`);
const updateLocationById = async (id, jwt, payload)  => await authaxios(jwt).put(`/locations/${id}`, payload);
const deleteLocationById = async (id, jwt)  => await authaxios(jwt).delete(`/locations/${id}`);

// Match Requests
const getAllMatches = async (jwt)  => await authaxios(jwt).get(`/matches/`);
const getMatchById = async (id, jwt)  => await authaxios(jwt).get(`/matches/${id}`);
const findFlatee = async (id, jwt)  => await authaxios(jwt).get(`/match/findFlatee/${id}`)
const getFlateeMatches = async (id, jwt)  => await authaxios(jwt).get(`/matches/successMatchesForFlatee/${id}`);
const getListingMatches = async (id, jwt)  => await authaxios(jwt).get(`/matches/successMatchesForListing/${id}`);
const getPotFlateeMatches = async (jwt, payload)  => await authparamaxios(jwt, payload).get(`/matches/potentialMatchesForFlatee/`);
const getPotListingMatches = async (jwt, payload)  => await authparamaxios(jwt, payload).get(`/matches/potentialMatchesForListing/`);
const addListingToMatch = async (jwt, payload)  => await authaxios(jwt).post(`/matches/addListing/`, payload);
const addFlateeToMatch = async (jwt, payload)  => await authaxios(jwt).post(`/matches/addFlatee/`, payload);
const unmatch = async (id, jwt, payload)  => await authaxios(jwt).put(`/matches/unmatch/${id}`, payload);
const deleteMatchById = async (id, jwt)  => await authaxios(jwt).delete(`/matches/${id}`);

// Listing Requests
const addListing = async (jwt, payload)  => await authaxios(jwt).post(`/listings/`, payload);
const getListingByFlatId = async (flatId, jwt) => await authaxios(jwt).get(`/listings/flat/${flatId}`);
const getListingById = async (id, jwt)  => await authaxios(jwt).get(`/listings/${id}`);
const getAllListings = async (jwt)  => await authaxios(jwt).get(`/listings/all`);
const getFlatAccount = async (id, jwt) => await authaxios(jwt).get(`/flatAccount/${id}`);
const updateListingById = async (id, jwt, payload)  => await authaxios(jwt).put(`/listings/${id}`, payload);
const deleteListingById = async (id, jwt)  => await authaxios(jwt).delete(`/listings/${id}`);

// Chat Requests
const addChat = async (jwt, payload)  => await authaxios(jwt).post(`/chat/`, payload);
const addMessageToChat = async (id, jwt, payload)  => await authaxios(jwt).post(`/chat/message/${id}`, payload);
const getChatById = async (id, jwt)  => await authaxios(jwt).get( `/chat/${id}`);
const getChatByMatchId = async (matchId, jwt)  => await authaxios(jwt).get( `/chat/match/${matchId}`);
const getAllChats = async (jwt)  => await authaxios(jwt).get(`/chat/`);
const updateChatById = async (id, jwt, payload)  => await authaxios(jwt).put(`/chat/${id}`, payload);
const deleteChatById = async (id, jwt)  => await authaxios(jwt).delete(`/chat/${id}`);

// Notificaiton Requests
const getUsersNotifications = async (jwt)  => await authaxios(jwt).get(`/notifications/`);
const readNotfication = async (id, jwt)  => await authaxios(jwt).put(`/notifications/read/${id}`);
const addNotification = async (jwt, payload)  => await authaxios(jwt).get(`/notifications/`, payload);
const deleteNotificationById = async (id, jwt)  => await authaxios(jwt).delete(`/notification/${id}`);

const api = {
    authenticate,
    register,
    logout,
    getUserById,
    getAllUsers,
    getJWTUser,
    updateUserById,
    deleteUserById,
    getAllMatches,
    getMatchById,
    findFlatee, 
    getFlateeMatches,
    getListingMatches,
    getPotFlateeMatches,
    getPotListingMatches,
    addListingToMatch,
    addFlateeToMatch,
    unmatch,
    deleteMatchById,
    getOwnedFlats,
    getFlatById,
    getAllFlats,
    updateFlatById,
    deleteFlatById,
    addLocation,
    getAllLocations,
    getLocationById,
    updateLocationById,
    deleteLocationById,
    addListing,
    getListingByFlatId,
    getListingById,
    getAllListings,
    getFlatAccount,
    updateListingById,
    deleteListingById,
    addChat,
    addMessageToChat,
    getChatById,
    getChatByMatchId,
    getAllChats,
    updateChatById,
    deleteChatById,
    getUsersNotifications,
    readNotfication,
    addNotification,
    deleteNotificationById
}

export default api;