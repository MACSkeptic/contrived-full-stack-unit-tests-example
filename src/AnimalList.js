import { Nav } from './Nav.js';
import React from 'react';
import _ from 'lodash';
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
export default AnimalListController;
