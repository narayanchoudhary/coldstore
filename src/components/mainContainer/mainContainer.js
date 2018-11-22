import React from 'react';
import './mainContainer.css';

const MainContainer = (props) => {
    return (
        <div className="mainContainer">
            {props.children}
        </div>
    );
};

export default MainContainer;