/**
 * Payment editor.
 */
/* global window */

import _ from 'lodash';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import Select from 'components/Select';
import { PrimaryButton } from 'topcoder-react-ui-kit';
import { WithContext as ReactTags } from 'react-tag-input';
import MemberSearchInput from 'components/MemberSearchInput';

import Background from '../Background';

import './style.scss';

export default function Editor({
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
  makePayment,
  neu,
  paymentAmount,
  paymentAssignee,
  copilotPaymentAmount,
  copilot,
  paymentDescription,
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
  setPaymentTitle,
  setSubmissionGuidelines,
  submissionGuidelines,
  technologyTags,
  addTechnologyTag,
  removeTechnologyTag,
  challengeTechnologyTags,
  memberTasks,
}) {
  let winner;
  let challengeCopilot;
  let techTags = (
    <div styleName="fieldFlex">
      <span styleName="label">
Tags
      </span>
      <ReactTags
        tags={challengeTechnologyTags}
        suggestions={technologyTags.map(t => ({ ...t, id: `${t.id}` }))}
        labelField="name"
        handleDelete={removeTechnologyTag}
        handleAddition={addTechnologyTag}
        delimiters={[188, 13]}
      />
    </div>
  );
  let description = (
    <textarea
      disabled={!neu}
      onChange={e => setPaymentDescription(e.target.value)}
      placeholder="payment is for ..."
      rows={3}
      value={paymentDescription}
    />
  );
  let guidelines = (
    <textarea
      disabled={!neu}
      onChange={e => setSubmissionGuidelines(e.target.value)}
      placeholder="Submission guidelines is for ..."
      rows={3}
      value={submissionGuidelines}
    />
  );

  let updatedAt = null;

  let textAreaClassName = 'field';

  if (challenge) {
    winner = challenge.winners || [];
    [winner] = winner.filter(x => x.type === 'final');

    challengeCopilot = 'N/A';

    description = (
      <div
        styleName="fakeTextArea"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: paymentDescription }}
      />
    );

    guidelines = (
      <div
        styleName="fakeTextArea"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: submissionGuidelines }}
      />
    );

    techTags = null;
    if (memberTasks) {
      const task = memberTasks.filter(x => x.id === challenge.id);
      updatedAt = task.length > 0 ? task[0].updatedAt : null;
      updatedAt = (
        <div styleName="field">
          <span styleName="label">
Posted at
          </span>
          <span styleName="dateLabel">
            { (new Date(updatedAt)).toLocaleString() }
          </span>
        </div>
      );
    }

    textAreaClassName = 'fieldFlex';
  }

  let content;
  if (!projectDetails) content = <LoadingIndicator />;
  else {
    const billingAccounts = (projectDetails.billingAccounts || [])
      .map(({ id, name }) => ({ label: name, value: id }));
    const billingAccountsComponent = billingAccounts.length
      ? (
        <div styleName="field">
          <span styleName="label">
  Billing account
          </span>
          <Select
            autoBlur
            disabled={!neu}
            options={billingAccounts}
            value={selectedBillingAccountId}
          />
        </div>
      )
      : (
        <div styleName="field">
          This project has no associated billing accounts yet
        </div>
      );

    content = (
      <div styleName="field">
        {billingAccountsComponent}
        <div styleName="fieldGap" />
        <div styleName="field">
          <span styleName="label">
Title
          </span>
          <input
            disabled={!neu}
            onChange={e => setPaymentTitle(e.target.value)}
            placeholder="Topcoder payment"
            value={paymentTitle}
          />
        </div>
        <div styleName={textAreaClassName}>
          <span styleName="label">
Description
          </span>
          {description}
        </div>
        <div styleName={textAreaClassName}>
          <span styleName="label">
Submission Guidelines
          </span>
          {guidelines}
        </div>
        <div styleName="field">
          <span styleName="label">
Assign to
          </span>
          <MemberSearchInput
            disabled={!neu}
            placeholder="Type handle to assign member"
            searchMembers={memberSuggestions}
            isPopupVisible={memberInputPopupVisible}
            keyword={_.get(winner, 'handle') || memberInputKeyword}
            selectedNewMember={winner || memberInputSelected}
            onToggleSearchPopup={setMemberInputPopupVisible}
            onSelectNewMember={(member) => {
              setMemberInputSelected(member);
              setPaymentAssignee(member.handle);
            }}
            onKeywordChange={(keyword) => {
              setMemberInputKeyword(keyword);
              getMemberSuggestions(keyword);
            }}
            member={winner}
          />
        </div>
        <div styleName="field">
          <span styleName="label">
Amount
          </span>
          <div styleName="withPrefix">
            <div styleName="prefix">
              <div styleName="textPrefix">
$
              </div>
            </div>
            <input
              disabled={!neu}
              onChange={e => setPaymentAmount(Number(e.target.value))}
              placeholder="0"
              type="number"
              value={String(paymentAmount)}
            />
          </div>
        </div>
        <div styleName="field">
          <span styleName="label">
Copilot
          </span>
          <MemberSearchInput
            disabled={!neu}
            placeholder="Type handle to assign copilot"
            searchMembers={copilotSuggestions}
            isPopupVisible={copilotInputPopupVisible}
            keyword={challengeCopilot || copilotInputKeyword}
            selectedNewMember={copilotInputSelected}
            onToggleSearchPopup={setCopilotInputPopupVisible}
            onSelectNewMember={(member) => {
              setCopilotInputSelected(member);
              setCopilot(member.handle);
            }}
            onKeywordChange={(keyword) => {
              setCopilotInputKeyword(keyword);
              getCopilotSuggestions(keyword);
            }}
            member={challengeCopilot}
          />
        </div>
        <div styleName="field">
          <span styleName="label">
Copilot Amount
          </span>
          <div styleName="withPrefix">
            <div styleName="prefix">
              <div styleName="textPrefix">
$
              </div>
            </div>
            <input
              disabled={!neu}
              onChange={e => setCopilotPaymentAmount(Number(e.target.value))}
              placeholder="0"
              type="number"
              value={String(copilotPaymentAmount)}
            />
          </div>
        </div>
        {techTags}
        {updatedAt}
        <div styleName="action">
          { neu
            && ((paymentAmount && paymentAssignee) || (copilot && copilotPaymentAmount))
            && paymentDescription
            && challengeTechnologyTags.length
            && paymentTitle ? (
              <PrimaryButton
                onClick={makePayment}
                // to="/sandbox/payments/123/done"
              >
Pay now
              </PrimaryButton>
            ) : null
          }
        </div>
      </div>
    );
  }

  return (
    <Background
      escapeButton
      // TODO: This is wrong, as it reloads the app, but fine for now.
      onExit={() => { window.location = '/'; }}
    >
      <div styleName="container">
        <h1 styleName="title">
          {`${neu ? 'New ' : ''}Member Payment`}
        </h1>
        <div styleName="form">
          <div styleName="field">
            <span styleName="label">
Project
            </span>
            <Select
              autoBlur
              disabled={!neu}
              labelKey="name"
              onChange={project => selectProject(project && project.id)}
              options={projects}
              valueKey="id"
              value={Number(selectedProjectId)}
            />
          </div>
          {content}
        </div>
      </div>
    </Background>
  );
}

