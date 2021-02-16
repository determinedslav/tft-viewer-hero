import React from 'react';
import {useSelector, useDispatch} from "react-redux";
import {setLoggedUser} from '../redux/actions/loggedUser';
import service from "../network/GraphQL/graphql-service";

const PlayerCard = props=> {

    const loggedUser = useSelector(state => state.loggedUser);

    const dispatch = useDispatch();

    const addFriend = async () => {
        try{
            const friend = {name: props.name, region: props.region}
            const response = await service.addFriend(loggedUser.id, friend);
            if(response && response.hasOwnProperty('data')){
                console.log(response)
                let user = loggedUser;
                user.friends = response.data.addFriend.friends;
                dispatch(setLoggedUser(user))
            } else {
                console.log("error");
            }
        } catch (error){
            console.log(error);
        }
    }

    return (
        <div className="p-2 mb-3 bg-white border rounded">
            <div className="text-center">
                <div>
                    <span className="font-weight-bold">{props.name}</span>
                    <span className="text-muted">#{props.region}</span>								
                </div>
                <div className="font-weight-bold">
                    lvl&nbsp;{props.level}
                </div>
                <div>
                    <img className="img-fluid float-center w-50 m-3" src= {"images/emblems/" + props.rank + ".PNG"} alt="Ranked Emblem"/>
                </div>
                <div className="font-weight-bold">
                    {props.rank}&nbsp;{props.division}&nbsp;{props.lp}LP
                </div>
            </div>
            <div className="mt-3 p-2">
                <div className="text-center font-weight-bold mb-3 mt-2">Ranked statistics</div>
                <div className="border-bottom mb-2">
                    <span className="font-weight-bolder">Games played&nbsp;</span><span className="float-right">{props.played}</span>
                </div>
                <div className="border-bottom mb-2">
                    <span className="font-weight-bolder">Games won&nbsp;</span><span className="float-right">{props.wins}</span>
                </div>
                <div className="border-bottom mb-2">
                    <span className="font-weight-bolder">Win rate&nbsp;</span><span className="float-right">{props.ratio}%</span>
                </div>
            </div>
            {loggedUser.username !== undefined ? 
            <div className="text-center">
                <button className={"btn btn-primary d-"+ props.button} onClick = {() => addFriend()}>Save Player</button>
            </div>
            :<div></div>}
        </div>
    );
}

export default PlayerCard;