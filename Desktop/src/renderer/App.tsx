import React from 'react'
import './App.global.css';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { Editor } from './containers/Editor';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Editor} />
      </Switch>
    </Router>
  )
}

export default App