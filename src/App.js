import _ from 'lodash';
import React from 'react';
import { connect as reduxConnect } from 'react-redux';
import { Route, Redirect, Switch, NavLink } from 'react-router-dom';
import { connect as contextConnect } from './context.js';
import { httpGetAnimals } from './animals/fetch.js';


export const fetchAnimalsContext = (...args) => httpGetAnimals(...args);
export const fetchAnimalsRedux = (filter = 'all') => (reduxDispatch) => {
  const dispatch = (extras) => reduxDispatch(_.merge({
    type: 'animals', status: null, index: filter, data: undefined, error: undefined
  }, extras));

  dispatch({ status: 'started' });
  return httpGetAnimals(filter).then(
    (data) => dispatch({ status: 'success', data }),
    (error) => dispatch({ status: 'failure', error })
  );
};

export const Nav = ({ nav }) => (
  <React.Fragment>
    <nav>{_.map(['all', 'real', 'magical'], target => (<NavLink to={`/${nav}/animals/${target}`} key={target}>{target}</NavLink>))}</nav>
  </React.Fragment>
);

export const AnimalList = ({ cached, loading, data, error }) => (
  <React.Fragment>
    {(cached && <ul>{_.map(data, ({ name, emoji }) => <li key={name}>{emoji} - {name}</li>)}</ul>)}
    {(loading && <div>loading...</div>)}
    {(error && <div>{`error: ${error}`}</div>)}
  </React.Fragment>
);
export class AnimalListController extends React.Component {
  fetch = () => this.props.fetch(this.props.match.params.index);
  componentDidMount = () => this.fetch();
  componentDidUpdate = ({ match: { params: { index } } }) => ((index !== this.props.match.params.index) && this.fetch());
  render = () => (
    <React.Fragment>
      <Nav nav={this.props.nav} />
      <AnimalList {...this.props.animals} />
    </React.Fragment>
  );
};

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
        <Route path="/context/*" render={() => (
          <Switch>
            <Route path="/context/animals/:index" component={ContextAnimalListController} />
            <Route path="/context/animals" render={() => <Redirect to="/context/animals/all" />} />
            <Route path="/context" render={() => <Redirect to="/context/animals" />} />
          </Switch>
        )} />
        <Route path="/redux/*" render={() => (
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
