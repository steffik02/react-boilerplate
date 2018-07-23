import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter, { history } from './routers/AppRouter';
import configureStore from './store/configureStore';
import {login, logout} from './actions/auth';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import 'react-dates/lib/css/_datepicker.css';
import { firebase } from './firebase/firebase';
import LoadingPage from './components/LoadingPage'

const store = configureStore();
const jsx = (
    <Provider store={store}>
        <AppRouter />
    </Provider>
);

//render loading message until db loads
ReactDOM.render(<LoadingPage />, document.getElementById('app'));

let hasRendered = false;
const renderApp = () => {
    if (!hasRendered) {
        ReactDOM.render(jsx, document.getElementById('app'));
        hasRendered = true;
    }
}

//callback function runs when auth state changes
firebase.auth().onAuthStateChanged((user) =>{
    //if there's a user we know they just logged in, otherwise they logged out
    if (user) {
        store.dispatch(login(user.uid));
        renderApp();
            if (history.location.pathname === '/') {
                history.push('/dashboard');
            }
    } else {
        store.dispatch(logout());
        renderApp();
        history.push('/');
    }
});