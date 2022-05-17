import React from 'react';
import {useSelector, useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import LoadingSplash from '../components/LoadingSplash';
import MatchDisplay from '../components/js/MatchDisplay';
import PlayerCard from '../components/PlayerCard';
import {setMatchIndex} from '../redux/actions/matchIndex';
import '../assets/css/tiers.css';

const Match = () => {
    const stats = useSelector(state => state.stats);
    const player = useSelector(state => state.player);
    const match = useSelector(state => state.match);
    const isLoading = useSelector(state => state.loading);

    const dispatch = useDispatch();
    const history = useHistory();

    //Checks the unit's tier and returns the coresponding star design
    const getUnitTier = (value) => {
        switch(value) {
            case 1:
                return <div className="font-weight-bold text-center tier1">*</div>
            case 2:
                return <div className="font-weight-bold text-center tier2">**</div>
            case 3:
                 return <div className="font-weight-bold text-center tier3">***</div>
            default:
              return 'Error';
          }
    };

    //Changes the currently selected match index and redirects to the details page
    const redirectToDetails = (index) => {
        dispatch(setMatchIndex(index))
        history.push('/details');
    }

    //Match page render
    return <div>
            {
            //No player have been found yet or found player does not have tft data
            stats.rank === undefined || stats.isSet === false ? <LoadingSplash message="Select a player to view information"></LoadingSplash> : 
            //Loading has been set to true
            isLoading ? <LoadingSplash message="Loading..."></LoadingSplash> :
            //Loading has been set to false
                <div className="row">
                    <div className="col-lg-3">
                        <PlayerCard name={player.name} 
                        region={player.region} 
                        level={player.level} 
                        rank={stats.rank} 
                        division={stats.division}
                        lp={stats.lp}
                        played={stats.played}
                        wins={stats.wins}
                        ratio={(((stats.wins/stats.played) * 100).toFixed(2))}></PlayerCard>
                    </div>
                    <div className="col-lg-9">
                        <div className="bg-light border rounded-top">
                            <div className="text-muted p-2 mb-1">
                                Match history - showing most recent games
                            </div>
                            <ul className="list-group">
                                {match.map((match, i) => {
                                    match.units.sort(MatchDisplay.sortMatches("tier"));
                                    match.traits.sort(MatchDisplay.sortMatches("style"));
                                    return <li key={i} className={"list-group-item border-left-0 border-right-0 border-top border-bottom rounded-0 placement"+match.placement}>
                                        <div className ="font-weight-bold mb-2 ml-1">{MatchDisplay.getQueueType(match.queueId)}</div>
                                        <div className="row">
                                            <div className="display-4 col-sm-1">
                                                {match.placement}
                                            </div>
                                            <div className="col-sm-9">
                                                <div className="row ml-0">
                                                    {match.units.map((units, i) => {
                                                        return <div key={i} className="d-flex flex-row">
                                                        <div>
                                                            {getUnitTier(units.tier)}
                                                            <img className={"rounded rarity" + units.rarity} height="52" width="52" src= {"images/champions/" + units.character_id + ".png"} alt={units.character_id}/>
                                                            <div className="row ml-0">
                                                                {units.items.map((item, i) => {
                                                                    return  <div key={i} className="d-flex flex-row">
                                                                        <img className="border border-dark rounded" height="17" width="17" src= {"images/items/" + item + ".png"} alt={item}/>
                                                                    </div>
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    })}
                                                </div>
                                                <div className="row mt-1">
                                                    {// eslint-disable-next-line
                                                    match.traits.map((traits, i) => {
                                                        if (traits.style > 0) {
                                                            return <span key={i} className="ml-2">
                                                                <img className={"rounded-lg p-1 traitTier" + traits.style}  height="25" width="25" src= {"images/traits/" + traits.name + ".svg"} alt={traits.name}/>{traits.num_units}
                                                            </span>
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                            <div className="col-sm-2">
                                                <button className="btn btn-primary mt-3 float-right" onClick = {() => redirectToDetails(i)}>Details</button>
                                            </div>
                                        </div>
                                    </li>
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            }  
    </div>
}

export default Match;