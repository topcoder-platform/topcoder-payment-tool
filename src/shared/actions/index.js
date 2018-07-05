/**
 * Root assembly of all actions in the app.
 */
import { actions } from 'topcoder-react-lib';
import pageActions from './page';

export default {
  ...pageActions,
  challenge: actions.challenge,
  memberTasks: actions.memberTasks,
  direct: actions.direct,
};
