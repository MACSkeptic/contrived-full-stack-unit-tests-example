import _ from 'lodash';
import React from 'react';
import { connect as reduxConnect } from 'react-redux';
import { Route, Redirect, Switch, NavLink } from 'react-router-dom';
import { connect as contextConnect } from './context.js';
import { AnimalListController } from './AnimalList.js';
import { fetchAnimalsContext, fetchAnimalsRedux } from './fetch.js';

export const ReduxAnimalListController = reduxConnect((state, ownProps) => ({
  animals: _.get(state, ['animals', ownProps.match.params.index]) || {}, nav: 'redux'
}), { fetch: fetchAnimalsRedux })(AnimalListController);

export const ContextAnimalListController = contextConnect('animals')((state, ownProps) => ({
  animals: _.get(state, [ownProps.match.params.index]) || {}, nav: 'context'
}), { fetch: fetchAnimalsContext })(AnimalListController);

export const App = () => (
  <React.Fragment>
    <header>
      <NavLink to="/redux/animals">Redux</NavLink>
      <NavLink to="/context/animals">Context</NavLink>
    </header>
    <Switch>
      <Route path="/context" render={() => (
        <Switch>
          <Route path="/context/animals/:index" component={ContextAnimalListController} />
          <Route path="/context/animals" render={() => <Redirect to="/context/animals/all" />} />
          <Route path="/context" render={() => <Redirect to="/context/animals" />} />
        </Switch>
      )} />
      <Route path="/redux" render={() => (
        <Switch>
          <Route path="/redux/animals/:index" component={ReduxAnimalListController} />
          <Route path="/redux/animals" render={() => <Redirect to="/redux/animals/all" />} />
          <Route path="/redux" render={() => <Redirect to="/redux/animals" />} />
        </Switch>
      )} />
      <Route path="/" render={() => <Redirect to="/redux" />} />
    </Switch>
  </React.Fragment>
);

export default App;
