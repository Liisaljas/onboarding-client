import React, { PropTypes as Types } from 'react';
import { Message } from 'retranslate';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { downloadMandate } from '../../exchange/actions';
import successImage from './success.svg';
import './Success.scss';

export const Success = ({
  selectedFutureContributionsFundIsin,
  sourceSelection,
  onDownloadMandate,
}) => (
  <div className="row">
    <div className="col-12 mt-5 px-0">
      <div className="alert alert-success text-center pt-5 pb-5">
        <div className="tv-success__container">
          <img src={successImage} alt="Success" className="tv-success__check" />
        </div>
        <h2 className="text-center mt-3"><Message>success.done</Message></h2>
        <button className="btn btn-secondary text-center" onClick={onDownloadMandate}>
          <Message>success.download.mandate</Message>
        </button>
        {
          selectedFutureContributionsFundIsin ? (
            <p className="mt-4">
              <Message>success.your.payments</Message>
              <b alt={selectedFutureContributionsFundIsin}>
                <Message>success.your.payments.next.payment</Message>
              </b>.
            </p>
          ) : ''
        }
        {
          sourceSelection ? (
            <p>
              <Message>success.shares.switched</Message>
              <b><Message>success.shares.switched.when</Message></b>.
            </p>
          ) : ''
        }
      </div>
      <h2 className="mt-5">
        <Message>success.view.profile.title</Message>
      </h2>
      <Link className="btn btn-primary mt-4 profile-link" to="/account">
        <Message>success.view.profile.title.button</Message>
      </Link>
    </div>
  </div>
);

const noop = () => null;

Success.defaultProps = {
  selectedFutureContributionsFundIsin: null,
  sourceSelection: null,
  onDownloadMandate: noop,
};

Success.propTypes = {
  selectedFutureContributionsFundIsin: Types.string,
  sourceSelection: Types.arrayOf(Types.shape({})),
  onDownloadMandate: Types.func,
};

const mapStateToProps = state => ({
  selectedFutureContributionsFundIsin: state.exchange.selectedFutureContributionsFundIsin,
  sourceSelection: state.exchange.sourceSelection,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  onDownloadMandate: downloadMandate,
}, dispatch);

const connectToRedux = connect(mapStateToProps, mapDispatchToProps);

export default connectToRedux(Success);
