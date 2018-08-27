/**
 * Payment listing container.
 */

import _ from 'lodash';
import actions from 'actions';
import Listing from 'components/sandbox/payments/Listing';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import shortid from 'shortid';
import { connect } from 'react-redux';
import { goToLogin } from 'utils/tc';

function selectProjectAndLoadMemberTasks(projectId, props) {
  props.selectProject(projectId);
  props.loadMemberTasks(projectId, 0, props.tokenV3);
}

class ListingContainer extends React.Component {
  componentDidMount() {
    const {
      authenticating,
      loadingProjectsForUsername,
      loadProjects,
      tokenV3,
      username,
      hasActiveBillingAccount,
    } = this.props;
    if (!authenticating && !tokenV3) return goToLogin('payments-tool');
    if (username && username !== loadingProjectsForUsername) {
      loadProjects(tokenV3, hasActiveBillingAccount);
    }
    return undefined;
  }

  componentWillReceiveProps(nextProps) {
    const {
      authenticating,
      loadingProjectsForUsername,
      loadProjects,
      projects,
      selectedProjectId,
      tokenV3,
      username: nextUsername,
      hasActiveBillingAccount: nextHasActiveBillingAccount,
    } = nextProps;
    const {
      username,
      hasActiveBillingAccount,
    } = this.props;
    if (!authenticating && !tokenV3) return goToLogin('payments-tool');
    if (nextUsername !== username && nextUsername
    && nextUsername !== loadingProjectsForUsername) {
      loadProjects(tokenV3, nextHasActiveBillingAccount);
    }
    if (nextHasActiveBillingAccount !== hasActiveBillingAccount) {
      loadProjects(tokenV3, nextHasActiveBillingAccount);
    }
    if (!selectedProjectId && projects.length) {
      selectProjectAndLoadMemberTasks(projects[0].id, nextProps);
    }
    return undefined;
  }

  render() {
    const {
      loadingMemberTasks,
      loadingProjectsForUsername,
      memberTasks,
      projects,
      selectedProjectId,
      tokenV3,
      toggleProjects,
      hasActiveBillingAccount,
    } = this.props;

    if ((loadingProjectsForUsername && !projects.length) || !tokenV3) {
      return <LoadingIndicator />;
    }

    return (
      <Listing
        loadingMemberTasks={loadingMemberTasks}
        memberTasks={memberTasks}
        projects={projects}
        selectedProjectId={selectedProjectId}
        toggleProjects={toggleProjects}
        hasActiveBillingAccount={hasActiveBillingAccount}
        selectProject={projectId => selectProjectAndLoadMemberTasks(projectId, this.props)}
      />
    );
  }
}

ListingContainer.propTypes = {
  authenticating: PT.bool.isRequired,
  loadingMemberTasks: PT.bool.isRequired,
  hasActiveBillingAccount: PT.bool.isRequired,
  loadProjects: PT.func.isRequired,
  toggleProjects: PT.func.isRequired,
  loadingProjectsForUsername: PT.string.isRequired,
  memberTasks: PT.arrayOf(PT.object).isRequired,
  projects: PT.arrayOf(PT.object).isRequired,
  selectedProjectId: PT.number.isRequired,
  // selectProject: PT.func.isRequired,
  tokenV3: PT.string.isRequired,
  username: PT.string.isRequired,
};

/**
 * State-to-props mapper.
 * @param {Object} state Redux state.
 * @return {Object} Listing container props.
 */
function mapStateToProps(state) {
  const { auth, direct, memberTasks } = state;
  const page = state.page.sandbox.payments.listing;
  return {
    authenticating: auth.authenticating,
    loadingMemberTasks: Boolean(memberTasks.loadingUuid),
    loadingProjectsForUsername: direct.loadingProjectsForUsername,
    memberTasks: memberTasks.tasks,
    projects: direct.projects,
    selectedProjectId: page.selectedProjectId,
    hasActiveBillingAccount: page.hasActiveBillingAccount,
    tokenV3: auth.tokenV3,
    username: _.get(auth, 'user.handle', ''),
  };
}

/**
 * Dispatch/actions-to-props mapper.
 * @param {Function} dispatch
 * @return {Object} Listing container props.
 */
function mapDispatchToProps(dispatch) {
  const { direct, memberTasks } = actions;
  const { payments } = actions.page.sandbox;
  return {
    loadMemberTasks: (projectId, pageNum, tokenV3) => {
      const uuid = shortid();
      dispatch(memberTasks.getInit(uuid, pageNum));
      dispatch(memberTasks.getDone(uuid, projectId, pageNum, tokenV3));
    },
    toggleProjects: (toggle) => {
      dispatch(payments.listing.toggleProjects(toggle));
    },
    loadProjects: (tokenV3, hasBillAc) => {
      dispatch(direct.getUserProjectsInit(tokenV3));
      dispatch(direct.getUserProjectsDone(tokenV3, hasBillAc));
    },
    selectProject: (projectId) => {
      dispatch(payments.editor.selectProject(projectId));
      dispatch(payments.listing.selectProject(projectId));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListingContainer);
