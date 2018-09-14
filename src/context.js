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
    this.state = { fetch: this.fetch };
  }
  fetch = (name, fn, index) => {
    const update = (extras) => ({
      [name]: indexedReducerFor(name)(this.state[name] || {}, _.merge({
        type: name, status: null, index, data: undefined, error: undefined
      }, extras))
    });
    this.setState(update({ status: 'started' }));
    return fn(index).then(
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

export default context;
