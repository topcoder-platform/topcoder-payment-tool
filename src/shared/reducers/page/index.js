/**
 * Redux Reducer for state.page
 *
 * Description:
 *  Implements reducer factory for the state.page segment of Redux state; and
 *  combines it with the child state.page.x reducer factories.
 */

import { combineReducers } from 'redux';
import { redux } from 'topcoder-react-utils';
import sandbox from './sandbox';

/**
 * Reducer factory.
 * @param {Object} req ExpressJS HTTP Request.
 * @return {Function} Reducer.
 */
export function factory() {
  return redux.resolveReducers({
  }).then(reducers => combineReducers({
    ...reducers,
    sandbox,
  }));
}

export default combineReducers({
  sandbox,
});
