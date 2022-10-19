import React , {useState,useEffect} from 'react';

const NoMatchPage = () => {

    useEffect(() => {
        document.title = '404'
    }, []);

    return(
        <h1 className="text-danger">
            Page Not Found
        </h1>
    )
}

export default NoMatchPage;