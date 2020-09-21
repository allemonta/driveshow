import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import PrivateRoute from './PrivateRoute'

import LoginPage from '../components/LoginPage';
import Dashboard from '../components/Dashboard';
import FolderPage from '../components/FolderPage';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={() => (<Redirect to="/login" />)} exact={true} />
                <Route path="/login" component={LoginPage} />
                <Route path="/slideshow/:id" component={LoginPage} />
                <PrivateRoute path="/folders/:folderId" component={FolderPage} />
                <PrivateRoute path="/folders" component={Dashboard} />
            </Switch>
        </BrowserRouter>
    )
};

export default AppRouter;