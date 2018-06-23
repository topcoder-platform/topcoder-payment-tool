/**
 * Server initialization.
 */

import Application from 'shared';
import fs from 'fs';
import moment from 'moment';
import path from 'path';
import { factory as reducerFactory } from 'reducers';
import { redux, server as serverFactory } from 'topcoder-react-utils';

import webpackConfigFactory from '../../webpack.config';

const mode = process.env.BABEL_ENV;

let ts;
try {
  ts = path.resolve(__dirname, '../../.build-info');
  ts = JSON.parse(fs.readFileSync(ts));
  ts = moment(ts.timestamp).valueOf();
} catch (e) {
  ts = 0;
}

const EXTRA_SCRIPTS = [
  `<script
      src="/loading-indicator-animation-${ts}.js"
      type="application/javascript"
  ></script>`,
];

async function beforeRender(req) {
  const store = await redux.storeFactory({
    getReducerFactory: () => reducerFactory,
    httpRequest: req,
  });
  return { extraScripts: EXTRA_SCRIPTS, store };
}

global.KEEP_BUILD_INFO = true;
serverFactory(webpackConfigFactory(mode), {
  Application,
  beforeRender,
  devMode: mode === 'development',
});
