import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Index from './pages/index'
import NotFound from './pages/404'

const app = () => {
  return (  
    <Router>
        <Switch>
          <Route exact path="/">
            <Index />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
    </Router>
  );
}

export default app;
