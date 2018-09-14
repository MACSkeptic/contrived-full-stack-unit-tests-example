import _ from 'lodash';
import React from 'react';
import { NavLink } from 'react-router-dom';
export const Nav = ({ nav }) => (
  <React.Fragment>
    <nav>{_.map(['all', 'real', 'magical'], target => (<NavLink to={`/${nav}/animals/${target}`} key={target}>{target}</NavLink>))}</nav>
  </React.Fragment>
);
export default Nav;
