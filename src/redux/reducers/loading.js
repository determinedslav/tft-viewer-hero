import * as types from '../types';

export function loading (state = false, action){
    switch (action.type){
        case types.LOADING:
            return action.payload;
        default: 
            return state;
    }
}