/**
 * Root assembly of all actions in the app.
 */
import { actions } from 'topcoder-react-lib';
import pageActions from './page';

export default {
  ...pageActions,
  memberTasks: actions.memberTasks,
  direct: actions.direct,
};
