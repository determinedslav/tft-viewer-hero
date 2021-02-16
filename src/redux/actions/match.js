import * as types from '../types';

export function setMatch(match) {
    return {
        type: types.SET_MATCH,
        payload: match
    }
}
