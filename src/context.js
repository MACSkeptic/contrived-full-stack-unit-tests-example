import { indexedReducerFor } from './redux/reducers.js';
import _ from 'lodash';
import React from 'react';
export const context = React.createContext({});

export class Provider extends React.Component {
  mounted = true;
  constructor(props) {
    super(props);
    const setState = this.setState.bind(this);
    this.setState = (...args) => this.mounted && setState(...args);
    this.state = { action: this.action, state: this.state, get: this.get };
  }
  state = (name) => _.get(this.state, [name], {});
  get = (name) => (index) => _.get(this.state, [name, index], null);
  action = (name) => (fn) => (index) => {
    const dispatch = (...args) => _.tap({
      [name]: indexedReducerFor(name)(this.state[name] || {}, _.merge({
        type: name, status: null, index, data: undefined, error: undefined
      }, ...args))
    }, this.setState);
    dispatch({ status: 'started' });
    return fn(index).then(
      (data) => dispatch({ status: 'success', data }),
      (error) => dispatch({ status: 'failure', error })
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

export const connect = (name) => (mapStateToProps, boundActions) => (Component) => (props) => (
  <context.Consumer>
    {(({ state, action }) => (
      <Component
        {...props}
        {...mapStateToProps(state(name), props)}
        {..._.reduce(boundActions, (actions, actionFn, actionName) => ({ ...actions, [actionName]: action(name)(actionFn) }), {})}
      />
    ))}
  </context.Consumer>
);

export default context;
