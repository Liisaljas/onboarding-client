import React, { PropTypes as Types } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Message } from 'retranslate';

import './LoginPage.scss';

import { logo, AuthenticationLoader } from '../common';
import LoginForm from './loginForm';
import ErrorAlert from './errorAlert';
import { changePhoneNumber, authenticateWithPhoneNumber, cancelMobileAuthentication, authenticateWithIdCard } from './actions';

export const LoginPage = ({
  onPhoneNumberSubmit,
  onPhoneNumberChange,
  onCancelMobileAuthentication,
  onAuthenticateWithIdCard,
  phoneNumber,
  controlCode,
  loadingControlCode,
  errorDescription,
}) => (
  <div className="login-page">
    <div className="container pt-5">
      <div className="row">
        <div className="col-lg-12 text-center">
          <img src={logo} alt="Tuleva" className="img-responsive brand-logo mb-3 pb-3 mt-2" />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-10 offset-lg-1 col-sm-12 offset-sm-0 text-center">
          <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-12">
            {
              !errorDescription && !loadingControlCode && !controlCode ?
                <LoginForm
                  onPhoneNumberSubmit={onPhoneNumberSubmit}
                  onPhoneNumberChange={onPhoneNumberChange}
                  phoneNumber={phoneNumber}
                  onAuthenticateWithIdCard={onAuthenticateWithIdCard}
                /> : ''
            }
            {
              !errorDescription && (loadingControlCode || controlCode) ?
                <AuthenticationLoader
                  onCancel={onCancelMobileAuthentication}
                  controlCode={controlCode}
                /> : ''
            }
            { errorDescription ? <ErrorAlert description={errorDescription} /> : '' }
            <div className="mt-3 mb-3">
              <div className="login-page__not-member">
                <Message>login.not.member</Message>
              </div>
              <a href="//tuleva.ee/#liitu" className="login-page__apply">
                <Message>login.apply.link</Message>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const noop = () => null;

LoginPage.defaultProps = {
  onPhoneNumberChange: noop,
  onPhoneNumberSubmit: noop,
  onCancelMobileAuthentication: noop,
  onAuthenticateWithIdCard: noop,

  phoneNumber: '',
  controlCode: '',
  loadingControlCode: false,
  successful: false,
  errorDescription: '',
};

LoginPage.propTypes = {
  onPhoneNumberChange: Types.func,
  onPhoneNumberSubmit: Types.func,
  onCancelMobileAuthentication: Types.func,
  onAuthenticateWithIdCard: Types.func,

  phoneNumber: Types.string,
  controlCode: Types.string,
  loadingControlCode: Types.bool,
  errorDescription: Types.string,
};

const mapStateToProps = state => ({
  phoneNumber: state.login.phoneNumber,
  controlCode: state.login.controlCode,
  loadingControlCode: state.login.loadingControlCode,
  errorDescription: (state.login.error || {}).error_description,
  successful: !!state.login.token, // not used right now
});
const mapDispatchToProps = dispatch => bindActionCreators({
  onPhoneNumberChange: changePhoneNumber,
  onPhoneNumberSubmit: authenticateWithPhoneNumber,
  onCancelMobileAuthentication: cancelMobileAuthentication,
  onAuthenticateWithIdCard: authenticateWithIdCard,
}, dispatch);

const withRedux = connect(mapStateToProps, mapDispatchToProps);

export default withRedux(LoginPage);
