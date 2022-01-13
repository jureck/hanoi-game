import React from 'react';

import { HashRouter, Route, Switch } from "react-router-dom";

import Home from './components/Home/index';
import Game from './components/Game/index';


function App() {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/game">
          <Game />
        </Route>
      </Switch>
    </HashRouter>
  );
}

export default App;
