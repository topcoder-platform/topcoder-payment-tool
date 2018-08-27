/**
 * Payment confirmation.
 */

import PT from 'prop-types';
import React from 'react';
import { Button, PrimaryButton } from 'topcoder-react-ui-kit';
import Background from '../Background';

import './style.scss';

export default function Confirmation({
  amount,
  assignee,
  copilot,
  copilotFee,
  resetPaymentData,
  paymentTitle,
}) {
  return (
    <Background>
      <div styleName="container">
        <div styleName="card">
          <h1 styleName="title">
Payment Completed
          </h1>
          <p styleName="description">
            Your payment has been accepted and money will be shortly transfered from
            your account.
          </p>
          <div styleName="paycheck">
            <div styleName="info">
              <p styleName="user">
                <strong>${amount}</strong> paid to &zwnj;
                <strong styleName="name">{assignee}</strong>
              </p>
              {
                copilot && copilotFee ? (
                  <p styleName="user">
                    <strong>${copilotFee}</strong> paid to &zwnj;
                    <strong styleName="name">{copilot}</strong> as copilot
                  </p>
                ) : null
              }
              <p styleName="task">{paymentTitle}</p>
            </div>
          </div>
          <div styleName="actions">
            <Button
              onClick={resetPaymentData}
            >
              Make another payment
            </Button>
            <PrimaryButton
              to="/"
            >
              Ok, done for now
            </PrimaryButton>
          </div>
        </div>
      </div>
    </Background>
  );
}

Confirmation.defaultProps = {
  copilot: '',
  copilotFee: 0,
};

Confirmation.propTypes = {
  amount: PT.number.isRequired,
  assignee: PT.string.isRequired,
  copilot: PT.string,
  copilotFee: PT.number,
  paymentTitle: PT.string.isRequired,
  resetPaymentData: PT.func.isRequired,
};
