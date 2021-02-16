import React, {useState} from 'react';
import {useSelector, useDispatch} from "react-redux";
import { useHistory } from "react-router-dom";
import LoadingSplash from '../components/LoadingSplash';
import DynamicSort from '../components/js/DynamicSort';
import {setStats} from '../redux/actions/stats';
import {setPlayer} from '../redux/actions/player';
import {setLoading} from '../redux/actions/loading';
import {setMatch} from '../redux/actions/match';
import {setMatchIndex} from '../redux/actions/matchIndex';
import RiotAPIManager from '../network/RiotAPI/riot-api';

const Home = () => {    

    const [region, setRegion] = useState(' ');
    const [regionFull, setRegionFull] = useState(' ');
    const [name, setName] = useState(' ');
    const [errorMessage, setErrorMessage] = useState(' ');

    const isLoading = useSelector(state => state.loading);

    const dispatch = useDispatch();
    const history = useHistory();

    //Return the region's abbreviation based on the region's id
    const setRegionState = (value) => {
        setRegion(value);
        switch(value) {
            case 'eun1':
                setRegionFull('EUNE');
                break;
            case 'euw1':
                setRegionFull('EUW');
                break;
            default:
              return 'Error';
          }
    };
    
    const validate = () => {
        if (name === ' ' || region === ' ') {
            return;
        } else if (name.length < 4 || name.length > 16) {
            setErrorMessage("Summoner names are between 4 and 16 symbols long");
        } else {
            handleRequest();
        }
    }

    const handleRequest = async () => {
        setErrorMessage(" ");
        dispatch(setLoading(true));
        const responsePlayer = await RiotAPIManager.getPlayer(name, region, regionFull);
        if(responsePlayer && responsePlayer.hasOwnProperty('newPlayer')){
            dispatch(setPlayer(responsePlayer.newPlayer));
            dispatch(setStats(responsePlayer.newStats));
            const responseMatches = await RiotAPIManager.getMatches(responsePlayer.newPlayer);
            handleMatches(responseMatches);
        } else {
            setErrorMessage(responsePlayer);
            dispatch(setLoading(false));
        }
    }

    const handleMatches = (matches) => {
        //Allows the application enough time to sort the matches properly
        setTimeout(()=>{
            if (matches.length !== 0) {
                //Sorts all found matches by descending date before dispatching
                matches.sort(DynamicSort.sortMatches("dateTime"));
                console.log(matches);
                dispatch(setMatch(matches));
                //Removes match index from potential previous player statistics viewed
                dispatch(setMatchIndex(' '));
                //If all requests have been executed redirects user to the match history page
                history.push('/match');
            }
            dispatch(setLoading(false));
        },2000); 
    }

    //Home page render
    return <div>
        {isLoading ? <LoadingSplash message="Loading..."></LoadingSplash> :
            <form id="searchUser" onSubmit={(e) => e.preventDefault()}>
                <div className="bg-light border rounded-top">
                    <div className="text-muted p-2">
                        Search a player
                    </div>
                </div>
                <div className="bg-white border-left border-right">
                    <div className="row p-2">
                        <div className="col-md-8">
                            <input type="text" className="form-control mt-2" id="user" placeholder="Username" onChange={e => setName(e.target.value)} required/>
                        </div>
                        <div className="col-md-4">
                        <select id="selectRegion" defaultValue = "0" className="form-control mt-2" onChange={e => setRegionState(e.target.value)} required>
                            <option value="0" disabled>Select region</option>
                            <option value="eun1">EU Nordic and East</option>
                            <option value="euw1">EU West</option>
                        </select>
                        </div>
                    </div>
                </div>
                <div className="bg-light border rounded-bottom p-2">  
                    <div className="row p-2">
                        <div className="col-md-9">
                            <div className="p-1 m-1 text-danger small" id="errMessage">
                                {errorMessage}
                            </div>
                        </div>           
                        <div className="col-md-3 text-right">
                            <button className="btn btn-primary" onClick = {() => validate()}><i className="fa fa-search mr-1"></i>Search</button>
                        </div>
                    </div>
                </div>
            </form>
        }
    </div>
}

export default Home;