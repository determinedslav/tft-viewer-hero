import React, {useState} from 'react';
import {useSelector, useDispatch} from "react-redux";
import { useHistory } from "react-router-dom";
import LoadingSplash from '../components/LoadingSplash';
import {setLoggedUser} from '../redux/actions/loggedUser';
import service from "../network/GraphQL/graphql-service";

const Login = () => {
    
    const [email, setEmail] = useState(' ');
    const [password, setPassword] = useState(' ');
    const [errorMessage, setErrorMessage] = useState(' ');

    const loggedUser = useSelector(state => state.loggedUser);

    const dispatch = useDispatch();
    const history = useHistory();

    const redirect = () => {
        history.push('/register');
    };

    const validate = () => {
        if (email === ' ' || password === ' ') {
            return;
        } else {
            getUser();
        }
    }

    const getUser = async () => {
        try{
            const response = await service.getUser(email, password);
            if(response && response.hasOwnProperty('data')){
                console.log(response)
                const user = {id: response.data.login._id, username: response.data.login.username, email: response.data.login.email, account: response.data.login.account , friends: response.data.login.friends};
                console.log(user)
                dispatch(setLoggedUser(user))
                history.push('/profile');
            } else {
                setErrorMessage("Wrong email or password");
            }
        } catch (error){
            console.log(error);
            setErrorMessage("An error has occured while trying to login");
        }
    }

    return <div>
        {loggedUser.username === undefined ? 
        <LoadingSplash message="This feature is currently unavailable"></LoadingSplash>
        :
        <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 col">
                <form id="login" onSubmit={(e) => e.preventDefault()}>
                    <div className="bg-light border rounded-top">
                        <div className="text-muted p-2">
                            Login
                        </div>
                    </div>
                    <div className="bg-white border-left border-right p-2">
                        <div className="mb-3">
                            <label>Email</label>
                            <input type="email" className="form-control mt-2" id="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required/>
                        </div>
                        <div className="mb-3">
                            <label>Password</label>
                            <input type="password" className="form-control mt-2" id="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required/>
                        </div>
                        <div className="p-1 m-1 text-center" id="errMessage">
                            <div className="btn text-primary small" onClick = {() => redirect()}>Don't have an account?</div>
                        </div>
                        <div className="p-1 m-1 text-danger small text-center" id="errMessage">
                            {errorMessage}&nbsp;
                        </div>
                    </div>
                    <div className="bg-light text-right border rounded-bottom p-2">
                        <button className="btn btn-primary" onClick = {() => validate()}>Login</button>
                    </div>
                </form>
            </div>
        </div>
        }
    </div>
}

export default Login;