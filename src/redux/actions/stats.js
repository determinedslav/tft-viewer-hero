import * as types from '../types';

export function setStats(stats) {
    return {
        type: types.SET_STATS,
        payload: stats
    }
}
