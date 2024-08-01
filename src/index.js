import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
import StarRating from "./StarRating";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        {/*<App />*/}
        <StarRating messages={['Terrible', 'Poor', 'Okay', 'Good', 'Amazing']}/>
        <StarRating maxRating={3}/>
        <StarRating maxRating={10} defaultRating='4'/>
    </React.StrictMode>
);
