import * as types from '../types';

export function stats(state = [{isSet: false}], action) {
    switch (action.type) {
        case types.SET_STATS:
            return action.payload
        default:
            return state;
    }
}
