import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyDvCT-243TWt9Dwb9ChTOgfkFMUhIjTlRc',
    authDomain: 'find-my-carpool.firebaseapp.com',
    databaseURL: 'https://find-my-carpool.firebaseio.com',
    projectId: 'find-my-carpool',
    storageBucket: 'find-my-carpool.appspot.com',
    messagingSenderId: '470237283855',
    appId: '1:470237283855:web:d3aa289ca316787e4a457a',
    measurementId: 'G-YSVSBWXT23',
};
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
