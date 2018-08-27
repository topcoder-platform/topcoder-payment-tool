/**
 * UI state reducer for the payment editor page.
 */

import _ from 'lodash';
import actions, { STATE } from 'actions/page/sandbox/payments/editor';
import { handleActions } from 'redux-actions';

/**
 * Initialize API request for member suggestions
 * @param {Object} state
 * @param {Array} action.payload Partial name
 * @return {Object} New state.
 */
function onGetMemberSuggestionsInit(state, { payload }) {
  return { ...state, getMemberSuggestionsForKeyword: payload };
}

/**
 * Finish API request for member suggestions
 * @param {Object} state
 * @param {Array} action.payload Array of potential member matches
 * @return {Object} New state.
 */
function onGetMemberSuggestionsDone(state, { payload }) {
  return { ...state, memberSuggestions: payload, getMemberSuggestionsForKeyword: '' };
}

/**
 * Sets visibility of member input search popup
 * @param {Object} state
 * @param {Boolean} action.payload If the popup is visible
 * @return {Object} New state.
 */
function onSetMemberInputPopupVisible(state, { payload }) {
  return { ...state, memberInputPopupVisible: payload };
}

/**
 * Sets the keyword/partial name that user has typed for Member
 * @param {Object} state
 * @param {String} action.payload Keyword/partial member name that user is typing
 * @return {Object} New state.
 */
function onSetMemberInputKeyword(state, { payload }) {
  return { ...state, memberInputKeyword: payload };
}

/**
 * Finish API request for member suggestions
 * @param {Object} state
 * @param {Object} action.payload Member that the user has selected
 * @return {Object} New state.
 */
function onSetMemberInputSelected(state, { payload }) {
  return { ...state, memberInputSelected: payload, memberInputKeyword: payload.handle };
}

/**
 * Initialize API request for copilot suggestions
 * @param {Object} state
 * @param {Array} action.payload Partial name
 * @return {Object} New state.
 */
function onGetCopilotSuggestionsInit(state, { payload }) {
  return { ...state, getCopilotSuggestionsForKeyword: payload };
}

/**
 * Finish API request for copilot suggestions
 * @param {Object} state
 * @param {Array} action.payload Array of potential copilot matches
 * @return {Object} New state.
 */
function onGetCopilotSuggestionsDone(state, { payload }) {
  return { ...state, copilotSuggestions: payload, getCopilotSuggestionsForKeyword: '' };
}

/**
 * Sets visibility of copilot input search popup
 * @param {Object} state
 * @param {Boolean} action.payload If the popup is visible
 * @return {Object} New state.
 */
function onSetCopilotInputPopupVisible(state, { payload }) {
  return { ...state, copilotInputPopupVisible: payload };
}

/**
 * Sets the keyword/partial name that user has typed for Copilot
 * @param {Object} state
 * @param {String} action.payload Keyword/partial copilot name that user is typing
 * @return {Object} New state.
 */
function onSetCopilotInputKeyword(state, { payload }) {
  return { ...state, copilotInputKeyword: payload };
}

/**
 * Finish API request for copilot suggestions
 * @param {Object} state
 * @param {Object} action.payload Copilot that the user has selected
 * @return {Object} New state.
 */
function onSetCopilotInputSelected(state, { payload }) {
  return { ...state, copilotInputSelected: payload, copilotInputKeyword: payload.handle };
}

/**
 * Selects the specified billing account.
 * @param {Object} state
 * @param {Number} action.payload Billing account ID.
 * @return {Object} New state.
 */
function onSelectBillingAccount(state, { payload }) {
  return { ...state, selectedBillingAccountId: payload };
}

/**
 * Selects the specified project.
 * @param {Object} state
 * @param {Object} action
 * @return {Object} New state.
 */
function onSelectProject(state, { payload }) {
  return { ...state, selectedProjectId: payload };
}

/**
 * Sets page state.
 * @param {Object} state Old Redux state.
 * @param {String} action.payload Target page state.
 * @return {Object} New Redux state.
 */
function onSetPageState(state, { payload }) {
  return { ...state, pageState: payload };
}

/**
 * Sets payment amount.
 * @param {Object} state
 * @param {Number} action.payload Payment amount.
 * @return {Object} New state.
 */
function onSetPaymentAmount(state, { payload }) {
  return { ...state, paymentAmount: payload };
}

/**
 * Sets the payment assignee.
 * @param {Object} state
 * @param {String} action.payload Payment assignee.
 * @return {Object} New state.
 */
