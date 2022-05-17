import React, {useState} from 'react';
import {useSelector, useDispatch} from "react-redux";
import { useHistory } from "react-router-dom";
import LoadingSplash from '../components/LoadingSplash';
import PlayerCard from '../components/PlayerCard';
import MatchDisplay from '../components/js/MatchDisplay';
import {setStats} from '../redux/actions/stats';
import {setPlayer} from '../redux/actions/player';
import {setLoading} from '../redux/actions/loading';
import {setMatch} from '../redux/actions/match';
import {setMatchIndex} from '../redux/actions/matchIndex';
import {setLoggedUser} from '../redux/actions/loggedUser';
import RiotAPIManager from '../network/RiotAPI/riot-api';
import service from "../network/GraphQL/graphql-service";

const Profile = () => {

    const [selectedTab, setSelectedTab] = useState('Profile');

    const [accountName, setAccountName] = useState(' ');
    const [accountRegion, setAccountRegion] = useState(' ');
    const [username, setUsername] = useState(' ');
    const [password, setPassword] = useState(' ');
    const [newPassword, setNewPassword] = useState(' ');
    const [confNewPassword, setConfNewPassword] = useState(' ');
    const [change, setChange] = useState(false)
    const [errorMessageAccount, setErrorMessageAccount] = useState(' ');
    const [errorMessageUser, setErrorMessageUser] = useState(' ');
    const [confMessageUser, setConfMessageUser] = useState(' ');
    const [errorMessagePass, setErrorMessagePass] = useState(' ');
    const [confMessagePass, setConfMessagePass] = useState(' ');
    const [errorMessageDel, setErrorMessageDel] = useState(' ');
    const [errorMessageFriend, setErrorMessageFriend] = useState(' ');
    const [deleteCheck, SetDeleteCheck] = useState(false);

    const loggedUser = useSelector(state => state.loggedUser);
    const loggedUserFriends = useSelector(state => state.loggedUser.friends);

    const isLoading = useSelector(state => state.loading);

    const dispatch = useDispatch();
    const history = useHistory();

    const renderSection = () => {
        switch(selectedTab) {
            case 'Profile':
                return profile()
            case 'Saved Players':
                return players()
            case 'Settings':
                return settings()
            default:
              return 'An error has occurred while trying to open page';
        }
    }

    const logout = () => {
        dispatch(setLoggedUser({}))
        history.push('/')
    }

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

    const validateAccount = (name, region) => {
        if (name === ' ' || region === ' ') {
            return;
        } else if (name.length < 4 || name.length > 16) {
            setErrorMessageAccount("Summoner names are between 4 and 16 symbols long");
        } else {
            findAccount(name, region);
        }
    }

    const findAccount = async (name, region)=> {
        dispatch(setLoading(true));
        setErrorMessageAccount(" ");
        const regionCode = getRegionCode(region);
        const responsePlayer = await RiotAPIManager.getPlayer(name, regionCode, region);
        console.log(responsePlayer);
        if(responsePlayer && responsePlayer.hasOwnProperty('newPlayer')){
            const account = {
                name: responsePlayer.newPlayer.name, 
                region: responsePlayer.newPlayer.region,
                level: responsePlayer.newPlayer.level,
                rank: responsePlayer.newstats.rank,
                division: responsePlayer.newstats.division,
                lp: responsePlayer.newstats.lp,
                wins: responsePlayer.newstats.wins,
                losses: responsePlayer.newstats.losses,
                played: responsePlayer.newstats.played,
            }
            const response = await service.addAccount(loggedUser.id, account);
            if(response && response.hasOwnProperty('data')){
                let user = loggedUser;
                user.account = account;
                dispatch(setLoggedUser(user))
                setChange(false);
            } else {
                setErrorMessageAccount(responsePlayer);
            }
        }
        dispatch(setLoading(false)); 
    };

    const loadFriend = async (friend) => {
        dispatch(setLoading(true));
        setErrorMessageFriend(" ");
        const regionCode = getRegionCode(friend.region);
        const responsePlayer = await RiotAPIManager.getPlayer(friend.name, regionCode, friend.region);
        if(responsePlayer && responsePlayer.hasOwnProperty('newPlayer')){
            dispatch(setPlayer(responsePlayer.newPlayer));
            dispatch(setStats(responsePlayer.newStats));
            const responseMatches = await RiotAPIManager.getMatches(responsePlayer.newPlayer);
            handleMatches(responseMatches);
        } else {
            setErrorMessageFriend(responsePlayer);
            dispatch(setLoading(false));
        }
    }

    const handleMatches = (matches) => {
        setTimeout(()=>{
            if (matches.length !== 0) {
                matches.sort(MatchDisplay.sortMatches("dateTime"));
                console.log(matches);
                dispatch(setMatch(matches));
                dispatch(setMatchIndex(' '));
                history.push('/match');
            }
            dispatch(setLoading(false));
        },2000); 
    }

    //validations
    const validateUsername = () => {
        if (username === ' ') {
            return;
        } else if (username.length < 4 || username.length > 16) {
            setErrorMessageUser("Usernames must be between 4 and 16 symbols long");
        }else if (username === loggedUser.username) {
                setErrorMessageUser("Username is the same");
        } else {
            setErrorMessageUser(" ");
            editUserUsername();
        }
    }

    const validatePassword = () => {
        if (password === ' ' || newPassword === ' ' || confNewPassword === ' ') {
            return;
        } else if (newPassword.length < 6 || newPassword.length > 20) {
            setErrorMessagePass("Passwords must be between 6 and 20 symbols long");
        } else if (newPassword !== confNewPassword) {
            setErrorMessagePass("Password does not match");
        } else if (newPassword === password) {
            setErrorMessagePass("New password cannot be the same as old password");
        } else {
            editUserPassword();
        }
    }

    const validateDelete = () => {
        if (deleteCheck === true) {
            deleteUser();
        }
    }

    //GraphQL requests
    const editUserUsername = async () => {
        try{
            console.log(loggedUser);
            const response = await service.editUserUsername(loggedUser.id, username);
            if(response && response.hasOwnProperty('data')){
                console.log(response)
                setErrorMessageUser(" ")
                setConfMessageUser("Username has been updated");
                let user = loggedUser;
                user.username = response.data.editUserUsername.username;
                dispatch(setLoggedUser(user))
                setTimeout(()=>{
                    setConfMessageUser(" ");
                },4000);
            } else {
                setErrorMessageUser("An error has occured while trying to update username");
            }
        } catch (error){
            setErrorMessageUser("An error has occured while trying to update username");
        }
    }

    const editUserPassword = async () => {
        try{
            const response = await service.editUserPassword(loggedUser.id, password, newPassword);
            if(response && response.hasOwnProperty('data')){
                console.log(response)
                setErrorMessagePass(" ");
                setConfMessagePass("Password has been updated");
                setTimeout(()=>{
                    setConfMessagePass(" ");
                },4000);
            } else {
                setErrorMessagePass("Wrong password");
            }
        } catch (error){
            setErrorMessagePass("An error has occured while trying to update password");
        }
    }

    const deleteUser = async () => {
        try{
            const response = await service.deleteUser(loggedUser.id);
            if(response && response.hasOwnProperty('data')){
                console.log(response)
                dispatch(setLoggedUser({}))
                history.push('/');
            } else {
                setErrorMessageDel("An error has occured while trying to delete account");
            }
        } catch (error){
            setErrorMessageDel("An error has occured while trying to delete account");
        }
    }

    const removeFriend = async (friend) => {
        try{
            delete friend.__typename;
            const response = await service.removeFriend(loggedUser.id, friend);
            if(response && response.hasOwnProperty('data')){
                console.log(response)
                let user = loggedUser;
                user.friends = response.data.removeFriend.friends;
                dispatch(setLoggedUser(user))
            } else {
                setErrorMessageFriend("An error has occured while trying to remove saved account");
            }
        } catch (error){
            setErrorMessageFriend("An error has occured while trying to remove saved account");
        }
    }

    //pages render
    const profile = () => {
        return <div>
            {isLoading ? 
            <LoadingSplash message="Loading..."></LoadingSplash>
            :
            loggedUser.account.name === null || change ?
            <div className="row mb-3">
                <div className="col">
                    <form id="searchUser" onSubmit={(e) => e.preventDefault()}>
                        {change ? 
                            <button className="btn btn-danger btn-sm mb-3" onClick = {() => setChange(false)}><i className="fa fa-close mr-1"></i>Cancel</button>
                            :
                            <span></span>
                        }
                        <div className="mb-3">Save Your League Account</div>
                        <div className="row p-2">
                            <div className="col-md-8">
                                <input type="text" className="form-control mt-2" id="user" placeholder="Username" onChange={e => setAccountName(e.target.value)}  required/>
                            </div>
                            <div className="col-md-4">
                            <select id="selectRegion" defaultValue = "0" className="form-control mt-2" onChange={e => setAccountRegion(e.target.value)} required>
                                <option value="0" disabled>Select region</option>
                                <option value="EUNE">EU Nordic and East</option>
                                <option value="EUW">EU West</option>
                            </select>
                            </div>
                        </div>
                        <div className="row p-2">
                            <div className="col-md-9">
                                <div className="p-1 m-1 text-danger small" id="errMessage">
                                    {errorMessageAccount}
                                </div>
                            </div>           
                            <div className="col-md-3 text-right">
                                <button className="btn btn-primary" onClick = {() => validateAccount(accountName, accountRegion)}><i className="fa fa-search mr-1"></i>Search</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            :
            <div>
                <div className="row justify-content-center">
                    <div className="col-md-5 col-sm-7 col-9">
                        <PlayerCard 
                            name={loggedUser.account.name} 
                            region={loggedUser.account.region} 
                            level={loggedUser.account.level} 
                            rank={loggedUser.account.rank} 
                            division={loggedUser.account.division}
                            lp={loggedUser.account.lp}
                            played={loggedUser.account.played}
                            wins={loggedUser.account.wins}
                            ratio={(((loggedUser.account.wins/loggedUser.account.played) * 100).toFixed(2))}
                            button = "none"
                            >                           
                        </PlayerCard>
                        <div className="row p-2">
                            <div className="col-6">
                                <button className="btn btn-primary" onClick = {() => setChange(true)}>Change</button>
                            </div>
                            <div className="col-6 text-right">
                                <button className="btn btn-primary" onClick = {() => findAccount(loggedUser.account.name, loggedUser.account.region)}>Update</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
    }

    const players = () => {
        return <div>
            {isLoading ? 
            <LoadingSplash message="Loading..."></LoadingSplash>
            :
            <div className="row">
                <div className="col">
                    <div className="p-1 m-1 text-danger small" id="errMessage">
                        {errorMessageFriend}
                    </div>
                {loggedUserFriends.length === 0 ?
                <div className="mt-3 mb-3">You don't have any players saved to your account</div>
                :
                loggedUserFriends.map((friend, i) => {
                    return <div key={i} className="border-bottom p-3 mb-1">
                        <span className="h5">{friend.name + "#" + friend.region}</span>
                        <span className="float-right ml-2 mb-2">
                            <button className="btn btn-sm btn-primary ml-3" onClick = {() => loadFriend(friend)}><i className="fa fa-search"></i></button>
                            <button className="btn btn-sm btn-danger ml-3" onClick = {() => removeFriend(friend)}><i className="fa fa-close"></i></button>
                        </span>
                    </div>
                })}
                </div>
            </div>
            }
        </div>
    }

    const settings = () => {
        return <div>
            <div className="row border-bottom">
                <div className="col">
                    <div className="mb-3">Registered Email</div>
                    <div className="p-2">
                        <div>{loggedUser.email}</div>
                    </div>
                </div>
            </div>
            <div className="row border-bottom">
                <div className="col-lg-6">
                    <form id="changeUsername" onSubmit={(e) => e.preventDefault()}>
                        <div className="mt-3 mb-3">Change Username</div>
                        <div className="p-2">
                            <input type="text" className="form-control mt-1" id="username" placeholder="Username" onChange={e => setUsername(e.target.value)} required/>
                            <div className="p-1 m-1 text-danger small" id="errMessageUser">
                                {errorMessageUser}&nbsp;<span className="text-success">{confMessageUser}</span>
                            </div>
                            <button className="btn btn-primary mt-3 mb-4" onClick = {() => validateUsername()}>Change</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="row border-bottom">
                <div className="col-lg-6">
                    <form id="changePassword" onSubmit={(e) => e.preventDefault()}>
                        <div className="mt-3 mb-3" >Change Password</div>
                        <div className="p-2">
                            <div className="mb-3">
                                <label>Old Password</label>
                                <input type="password" className="form-control" id="oldPassword" placeholder="Password" onChange={e => setPassword(e.target.value)} required/>
                            </div>
                            <div className="mb-3">
                                <label>New Password</label>
                                <input type="password" className="form-control" id="newPassword" placeholder="Password" onChange={e => setNewPassword(e.target.value)} required/>
                            </div>
                            <div className="mb-3">
                                <label>Confirm New Password</label>
                                <input type="password" className="form-control" id="ConfNewPassword" placeholder="Password" onChange={e => setConfNewPassword(e.target.value)} required/>
                            </div>
                            <div className="p-1 m-1 text-danger small" id="errMessagePass">
                                {errorMessagePass}&nbsp;<span className="text-success">{confMessagePass}</span>
                            </div>
                            <button className="btn btn-primary mt-3 mb-4" onClick = {() => validatePassword()}>Change</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <form id="delete" onSubmit={(e) => e.preventDefault()}>
                        <div className="mt-3 mb-3" >Delete Account</div>
                        <div className="p-2">
                            <button className="btn btn-danger mt-3 mb-4" onClick = {() => validateDelete()}>Delete</button>
                            <div className="ml-3">
                                <input type="checkbox" className="form-check-input" id="deleteCheck" onChange = {e => SetDeleteCheck(e.target.checked)} required/>
                                <label className="text-danger small form-check-label" htmlFor="deleteCheck">This will permanently delete the account, the action is irreversible</label>
                                <div className="p-1 m-1 text-danger small" id="errMessageDel">
                                    {errorMessageDel}&nbsp;
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    }

    return <div>
        {loggedUser.username === undefined ? 
        <LoadingSplash message="This feature is currently unavailable"></LoadingSplash>
        :
        <div className="row">
            <div className="col-lg-3">
                <div className="bg-light border rounded-top mb-3">
                    <div className="text-muted p-2 mb-1">
                        My profile
                    </div>
                    <ul className="list-group text-right">
                        <li className={selectedTab === 'Profile' ? "list-group-item active" : "btn list-group-item list-group-item-action"} onClick = {() => setSelectedTab('Profile')}>Profile</li>
                        <li className={selectedTab === 'Saved Players' ? "list-group-item active" : "btn list-group-item list-group-item-action"} onClick = {() => setSelectedTab('Saved Players')}>Saved Players</li>
                        <li className={selectedTab === 'Settings' ? "list-group-item active" : "btn list-group-item list-group-item-action"} onClick = {() => setSelectedTab('Settings')}>Settings</li>
                        <li className="btn list-group-item list-group-item-secondary list-group-item-action" onClick = {() => logout()}>Sign out</li>
                    </ul>
                </div>
            </div>
            <div className="col-lg-9">
                <div className="bg-light border rounded-top">
                    <div className="text-muted border-bottom p-2">
                        {selectedTab}
                    </div>
                    <div className="bg-white p-4">
                        {renderSection()}
                    </div>
                </div>
            </div>
        </div>
        }
    </div>
}

export default Profile;