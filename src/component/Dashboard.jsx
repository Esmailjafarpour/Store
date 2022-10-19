import React , {useState,useEffect} from 'react';

const Dashboard = () => {

    useEffect(() => {
        document.title = 'Dashboard'
    }, []);

    return(
        <h1 className="text-success">
           Dashboard
        </h1>
    )
}

export default Dashboard;