function onSetPaymentAssignee(state, { payload }) {
  return { ...state, paymentAssignee: payload };
}

/**
 * Sets copilot payment amount.
 * @param {Object} state
 * @param {Number} action.payload Copilot payment amount.
 * @return {Object} New state.
 */
function onSetCopilotPaymentAmount(state, { payload }) {
  return { ...state, copilotPaymentAmount: payload };
}

/**
 * Sets the copilot.
 * @param {Object} state
 * @param {String} action.payload copilot.
 * @return {Object} New state.
 */
function onSetCopilot(state, { payload }) {
  return { ...state, copilot: payload };
}

/**
 * Sets the payment description.
 * @param {Object} state
 * @param {String} action.payload
 * @return {Object} New state.
 */
function onSetPaymentDescription(state, { payload }) {
  return { ...state, paymentDescription: payload };
}

/**
 * Sets the payment title.
 * @param {Object} state
 * @param {String} action.payload
 * @return {Object} New state.
 */
function onSetPaymentTitle(state, { payload }) {
  return { ...state, paymentTitle: payload };
}

/**
 * Sets the submission guidelines.
 * @param {Object} state
 * @param {String} action.payload
 * @return {Object} New state.
 */
function onSetSubmissionGuidelines(state, { payload }) {
  return { ...state, submissionGuidelines: payload };
}

function onGetTechnologyTags(state, { payload }) {
  return { ...state, technologyTags: payload };
}

function onAddTechnologyTag(state, { payload }) {
  return { ...state, challengeTechnologyTags: [...state.challengeTechnologyTags, payload] };
}

function onRemoveTechnologyTag(state, { payload }) {
  return {
    ...state,
    challengeTechnologyTags:
    state.challengeTechnologyTags.filter((tag, index) => index !== payload),
  };
}

/**
 * Creates reducer with the specified initial state, or default state otherwise.
 * @param {Object} state Optional. Initial state. If not given, default state
 *  will be generated.
 * @return {Function} Reducer.
 */
function create(state = {}) {
  const a = actions.page.sandbox.payments.editor;
  return handleActions({
    [a.getMemberSuggestionsInit]: onGetMemberSuggestionsInit,
    [a.getMemberSuggestionsDone]: onGetMemberSuggestionsDone,
    [a.setMemberInputPopupVisible]: onSetMemberInputPopupVisible,
    [a.setMemberInputKeyword]: onSetMemberInputKeyword,
    [a.setMemberInputSelected]: onSetMemberInputSelected,
    [a.getCopilotSuggestionsInit]: onGetCopilotSuggestionsInit,
    [a.getCopilotSuggestionsDone]: onGetCopilotSuggestionsDone,
    [a.setCopilotInputPopupVisible]: onSetCopilotInputPopupVisible,
    [a.setCopilotInputKeyword]: onSetCopilotInputKeyword,
    [a.setCopilotInputSelected]: onSetCopilotInputSelected,
    [a.selectBillingAccount]: onSelectBillingAccount,
    [a.selectProject]: onSelectProject,
    [a.setPageState]: onSetPageState,
    [a.setPaymentAmount]: onSetPaymentAmount,
    [a.setPaymentAssignee]: onSetPaymentAssignee,
    [a.setCopilotPaymentAmount]: onSetCopilotPaymentAmount,
    [a.setCopilot]: onSetCopilot,
    [a.setPaymentDescription]: onSetPaymentDescription,
    [a.setPaymentTitle]: onSetPaymentTitle,
    [a.setSubmissionGuidelines]: onSetSubmissionGuidelines,
    [a.getTechnologyTags]: onGetTechnologyTags,
    [a.addTechnologyTag]: onAddTechnologyTag,
    [a.removeTechnologyTag]: onRemoveTechnologyTag,
  }, _.defaults(state, {
    getMemberSuggestionsForKeyword: '',
    memberSuggestions: [],
    memberInputPopupVisible: false,
    memberInputKeyword: '',
    memberInputSelected: {},
    getCopilotSuggestionsForKeyword: '',
    copilotSuggestions: [],
    copilotInputPopupVisible: false,
    copilotInputKeyword: '',
    copilotInputSelected: {},
    pageState: STATE.NEW_PAYMENT,
    paymentAmount: 0,
    paymentAssignee: '',
    copilotPaymentAmount: 0,
    copilot: '',
    paymentDescription: '',
    paymentTitle: '',
    submissionGuidelines: '',
    selectedBillingAccountId: 0,
    selectedProjectId: 0,
    technologyTags: [],
    challengeTechnologyTags: [],
  }));
}

export default create();
