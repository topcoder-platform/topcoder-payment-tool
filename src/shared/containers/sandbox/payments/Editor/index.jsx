/**
 * Payment editor.
 */
/* NOTE: Many props in this module are consumed indirectly via helper functions,
 * ESLint is not able to track them, hence the rule is disabled for now. */
/* eslint-disable react/no-unused-prop-types */

import _ from 'lodash';
import actions from 'actions';
import Background from 'components/sandbox/payments/Background';
import Confirmation from 'components/sandbox/payments/Confirmation';
import Editor from 'components/sandbox/payments/Editor';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import shortid from 'shortid';
import Markdown from 'markdown-it';
import { STATE as PAGE_STATE } from 'actions/page/sandbox/payments/editor';
import { connect } from 'react-redux';
import { goToLogin } from 'utils/tc';
import { AUTOCOMPLETE_TRIGGER_LENGTH } from 'components/MemberSearchInput';
import { logger, errors, services } from 'topcoder-react-lib';
import { config } from 'topcoder-react-utils';

import './style.scss';

const { fireErrorMessage } = errors;
const getChallengeService = services.challenge.getService;
const getResourcesService = services.resource.getService;
const { CHALLENGE_REFRESH_INTERVAL } = config;
const md = new Markdown();

/**
 * If given props have loaded project details with some billing accounts, this
 * function ensures that at least some (first) billing account is selected.
 * @param {Object} props
 */
function selectFirstBillingAccountIfNecessary({
  projectDetails,
  selectBillingAccount,
  selectedBillingAccountId,
}) {
  const accounts = (projectDetails && projectDetails.billingAccountIds) || [];
  if (
    accounts.length
    && (
      !selectedBillingAccountId
      || !accounts.some(id => id === selectedBillingAccountId)
    )
  ) selectBillingAccount(accounts[0]);
}

/**
 * Handles the loading of project details, if necessary for the specified set
 * of props.
 * @param {Object} props
 */
function handleProjectDetailsLoading(props) {
  const {
    loadingProjectDetailsForId,
    loadProjectDetails,
    projectDetails,
    selectedProjectId,
    tokenV3,
  } = props;
  if (!projectDetails && selectedProjectId
  && selectedProjectId !== loadingProjectDetailsForId) {
    loadProjectDetails(selectedProjectId, tokenV3);
  }
}

class EditorContainer extends React.Component {
  async componentDidMount() {
    const {
      authenticating,
      challenge,
      getChallenge,
      loadingProjectsForUsername,
      loadProjects,
      paymentId,
      projects,
      selectedProjectId,
      selectProject,
      tokenV2,
      tokenV3,
      username,
      getTechnologyTags,
    } = this.props;
    if (!authenticating && !tokenV3) return goToLogin('payments-tool');
    if (username && username !== loadingProjectsForUsername) {
      loadProjects(tokenV3);
    }
    if (!selectedProjectId && projects.length) {
      selectProject(projects[0].id);
    }
    if (paymentId === 'new') {
      getTechnologyTags(tokenV3);
    }
    handleProjectDetailsLoading(this.props);
    selectFirstBillingAccountIfNecessary(this.props);
    if (!challenge && paymentId !== 'new') {
      getChallenge(paymentId, tokenV3, tokenV2);
    }
    return undefined;
  }

