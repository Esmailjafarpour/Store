import React , {useState,useEffect,useContext} from 'react';
import {UserContext} from '../UserContext';

const Dashboard = () => {

    useEffect(() => {
        document.title = 'Dashboard'
    }, []);

    const context = useContext(UserContext);
    console.log(context)

    return(
        <h1 className="text-success">
           Dashboard
        </h1>
    )
}

export default Dashboard;