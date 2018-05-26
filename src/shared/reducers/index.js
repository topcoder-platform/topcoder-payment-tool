/**
 * This module holds the root factory for Redux reducer. The factory accepts
 * ExpressJS HTTP request object as its only optional argument, and it always
 * returns a promise that resolves to a new reducer.
 *
 * When the argument is provided, the factory assumes server-side rendering,
 * and it can use data available in the HTTP request to generate initial store
 * state fitted to the request.
 *
 * When no argument is provided, the factory assumes client-side rendering,
 * and creates the default state (in case of server-side rendering, that default
 * state will be overriden at client side by the one injected from the server).
 *
 * To better understand reducers read:
 * http://redux.js.org/docs/basics/Reducers.html.
 */

import _ from 'lodash';
import { redux } from 'topcoder-react-utils';
import { reducerFactory } from 'topcoder-react-lib';
import { factory as pageFactory } from './page';
import { factory as challengeListingFactory } from './challenge-listing';

export async function factory(req) {
  const resolvedReducers = await redux.resolveReducers({
    standard: reducerFactory(req),
    challengeListing: challengeListingFactory(req),
    page: pageFactory(req),
  });

  return redux.combineReducers((state) => {
    const res = { ...state };
    if (req) {
      res.domain = `${req.protocol}://${req.headers.host || req.hostname}`;
    }
    return res;
  }, {
    ..._.omit(resolvedReducers, 'standard'),
    ...resolvedReducers.standard,
  });
}

export default undefined;
