import * as types from '../types';

export function matchIndex(state = " ", action) {
    switch (action.type) {
        case types.SET_MATCH_INDEX:
            return action.payload
        default:
            return state;
    }
}
