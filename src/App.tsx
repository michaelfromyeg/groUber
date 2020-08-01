import React, { useState, ReactElement } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Index from './pages/index';
import Dashboard from './pages/dashboard';
import Form from './pages/form';
import Notification from './components/Notification';
import theme from './styles/theme';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import NotFound from './pages/404';
import Login from './pages/login';
import * as firebase from 'firebase';
import 'firebase/auth';

function PrivateRoute({ component: Component, ...rest }: any) {
    return (
        <Route
            {...rest}
            render={(props) => {
                if (firebase.auth().currentUser) {
                    return <Component {...props} />;
                } else {
                    window.localStorage.setItem('location', props?.location?.pathname);
                    return <Redirect to="/login" />;
                }
            }}
        />
    );
}

function PublicRoute({ component: Component, onUserLogin, ...rest }: any) {
    return (
        <Route
            {...rest}
            render={(props) => {
                if (!firebase.auth().currentUser) {
                    return <Component {...props} onUserLogin={onUserLogin} />;
                } else {
                    const route = window.localStorage.getItem('location') || '/';
                    window.localStorage.removeItem('location');
                    return <Redirect to={route} />;
                }
            }}
        />
    );
}

const App = (): ReactElement => {
    const [user, setUser] = useState(firebase.auth().currentUser);
    firebase.auth().onAuthStateChanged(setUser);

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Switch>
                    <PublicRoute exact path="/login" component={Login} />
                    <PrivateRoute exact path="/" component={Index} />
                    <PrivateRoute path="/event/:eventId/dashboard" component={Dashboard} />
                    <PrivateRoute path="/event/:eventId/form" component={Form} />
                    <Route path="*" component={NotFound} />
                </Switch>
                <Notification />
            </Router>
        </ThemeProvider>
    );
};

export default App;
