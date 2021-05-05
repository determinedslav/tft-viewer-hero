import API from '../constants/RiotAPI';
import Remote from './remote';

async function getPlayer(name, region, regionFull){
    try{
        let newPlayer;
        let newStats;
        const requestNameURL = "https://tft-cors-proxy.herokuapp.com/" + API.protocol + region + API.apiURL + API.nameByName + name + API.key + API.keyValue;
        const responseName = await Remote.get(requestNameURL);
        if(responseName && responseName.hasOwnProperty('data')){
            newPlayer = {
                region: regionFull,
                name: responseName.data.name,
                level: responseName.data.summonerLevel,
                id: responseName.data.id,
                puuid: responseName.data.puuid,
            }
            const requestStatsURL = "https://tft-cors-proxy.herokuapp.com/" + API.protocol + region + API.apiURL + API.statsBySummonerId + responseName.data.id + API.key + API.keyValue;
            const responseStats = await Remote.get(requestStatsURL);
            if(responseStats && responseStats.hasOwnProperty('data')){
                if (responseStats.data.length === 0) {
                    return "No TFT information available for this player";
                } else {
                    // eslint-disable-next-line
                    responseStats.data.map(item=>{
                        if (item.queueType === "RANKED_TFT"){
                            newStats = {
                                rank: item.tier,
                                division: item.rank,
                                wins: item.wins,
                                losses: item.losses,
                                played: item.wins + item.losses,
                                lp: item.leaguePoints,
                            }
                        }
                    });
                }
            }
            console.log(newStats);
            return {newPlayer, newStats};
        }
    } catch (error) {
        console.log(error);
        return "Failed to find a player with this name in this region; Player does not exist or some error has occured"
    } 
};

async function getMatches(player) {
    try{
        let matches = [];
        const requestHistoryURL = "https://tft-cors-proxy.herokuapp.com/" + API.protocol + API.europe + API.apiURL + API.matchesByPuuid + player.puuid + API.matchesParams + API.keyValue;
        const responseHistory = await Remote.get(requestHistoryURL);
        if(responseHistory && responseHistory.hasOwnProperty('data')){
            //For each found match id call the getMatchByMatchId API
            responseHistory.data.map(async item=> {
                const requestMatchURL = "https://tft-cors-proxy.herokuapp.com/" + API.protocol + API.europe + API.apiURL + API.matchByMatchId + item + API.key + API.keyValue;
                const responseMatch = await Remote.get(requestMatchURL);
                if(responseMatch && responseMatch.hasOwnProperty('data')){
                    // eslint-disable-next-line
                    responseMatch.data.info.participants.map(item=> {
                        if (item.puuid === player.puuid){
                            const newMatch =  {
                                dateTime: responseMatch.data.info.game_datetime,
                                queueId: responseMatch.data.info.queue_id,
                                placement: item.placement,
                                level: item.level,
                                lastRound: item.last_round,
                                playersEliminated: item.players_eliminated,
                                totalDamageToPlayers: item.total_damage_to_players,
                                traits: item.traits,
                                units: item.units,
                            }
                            //Pushed each found match into an array
                            matches.push(newMatch);
                        }
                    });
                }
            });
            return matches;               
        }
    } catch (error) {
        console.log(error);
    }
};

export default {
    getPlayer,
    getMatches
}