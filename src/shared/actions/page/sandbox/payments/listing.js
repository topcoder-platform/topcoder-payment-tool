/**
 * Actions related to the UI state of member payments listing page.
 */

import { createActions } from 'redux-actions';

/**
 * Payload creator for the action that selects the specified project.
 * @param {Number} projectId
 * @return {String} Action payload.
 */
function selectProject(projectId) {
  return projectId;
}

function toggleProjects(toggle) {
  return toggle;
}

export default createActions({
  PAGE: {
    SANDBOX: {
      PAYMENTS: {
        LISTING: {
          SELECT_PROJECT: selectProject,
          TOGGLE_PROJECTS: toggleProjects,
        },
      },
    },
  },
});