  async componentWillReceiveProps(nextProps) {
    const {
      authenticating,
      challenge,
      loadingProjectsForUsername,
      loadProjects,
      paymentAmount,
      paymentDescription,
      submissionGuidelines,
      paymentTitle,
      projects,
      selectedProjectId,
      selectProject,
      setPageState,
      setPaymentAmount,
      setCopilotPaymentAmount,
      copilotPaymentAmount,
      setMemberInputKeyword,
      setCopilotInputKeyword,
      setPaymentDescription,
      setPaymentTitle,
      setSubmissionGuidelines,
      tokenV3,
      username,
      loadMemberTasks,
      memberTasks,
    } = nextProps;
    if (!authenticating && !tokenV3) return goToLogin('payments-tool');
    const {
      projects: oldProjects,
      username: oldUsername,
    } = this.props;
    if (username && username !== oldUsername
    && username !== loadingProjectsForUsername) {
      loadProjects(tokenV3);
    }
    const selectedProjectIdNum = Number(selectedProjectId);
    if (projects.length
    && (
      !selectedProjectId
      || (
        projects !== oldProjects
        && !projects.some(p => p.id === selectedProjectIdNum)
      )
    )) {
      selectProject(projects[0].id);
    }
    handleProjectDetailsLoading(nextProps);
    selectFirstBillingAccountIfNecessary(nextProps);
    if (challenge) {
      setPageState(PAGE_STATE.NEW_PAYMENT);
      if (selectedProjectId !== challenge.projectId) {
        selectProject(challenge.projectId);
        if (memberTasks.length === 0) {
          loadMemberTasks(challenge.projectId, 0, tokenV3);
        }
      }
      const taskPrize = challenge.prizes.filter(prize => prize.type === 'placement')[0];
      if (!_.isEmpty(taskPrize)) {
        const taskPaymentAmount = _.sum(_.map(taskPrize.prizes, prize => prize.value));
        if (paymentAmount !== taskPaymentAmount) {
          setPaymentAmount(taskPaymentAmount || 0);
        }
      }
      if (paymentTitle !== challenge.name) {
        setPaymentTitle(challenge.name);
        const resourcesService = getResourcesService(tokenV3);
        const resources = await resourcesService.getResourceRoles();
        let submitter;
        // eslint-disable-next-line
        let _copilot;
        // eslint-disable-next-line
        resources.map((role) => {
          if (role.name === 'Copilot') {
            _copilot = role;
          }
          if (role.name === 'Submitter') {
            submitter = role;
          }
        });
        const challengeResources = await resourcesService.getChallengeResourceRoles({
          challengeId: challenge.id,
        });
        const assignee = challengeResources.filter(
          resource => resource.roleId === submitter.id,
        );
        const challengeCopilot = challengeResources.filter(
          resource => resource.roleId === _copilot.id,
        );
        if (!_.isEmpty(assignee)) {
          setMemberInputKeyword(assignee[0].memberHandle);
        } else {
          setMemberInputKeyword('N/A');
        }
        if (!_.isEmpty(challengeCopilot)) {
          setCopilotInputKeyword(challengeCopilot[0].memberHandle);
        } else {
          setCopilotInputKeyword('N/A');
        }
      }
      if (paymentDescription !== challenge.detailedRequirements) {
        setPaymentDescription(challenge.detailedRequirements);
      }
      if (submissionGuidelines !== challenge.finalSubmissionGuidelines) {
        setSubmissionGuidelines(challenge.finalSubmissionGuidelines);
      }
      const copilotPrize = challenge.prizes.filter(prize => prize.type === 'copilot')[0];
      if (!_.isEmpty(copilotPrize)) {
        const copilotAmount = _.sum(_.map(copilotPrize.prizes, prize => prize.value));
        if (copilotAmount !== copilotPaymentAmount) {
          setCopilotPaymentAmount(copilotAmount);
        }
      }
    }
    return undefined;
  }

