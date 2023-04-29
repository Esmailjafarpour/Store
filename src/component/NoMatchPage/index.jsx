import React , {useState,useEffect} from 'react';
import "./style.css";

const NoMatchPage = () => {

    useEffect(() => {
        document.title = '404'
    }, []);

    return(
        <div className="row">
            <div className="col-lg-12 bg-dark mt-2 p-2 rounded-3">
                <div className="col-lg d-flex justify-content-center bg-gradient p-2 rounded-3">
                    <img className="not-found" alt="404"/>
                </div>
            </div>
        </div>
        
    )
}

export default NoMatchPage;