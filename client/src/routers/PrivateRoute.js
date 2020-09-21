import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// import { useSelector } from 'react-redux';
// import { selectUserData } from '../slices/userSlice'

const PrivateRoute = ({ component: Component, ...rest }) => {
    const isAuthenticated = () => {
        return Boolean(localStorage.jwtToken)
    }

    return (
        <Route {...rest} render={props => (
            isAuthenticated() ?
                (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
        )} />
    );
};

export default PrivateRoute;