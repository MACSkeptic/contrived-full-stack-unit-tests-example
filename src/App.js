import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, Switch, NavLink } from 'react-router-dom';
import { httpGetAnimals } from './animals/fetch.js';
import { indexedReducerFor } from './redux/reducers.js';

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

export const ConnectedAnimalListController = connect((state, ownProps) => {
  return { animals: state.animals[ownProps.match.params.index] || {}, Menu: ReduxMenu };
}, { fetch: fetchAnimalsRedux })(AnimalListController);

const context = React.createContext({});

export class AnimalsProvider extends React.Component {
  mounted = true;
  constructor(props) {
    super(props);
    const setState = this.setState.bind(this);
    this.setState = (...args) => this.mounted && setState(...args);
    this.state = {
      fetch: this.fetch,
      animals: {}
    };
  }
  fetch = (index) => {
    const update = (extras) => ({
      animals: indexedReducerFor('animals')(this.state.animals, _.merge({
        type: 'animals', status: null, index, data: undefined, error: undefined
      }, extras))
    });
    this.setState(update({ status: 'started' }));
    return httpGetAnimals(index).then(
      (data) => this.setState(update({ status: 'success', data })),
      (error) => this.setState(update({ status: 'failure', error }))
    );
  };
  componentDidMount = () => {
    this.mounted = true;
  };
  componentWillUnmount = () => {
    this.mounted = false;
  };
  render = () => (
    <context.Provider value={{...this.state}}>
      {this.props.children}
    </context.Provider>
  );
};

export const ContextAnimalListController = (props) => (
  <context.Consumer>
    {((contextProps) => (
      <AnimalListController
        match={props.match}
        animals={contextProps.animals[props.match.params.index] || {}}
        Menu={ContextMenu}
        fetch={contextProps.fetch}
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
          <AnimalsProvider>
            <Switch>
              <Route path="/context/animals/:index" component={ContextAnimalListController} />
              <Route path="/context/animals" render={() => <Redirect to="/context/animals/all" />} />
            </Switch>
          </AnimalsProvider>
        )} />
        <Route path="/redux/animals/:index" component={ConnectedAnimalListController} />
        <Route path="/redux/animals" render={() => <Redirect to="/redux/animals/all" />} />
      </Switch>
  </React.Fragment>
);

export default App;
