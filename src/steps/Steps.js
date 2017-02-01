import React, { PropTypes as Types } from 'react';
import { connect } from 'react-redux';
import { Message } from 'retranslate';

import './Steps.scss';

import StepTitle from './stepTitle';

const orderedStepNames = [
  'select-exchange',
  'select-fund',
  'transfer-future-capital',
  'confirm-application',
];

// this component wraps all steps and renders the top and bottom areas.
export const Steps = ({ children, stepName, userFirstName }) => {
  const stepIndex = orderedStepNames.indexOf(stepName);
  const beforeSteps = orderedStepNames.slice(0, stepIndex);
  const currentStep = orderedStepNames[stepIndex];
  const afterSteps = orderedStepNames.slice(stepIndex + 1);
  return (
    <div className="row">
      <div className="col px-0">
        { // show welcome when in first step
          stepIndex === 0 ? (
            <div className="px-col mt-4">
              <p><Message params={{ name: userFirstName }}>steps.welcome</Message></p>
              <p className="mt-4"><Message>steps.intro</Message></p>
            </div>
          ) : ''
        }
        <div className="tv-steps mt-4">
          {
            beforeSteps.map((beforeStep, index) =>
              <StepTitle key={beforeStep} number={index + 1} completed>
                <Message>{`steps.${beforeStep}`}</Message>
              </StepTitle>,
            )
          }
          <StepTitle number={stepIndex + 1} active>
            <Message>{`steps.${currentStep}`}</Message>
          </StepTitle>
          <div className="px-col pb-4 tv-step__content">{children}</div>
          <hr className="mb-4" />
          {
            afterSteps.map((afterStep, index) =>
              <StepTitle key={afterStep} number={index + 1 + stepIndex + 1}>
                <Message>{`steps.${afterStep}`}</Message>
              </StepTitle>,
            )
          }
        </div>
      </div>
    </div>
  );
};

Steps.defaultProps = {
  children: null,
  stepName: null,
  userFirstName: '',
};

Steps.propTypes = {
  stepName: Types.string,
  userFirstName: Types.string,
  children: Types.oneOfType([Types.node, Types.arrayOf(Types.node)]),
};

const mapStateToProps = state => ({
  stepName: state.routing.locationBeforeTransitions.pathname.split('/').pop(),
  userFirstName: (state.login.user || {}).firstName,
});

const connectToRedux = connect(mapStateToProps);

export default connectToRedux(Steps);