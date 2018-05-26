/**
 * Server initialization.
 */

import Application from 'shared';
import { factory as reducerFactory } from 'reducers';
import { redux, server as serverFactory } from 'topcoder-react-utils';

import webpackConfigFactory from '../../webpack.config';

const mode = process.env.BABEL_ENV;

async function beforeRender(req) {
  const store = await redux.storeFactory({
    getReducerFactory: () => reducerFactory,
    httpRequest: req,
  });
  return { store };
}

global.KEEP_BUILD_INFO = true;
serverFactory(webpackConfigFactory(mode), {
  Application,
  beforeRender,
  devMode: mode === 'development',
});
