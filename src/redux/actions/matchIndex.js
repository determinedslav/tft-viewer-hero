import * as types from '../types';

export function setMatchIndex(matchIndex) {
    return {
        type: types.SET_MATCH_INDEX,
        payload: matchIndex
    }
}
