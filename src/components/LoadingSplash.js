import React from 'react';

const LoadingSplash = props => {
    return (
        <div className="text-center">
            <img className="img-fluid w-50 mx-auto d-block" src= "images/splash.png" alt="Loading..."/> 
            <div className="font-weight-bold">{props.message}</div> 
        </div>
        );
    }
    
    export default LoadingSplash;