import * as types from '../types';

export function match(state = [], action) {
    switch (action.type) {
        case types.SET_MATCH:
            return action.payload
        default:
            return state;
    }
}
