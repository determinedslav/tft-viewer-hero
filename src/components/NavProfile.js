import React from 'react';
import {useSelector, useDispatch} from "react-redux";
import { useHistory } from "react-router-dom";
import DynamicSort from '../components/js/DynamicSort';
import {setStats} from '../redux/actions/stats';
import {setPlayer} from '../redux/actions/player';
import {setLoading} from '../redux/actions/loading';
import {setMatch} from '../redux/actions/match';
import {setMatchIndex} from '../redux/actions/matchIndex';
import {setLoggedUser} from '../redux/actions/loggedUser';
import RiotAPIManager from '../network/RiotAPI/riot-api';

const NavProfile = props => {

    const loggedUserUsername = useSelector(state => state.loggedUser.username);
    const loggedUserFriends = useSelector(state => state.loggedUser.friends);

    const isLoading = useSelector(state => state.loading);

    const dispatch = useDispatch();
    const history = useHistory();

    const redirect = (value) => {
        switch(value) {
            case 'login':
                history.push('/login');
                break;
            case 'register':
                history.push('/register');
                break;
            case 'profile':
                history.push('/profile');
                break;
            default:
              return 'Error';
          }
    };

    const logout = () => {
        dispatch(setLoggedUser({}))
        history.push('/')
    };

    const getRegionCode = (value) => {
        switch(value) {
            case 'EUNE':
                return'eun1';
            case 'EUW':
                return'euw1';
            default:
              return 'Error';
          }
    };

    const loadFriend = async (friend) => {
        const regionCode = getRegionCode(friend.region);
        dispatch(setLoading(true));
        if (!isLoading) {
            const responsePlayer = await RiotAPIManager.getPlayer(friend.name, regionCode, friend.region);
            if(responsePlayer && responsePlayer.hasOwnProperty('newPlayer')){
                dispatch(setPlayer(responsePlayer.newPlayer));
                dispatch(setStats(responsePlayer.newStats));
                const responseMatches = await RiotAPIManager.getMatches(responsePlayer.newPlayer);
                handleMatches(responseMatches);
            } else {
                dispatch(setLoading(false));
            }
        }
    };

    const handleMatches = (matches) => {
        setTimeout(()=>{
            if (matches.length !== 0) {
                matches.sort(DynamicSort.sortMatches("dateTime"));
                console.log(matches);
                dispatch(setMatch(matches));
                dispatch(setMatchIndex(' '));
                history.push('/match');
            }
            dispatch(setLoading(false));
        },2000); 
    };

    return <div>
            {loggedUserUsername !== undefined ? 
            <div>
                <div className="btn text-light d-inline">
                    <span onClick = {() => redirect("profile")}><i className="fa fa-user mr-2"></i>{loggedUserUsername}</span>
                </div>
                <div className="text-light d-inline">
                    <select id="selectFriend" defaultValue = "0" className="form-control-sm">
                        <option value="0" disabled>Saved player accounts</option>
                        {loggedUserFriends.map((friend, i) => {
                            return <option key={i} value={friend} onClick = {() => loadFriend(friend)}>{friend.name + "#" + friend.region}</option>
                        })}
                    </select>
                </div>
                <div className="btn text-light d-inline">
                    <span onClick = {() => logout()}><i className="fa fa-sign-out ml-2"></i></span>
                </div>
            </div> 
            :
            <div className="">
                <div className="btn btn-outline-light" onClick = {() => redirect("login")}>Login</div>
                <div className="btn btn-outline-primary ml-2" onClick = {() => redirect("register")}>Register</div>
            </div>
            }
        </div>
}
    
export default NavProfile;