  /**
   * Handles the payment.
   */
  async pay() {
    const {
      copilotPaymentAmount,
      paymentAmount,
      paymentTitle,
      setPageState,
      selectedProjectId,
      tokenV3,
      challengeTechnologyTags,
    } = this.props;
    try {
      let {
        paymentDescription,
        paymentAssignee,
      } = this.props;

      const { copilot } = this.props;

      paymentDescription = md.render(paymentDescription);
      const technologies = challengeTechnologyTags.map(t => (
        { name: t.name, id: parseInt(t.id, 10) }
      ));
      setPageState(PAGE_STATE.WAITING_PAYMENT_DRAFT);
      const challengeService = getChallengeService(tokenV3);
      const resourcesService = getResourcesService(tokenV3);
      if (!paymentAssignee) paymentAssignee = copilot;

      const challengeTypes = await challengeService.getChallengeTypes({
        name: 'Task',
      });

      const challengeTracks = await challengeService.getChallengeTracks({
        name: 'Development',
      });

      const challengeTimelines = await challengeService.getChallengeTimeLines({
        trackId: challengeTracks[0].id,
        typeId: challengeTypes[0].id,
      });

      const challenge = await challengeService.createTask(
        selectedProjectId,
        paymentTitle,
        paymentDescription,
        'markdown',
        paymentAmount,
        copilotPaymentAmount,
        technologies,
        challengeTypes[0].id,
        challengeTracks[0].id,
        challengeTimelines[0].timelineTemplateId,
      );
      setPageState(PAGE_STATE.WAITING_PAYMENT_ACTIVATION);
      const resourceRoles = await resourcesService.getResourceRoles();
      let submitter;
      // eslint-disable-next-line
      let _copilot;
      // Find the Submitter and Copilot resource role to get the roleId
      // eslint-disable-next-line
      resourceRoles.map((role) => {
        if (role.name === 'Copilot') {
          _copilot = role;
        }
        if (role.name === 'Submitter') {
          submitter = role;
        }
      });

      // Call the V5 Resources API to create the submitter resource
      await resourcesService.createChallengeResource({
        challengeId: challenge.id,
        memberHandle: paymentAssignee,
        roleId: submitter.id,
      });

      // Call the V5 Resources API to create the Copilot resource
      await resourcesService.createChallengeResource({
        challengeId: challenge.id,
        memberHandle: copilot,
        roleId: _copilot.id,
      });

      // Keep Refreshing the Data every 5 seconds
      const timer = setInterval(async () => {
        const challengeData = await challengeService.getChallengeDetails(challenge.id);
        if (challengeData.legacy && challengeData.legacy.directProjectId) {
          clearInterval(timer);
          try {
            // Activate the challenge by changing ths status
            await challengeService.updateChallenge(challenge.id, {
              status: 'Active',
            });

            setPageState(PAGE_STATE.WAITING_PAYMENT_CLOSURE);

            // Mark the challenge as completed by changing ths status
            await challengeService.updateChallenge(challenge.id, {
              status: 'Completed',
            });

            setPageState(PAGE_STATE.PAID);
          } catch (error) {
            setPageState(PAGE_STATE.NEW_PAYMENT);
            logger.error(error);
            fireErrorMessage(
              'Failed to proceed the payment',
              'Try to find it in Direct/OR to finalize it manually',
            );
          }
        }
      }, CHALLENGE_REFRESH_INTERVAL);
    } catch (error) {
      setPageState(PAGE_STATE.NEW_PAYMENT);
      logger.error(error);
      fireErrorMessage(
        'Failed to proceed the payment',
        'Try to find it in Direct/OR to finalize it manually',
      );
    }
  }

  resetPaymentData() {
    const {
      setMemberInputKeyword,
      setMemberInputPopupVisible,
      setPageState,
      setPaymentAmount,
      setCopilotPaymentAmount,
      setCopilotInputKeyword,
      setCopilotInputPopupVisible,
      setPaymentAssignee,
      setPaymentDescription,
      setSubmissionGuidelines,
      setCopilot,
      setPaymentTitle,
    } = this.props;
    setPageState(PAGE_STATE.NEW_PAYMENT);
    setPaymentAmount(0);
    setCopilotPaymentAmount(0);
    setPaymentAssignee('');
    setCopilot('');
    setCopilotInputKeyword('');
    setCopilotInputPopupVisible(false);
    setPaymentDescription('');
    setSubmissionGuidelines('');
    setPaymentTitle('');
    setMemberInputKeyword('');
    setMemberInputPopupVisible(false);
  }