Editor.defaultProps = {
  challenge: null,
  neu: true,
  projectDetails: null,
};

Editor.propTypes = {
  challenge: PT.shape({
    winners: PT.arrayOf(PT.object),
  }),
  neu: PT.bool,
  makePayment: PT.func.isRequired,
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
  copilotPaymentAmount: PT.number.isRequired,
  copilot: PT.string.isRequired,
  paymentAmount: PT.number.isRequired,
  paymentAssignee: PT.string.isRequired,
  paymentDescription: PT.string.isRequired,
  submissionGuidelines: PT.string.isRequired,
  paymentTitle: PT.string.isRequired,
  projectDetails: PT.shape(),
  projects: PT.arrayOf(PT.object).isRequired,
  selectedBillingAccountId: PT.number.isRequired,
  selectedProjectId: PT.number.isRequired,
  selectProject: PT.func.isRequired,
  setPaymentAmount: PT.func.isRequired,
  setCopilotPaymentAmount: PT.func.isRequired,
  setPaymentAssignee: PT.func.isRequired,
  setCopilot: PT.func.isRequired,
  setPaymentDescription: PT.func.isRequired,
  setSubmissionGuidelines: PT.func.isRequired,
  setPaymentTitle: PT.func.isRequired,
  technologyTags: PT.arrayOf(PT.shape()).isRequired,
  addTechnologyTag: PT.func.isRequired,
  removeTechnologyTag: PT.func.isRequired,
  challengeTechnologyTags: PT.arrayOf(PT.shape()).isRequired,
  memberTasks: PT.arrayOf(PT.shape()).isRequired,
};
