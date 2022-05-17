import React from 'react';
import {useSelector} from "react-redux";
import LoadingSplash from '../components/LoadingSplash';
import MatchDisplay from '../components/js/MatchDisplay';
import PlayerCard from '../components/PlayerCard';
import '../assets/css/tiers.css';

const Details = () => {
    const matchIndex = useSelector(state => state.matchIndex);
    const stats = useSelector(state => state.stats);
    const player = useSelector(state => state.player);
    const match = useSelector(state => state.match[matchIndex]);
    const isLoading = useSelector(state => state.loading);

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

    //Details page render
    return <div>
        {
        //No player have been found yet or found player does not have tft data
        stats.rank === undefined || stats.isSet === false ? 
        <LoadingSplash message="Select a player to view information"></LoadingSplash> : 
        //No match has been selected yet
        matchIndex === ' ' ? <LoadingSplash message="Select a match to view details"></LoadingSplash> : 
        //Loading has been set to true
        isLoading ? <LoadingSplash message="Loading..."></LoadingSplash>:
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
                            Match Details
                        </div>
                        <div className="bg-white border p-4">
                            <div className ="font-weight-bold mb-2 ml-1">{MatchDisplay.getQueueType(match.queueId)}</div>
                            <div className={"display-4 rounded p-1 text-center placement"+match.placement}>
                                {match.placement}
                            </div>
                            <div className="row ml-0">
                                {match.units.map((units, i) => {
                                    return <div key={i} className="d-flex flex-row">
                                    <div>
                                        {getUnitTier(units.tier)}
                                        <img className={"rounded rarity" + units.rarity} height="52" width="52" src= {"images/champions/" + units.character_id+ ".png"} alt={units.character_id}/>
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
                                    return <span key={i} className="ml-2">
                                        <img className={"rounded p-1 traitTier" + traits.style} height="25" width="25" src= {"images/traits/" + traits.name + ".svg"} alt={traits.name}/>{traits.num_units}
                                    </span>
                                })}
                            </div>
                            <div className="row mb-1 mt-4 border-bottom">
                                <div className="col-md-6 mb-2">
                                    Round reached: {match.lastRound}
                                </div>
                                <div className="col-md-6 mb-2">
                                    Level reached: {match.level}
                                </div>
                            </div>
                            <div className="row mb-1 mt-4 border-bottom">
                                <div className="col-md-6 mb-2">
                                    Number of player eleminated: {match.playersEliminated}
                                </div>
                                <div className="col-md-6 mb-2">
                                    Total damage dealt to players: {match.totalDamageToPlayers}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
    </div>
}

export default Details;