import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Index from './pages/index'
import Dashboard from './pages/dashboard'
import Form from './pages/form'
import Notification from './components/Notification'

import NotFound from './pages/404'

const app = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Index} />
        <Route path="/event/:eventId/dashboard" component={Dashboard} />
        <Route path="/event/:eventId/form" component={Form} />
        <Route path="*" component={NotFound} />
      </Switch>
      <Notification />
    </Router>
  )
}

export default app
