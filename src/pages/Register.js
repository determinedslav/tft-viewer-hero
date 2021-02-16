import React, {useState} from 'react';
import {useSelector, useDispatch} from "react-redux";
import { useHistory } from "react-router-dom";
import LoadingSplash from '../components/LoadingSplash';
import {setLoggedUser} from '../redux/actions/loggedUser';
import service from "../network/GraphQL/graphql-service";

const Register = () => {
    
    const [username, setUsername] = useState(' ');
    const [email, setEmail] = useState(' ');
    const [password, setPassword] = useState(' ');
    const [confirmPassword, setConfirmPassword] = useState(' ');
    const [errorMessage, setErrorMessage] = useState(' ');

    const loggedUser = useSelector(state => state.loggedUser);

    const dispatch = useDispatch();
    const history = useHistory();

    const redirect = () => {
        history.push('/login');
    };

    const validate = () => {
        if (username === ' ' || email === ' ' || password === ' ' || confirmPassword === ' ') {
            return;
        }else if (username.length < 4 || username.length > 16) {
            setErrorMessage("Usernames must be between 4 and 16 symbols long");
        } else if (password.length < 6 || password.length > 20) {
            setErrorMessage("Password must be be between 6 and 20 symbols long");
        } else if (password !== confirmPassword) {
            setErrorMessage("Password does not match");
        } else {
            addUser();
        }
    }

    const addUser = async () => {
        try{
            const response = await service.addUser(email, username, password);
            if(response && response.hasOwnProperty('data')){
                console.log(response)
                const user = {id: response.data.addUser._id, username: response.data.addUser.username, email: response.data.addUser.email, account: response.data.addUser.account , friends: response.data.addUser.friends};
                dispatch(setLoggedUser(user))
                history.push('/profile');
            } else {
                setErrorMessage("Email is invalid or already in use");
            }
        } catch (error){
            setErrorMessage("An error has occured while trying to register");
        }
    }

    return <div>
        {loggedUser.username === undefined ? 
        <LoadingSplash message="This feature is currently unavailable"></LoadingSplash>
        :
        <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 col">
                <form id="register" onSubmit={(e) => e.preventDefault()}>
                    <div className="bg-light border rounded-top">
                        <div className="text-muted p-2">
                            Register
                        </div>
                    </div>
                    <div className="bg-white border-left border-right p-2">
                        <div className="mb-3">
                            <label>Username</label>
                            <input type="text" className="form-control mt-2" id="username" placeholder="Username" onChange={e => setUsername(e.target.value)} required/>
                        </div>
                        <div className="mb-3">
                            <label>Email</label>
                            <input type="email" className="form-control mt-2" id="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required/>
                        </div>
                        <div className="mb-3">
                            <label>Password</label>
                            <input type="password" className="form-control mt-2" id="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required/>
                        </div>
                        <div className="mb-3">
                            <label>Confirm Password</label>
                            <input type="password" className="form-control mt-2" id="confirmPassword" placeholder="Confirm Password" onChange={e => setConfirmPassword(e.target.value)} required/>
                        </div>
                        <div className="p-1 m-1 text-center" id="errMessage">
                            <div className="btn text-primary small" onClick = {() => redirect()}>Already have an account?</div>
                        </div>
                        <div className="p-1 m-1 text-danger small text-center" id="errMessage">
                            {errorMessage}&nbsp;
                        </div>
                    </div>
                    <div className="bg-light text-right border rounded-bottom p-2">
                        <button className="btn btn-primary" onClick = {() => validate()}>Register</button>
                    </div>
                </form>           
            </div>
        </div>
        }
    </div>
}

export default Register;