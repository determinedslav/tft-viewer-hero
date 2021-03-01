export default {
    //Base API constants
    protocol: "https://",
    apiURL: ".api.riotgames.com/tft/",
    key: "?api_key=",
    keyValue: "RGAPI-e7bdeedf-137e-41fc-a5ea-dd22c27c39fa",

    //API server region constant
    europe: "europe",

    //GET for each API endpoint
    nameByName: "summoner/v1/summoners/by-name/",
    statsBySummonerId: "league/v1/entries/by-summoner/",
    matchesByPuuid: "match/v1/matches/by-puuid/",
    matchByMatchId: "match/v1/matches/",

    //Extra params needed for matches API
    matchesParams: "/ids?count=10&api_key=",

}