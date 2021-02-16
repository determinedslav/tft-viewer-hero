import * as types from '../types';

export function player(state = {}, action) {
    switch (action.type) {
        case types.SET_PLAYER:
            return action.payload
        default:
            return state;
    }
}