  render() {
    const {
      challenge,
      memberSuggestions,
      getMemberSuggestions,
      memberInputPopupVisible,
      setMemberInputPopupVisible,
      memberInputKeyword,
      setMemberInputKeyword,
      memberInputSelected,
      setMemberInputSelected,
      copilotSuggestions,
      getCopilotSuggestions,
      copilotInputPopupVisible,
      setCopilotInputPopupVisible,
      copilotInputKeyword,
      setCopilotInputKeyword,
      copilotInputSelected,
      setCopilotInputSelected,
      pageState,
      paymentAmount,
      copilotPaymentAmount,
      paymentAssignee,
      copilot,
      paymentId,
      paymentDescription,
      submissionGuidelines,
      paymentTitle,
      projectDetails,
      projects,
      selectedBillingAccountId,
      selectedProjectId,
      selectProject,
      setPaymentAmount,
      setCopilotPaymentAmount,
      setPaymentAssignee,
      setCopilot,
      setPaymentDescription,
      setSubmissionGuidelines,
      setPaymentTitle,
      tokenV3,
      technologyTags,
      addTechnologyTag,
      removeTechnologyTag,
      challengeTechnologyTags,
      memberTasks,
    } = this.props;
    /* TODO: This render function becomes too complex for a container,
     * most of this should be moved to the Editor component itself. */
    if (!tokenV3 || !projects.length
    || pageState === PAGE_STATE.WAITING_PAYMENT_ACTIVATION
    || pageState === PAGE_STATE.WAITING_PAYMENT_CLOSURE
    || pageState === PAGE_STATE.WAITING_PAYMENT_DRAFT) {
      let msg;
      switch (pageState) {
        case PAGE_STATE.WAITING_PAYMENT_ACTIVATION:
          msg = 'Activating the payment...';
          break;
        case PAGE_STATE.WAITING_PAYMENT_CLOSURE:
          msg = 'Closing (finalizing) the payment...';
          break;
        case PAGE_STATE.WAITING_PAYMENT_DRAFT:
          msg = 'Drafting the payment...';
          break;
        default:
          msg = 'Loading data...';
      }
      return (
        <Background>
          <div styleName="statusMsg">
            {msg}
          </div>
          <LoadingIndicator />
        </Background>
      );
    }
    if (pageState === PAGE_STATE.PAID) {
      const competitior = paymentAssignee !== '' ? paymentAssignee : copilot;
      return (
        <Confirmation
          amount={paymentAmount}
          assignee={competitior}
          copilot={copilot}
          copilotFee={copilotPaymentAmount}
          paymentTitle={paymentTitle}
          resetPaymentData={() => this.resetPaymentData()}
        />
      );
    }

    return (
      <Editor
        challenge={challenge}
        makePayment={() => this.pay()}
        memberSuggestions={memberSuggestions}
        getMemberSuggestions={keyword => getMemberSuggestions(keyword, tokenV3)}
        memberInputPopupVisible={memberInputPopupVisible}
        setMemberInputPopupVisible={setMemberInputPopupVisible}
        memberInputKeyword={memberInputKeyword}
        setMemberInputKeyword={setMemberInputKeyword}
        memberInputSelected={memberInputSelected}
        setMemberInputSelected={setMemberInputSelected}
        copilotSuggestions={copilotSuggestions}
        getCopilotSuggestions={keyword => getCopilotSuggestions(keyword, tokenV3)}
        copilotInputPopupVisible={copilotInputPopupVisible}
        setCopilotInputPopupVisible={setCopilotInputPopupVisible}
        copilotInputKeyword={copilotInputKeyword}
        setCopilotInputKeyword={setCopilotInputKeyword}
        copilotInputSelected={copilotInputSelected}
        setCopilotInputSelected={setCopilotInputSelected}
        neu={paymentId === 'new'}
        paymentAmount={paymentAmount}
        copilotPaymentAmount={copilotPaymentAmount}
        paymentAssignee={paymentAssignee}
        copilot={copilot}
        paymentDescription={paymentDescription}
        submissionGuidelines={submissionGuidelines}
        paymentTitle={paymentTitle}
        projectDetails={projectDetails}
        projects={projects}
        selectedBillingAccountId={selectedBillingAccountId}
        selectedProjectId={selectedProjectId}
        selectProject={selectProject}
        setPaymentAmount={setPaymentAmount}
        setCopilotPaymentAmount={setCopilotPaymentAmount}
        setPaymentAssignee={setPaymentAssignee}
        setCopilot={setCopilot}
        setPaymentDescription={setPaymentDescription}
        setSubmissionGuidelines={setSubmissionGuidelines}
        setPaymentTitle={setPaymentTitle}
        technologyTags={technologyTags}
        addTechnologyTag={addTechnologyTag}
        removeTechnologyTag={removeTechnologyTag}
        challengeTechnologyTags={challengeTechnologyTags}
        memberTasks={memberTasks}
      />
    );
  }
}

EditorContainer.defaultProps = {
  challenge: null,
  projectDetails: null,
  submissionGuidelines: '',
};

