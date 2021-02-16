import * as loadingReducers from './loading';
import * as statsReducers from './stats';
import * as playerReducers from './player';
import * as matchReducers from './match';
import * as matchIndexReducers from './matchIndex';
import * as loggedUserReducers from './loggedUser'
import {combineReducers} from 'redux';

export default combineReducers(Object.assign(
    loadingReducers,
    statsReducers,
    playerReducers,
    matchReducers,
    matchIndexReducers,
    loggedUserReducers,
));