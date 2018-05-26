/**
 * Root router of the app.
 */

import Error404Page from 'components/Error404Page';
import React from 'react';

import { Route, Switch } from 'react-router-dom';

import Sandbox from './Sandbox';

export default function Routes() {
  return (
    <Switch>
      <Route component={() => <Sandbox base="" />} path="/" />
      <Error404Page />
    </Switch>
  );
}