EditorContainer.propTypes = {
  authenticating: PT.bool.isRequired,
  challenge: PT.shape(),
  getChallenge: PT.func.isRequired,
  loadingProjectDetailsForId: PT.number.isRequired,
  loadingProjectsForUsername: PT.string.isRequired,
  loadProjectDetails: PT.func.isRequired,
  loadProjects: PT.func.isRequired,
  memberSuggestions: PT.arrayOf(PT.shape()).isRequired,
  getMemberSuggestions: PT.func.isRequired,
  memberInputPopupVisible: PT.bool.isRequired,
  setMemberInputPopupVisible: PT.func.isRequired,
  memberInputKeyword: PT.string.isRequired,
  setMemberInputKeyword: PT.func.isRequired,
  memberInputSelected: PT.shape().isRequired,
  setMemberInputSelected: PT.func.isRequired,
  copilotSuggestions: PT.arrayOf(PT.shape()).isRequired,
  getCopilotSuggestions: PT.func.isRequired,
  copilotInputPopupVisible: PT.bool.isRequired,
  setCopilotInputPopupVisible: PT.func.isRequired,
  copilotInputKeyword: PT.string.isRequired,
  setCopilotInputKeyword: PT.func.isRequired,
  copilotInputSelected: PT.shape().isRequired,
  setCopilotInputSelected: PT.func.isRequired,
  pageState: PT.oneOf(_.values(PAGE_STATE)).isRequired,
  paymentAmount: PT.number.isRequired,
  copilotPaymentAmount: PT.oneOfType([
    PT.string,
    PT.number,
  ]).isRequired,
  paymentAssignee: PT.string.isRequired,
  copilot: PT.string.isRequired,
  paymentId: PT.string.isRequired,
  paymentDescription: PT.string.isRequired,
  submissionGuidelines: PT.string,
  paymentTitle: PT.string.isRequired,
  projectDetails: PT.shape({
    billingAccountIds: PT.arrayOf(PT.number),
  }),
  projects: PT.arrayOf(PT.object).isRequired,
  selectedBillingAccountId: PT.number.isRequired,
  selectedProjectId: PT.number.isRequired,
  selectBillingAccount: PT.func.isRequired,
  selectProject: PT.func.isRequired,
  setPageState: PT.func.isRequired,
  setPaymentAmount: PT.func.isRequired,
  setPaymentAssignee: PT.func.isRequired,
  setCopilot: PT.func.isRequired,
  setPaymentDescription: PT.func.isRequired,
  setSubmissionGuidelines: PT.func.isRequired,
  setPaymentTitle: PT.func.isRequired,
  tokenV2: PT.string.isRequired,
  tokenV3: PT.string.isRequired,
  username: PT.string.isRequired,
  getTechnologyTags: PT.func.isRequired,
  setCopilotPaymentAmount: PT.func.isRequired,
  technologyTags: PT.arrayOf(PT.shape()).isRequired,
  addTechnologyTag: PT.func.isRequired,
  removeTechnologyTag: PT.func.isRequired,
  challengeTechnologyTags: PT.arrayOf(PT.shape()).isRequired,
  loadMemberTasks: PT.func.isRequired,
  memberTasks: PT.arrayOf(PT.object).isRequired,
};

function mapStateToProps(state, ownProps) {
  const { auth, direct, memberTasks } = state;
  const page = state.page.sandbox.payments.editor;

  let challenge;
  const { paymentId } = ownProps;
  if (`${paymentId}` === _.get(state, 'challenge.details.id')) {
    challenge = state.challenge.details;
  }

  let { projectDetails } = direct;
  if (_.get(projectDetails, 'id') !== page.selectedProjectId) {
    projectDetails = null;
  }

  return {
    authenticating: auth.authenticating,
    challenge,
    loadingProjectDetailsForId: direct.loadingProjectDetailsForId,
    loadingProjectsForUsername: direct.loadingProjectsForUsername,
    memberSuggestions: page.memberSuggestions,
    memberInputPopupVisible: page.memberInputPopupVisible,
    memberInputKeyword: page.memberInputKeyword,
    memberInputSelected: page.memberInputSelected,
    copilotSuggestions: page.copilotSuggestions,
    copilotInputPopupVisible: page.copilotInputPopupVisible,
    copilotInputKeyword: page.copilotInputKeyword,
    copilotInputSelected: page.copilotInputSelected,
    pageState: page.pageState,
    paymentAmount: page.paymentAmount,
    paymentAssignee: page.paymentAssignee,
    copilotPaymentAmount: page.copilotPaymentAmount,
    copilot: page.copilot,
    paymentId,
    paymentDescription: page.paymentDescription,
    submissionGuidelines: page.submissionGuidelines,
    paymentTitle: page.paymentTitle,
    projectDetails,
    projects: direct.projects,
    selectedBillingAccountId: page.selectedBillingAccountId,
    selectedProjectId: page.selectedProjectId,
    tokenV2: auth.tokenV2,
    tokenV3: auth.tokenV3,
    username: _.get(auth, 'user.handle', ''),
    technologyTags: page.technologyTags,
    challengeTechnologyTags: page.challengeTechnologyTags,
    memberTasks: memberTasks.tasks,
  };
}

