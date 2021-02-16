import * as types from '../types';

export function setLoggedUser(loggedUser){
    return {
        type: types.SET_LOGGED_USER,
        payload: loggedUser
    }
}