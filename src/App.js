import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, Switch, NavLink } from 'react-router-dom';
import { httpGetAnimals } from './animals/fetch.js';
import { context } from './context.js';

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

export const ReduxMenu = () => (
  <React.Fragment>
    <nav>
      <NavLink to="/redux/animals/all">all</NavLink>
      <NavLink to="/redux/animals/real">real</NavLink>
      <NavLink to="/redux/animals/magical">magical</NavLink>
    </nav>
  </React.Fragment>
);
export const ContextMenu = () => (
  <React.Fragment>
    <nav>
      <NavLink to="/context/animals/all">all</NavLink>
      <NavLink to="/context/animals/real">real</NavLink>
      <NavLink to="/context/animals/magical">magical</NavLink>
    </nav>
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
      <this.props.Menu />
      <AnimalList {...this.props.animals} />
    </React.Fragment>
  );
};

export const ConnectedAnimalListController = connect((state, ownProps) => ({
  animals: state.animals[ownProps.match.params.index] || {}, Menu: ReduxMenu
}), { fetch: fetchAnimalsRedux })(AnimalListController);



export const ContextAnimalListController = (props) => (
  <context.Consumer>
    {((contextProps) => (
      <AnimalListController
        match={props.match}
        animals={_.get(contextProps, ['animals', props.match.params.index]) || {}}
        Menu={ContextMenu}
        fetch={_.partial(contextProps.fetch, 'animals', httpGetAnimals)}
      />
    ))}
  </context.Consumer>
);

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
            <Route path="/redux/animals/:index" component={ConnectedAnimalListController} />
            <Route path="/redux/animals" render={() => <Redirect to="/redux/animals/all" />} />
            <Route path="/redux" render={() => <Redirect to="/redux/animals" />} />
          </Switch>
        )} />
        <Route path="/" render={() => <Redirect to="/redux" />} />
      </Switch>
  </React.Fragment>
);

export default App;