function mapDispatchToProps(dispatch) {
  const { challenge, direct, memberTasks } = actions;
  const page = actions.page.sandbox.payments.editor;
  return {
    loadMemberTasks: (projectId, pageNum, tokenV3) => {
      const uuid = shortid();
      dispatch(memberTasks.getInit(uuid, pageNum));
      dispatch(memberTasks.getDone(uuid, projectId, pageNum, tokenV3));
    },
    getChallenge: (id, tokenV3, tokenV2) => {
      dispatch(challenge.getDetailsInit(id));
      dispatch(challenge.getDetailsDone(id, tokenV3, tokenV2));
    },
    loadProjectDetails: (projectId, tokenV3) => {
      dispatch(direct.getProjectDetailsInit(projectId));
      dispatch(direct.getProjectDetailsDone(projectId, tokenV3));
    },
    loadProjects: (tokenV3) => {
      dispatch(direct.getUserProjectsInit(tokenV3));
      dispatch(direct.getUserProjectsDone(tokenV3));
    },
    getMemberSuggestions: (keyword, tokenV3) => {
      if (keyword.length >= AUTOCOMPLETE_TRIGGER_LENGTH) {
        dispatch(page.getMemberSuggestionsInit(keyword));
        dispatch(page.getMemberSuggestionsDone(keyword, tokenV3));
      }
    },
    getTechnologyTags: (tokenV3) => {
      dispatch(page.getTechnologyTags(tokenV3));
    },
    setMemberInputPopupVisible: visible => dispatch(page.setMemberInputPopupVisible(visible)),
    setMemberInputKeyword: keyword => dispatch(page.setMemberInputKeyword(keyword)),
    setMemberInputSelected: member => dispatch(page.setMemberInputSelected(member)),
    getCopilotSuggestions: (keyword, tokenV3) => {
      if (keyword.length >= AUTOCOMPLETE_TRIGGER_LENGTH) {
        dispatch(page.getCopilotSuggestionsInit(keyword));
        dispatch(page.getCopilotSuggestionsDone(keyword, tokenV3));
      }
    },
    setCopilotInputPopupVisible: visible => dispatch(page.setCopilotInputPopupVisible(visible)),
    setCopilotInputKeyword: keyword => dispatch(page.setCopilotInputKeyword(keyword)),
    setCopilotInputSelected: member => dispatch(page.setCopilotInputSelected(member)),
    selectBillingAccount: accountId => dispatch(page.selectBillingAccount(accountId)),
    selectProject: projectId => dispatch(page.selectProject(projectId)),
    setPageState: state => dispatch(page.setPageState(state)),
    setPaymentAmount: arg => dispatch(page.setPaymentAmount(arg)),
    setPaymentAssignee: arg => dispatch(page.setPaymentAssignee(arg)),
    setCopilotPaymentAmount: arg => dispatch(page.setCopilotPaymentAmount(arg)),
    setCopilot: arg => dispatch(page.setCopilot(arg)),
    setPaymentDescription: arg => dispatch(page.setPaymentDescription(arg)),
    setSubmissionGuidelines: arg => dispatch(page.setSubmissionGuidelines(arg)),
    setPaymentTitle: title => dispatch(page.setPaymentTitle(title)),
    addTechnologyTag: tag => dispatch(page.addTechnologyTag(tag)),
    removeTechnologyTag: i => dispatch(page.removeTechnologyTag(i)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorContainer);
