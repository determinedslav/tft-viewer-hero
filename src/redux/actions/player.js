import * as types from '../types';

export function setPlayer(player) {
    return {
        type: types.SET_PLAYER,
        payload: player
    }
}
