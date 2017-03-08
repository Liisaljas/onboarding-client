import React, { PropTypes as Types } from 'react';
import { Message } from 'retranslate';

import { InfoTooltip } from '../../../common';
import TargetFundTooltipBody from '../../transferFutureCapital/targetFundTooltipBody';

import './TargetFundSelector.scss';
import checkImage from '../../success/success.svg';

const TargetFundSelector = ({ targetFunds, onSelectFund, selectedTargetFundIsin }) => (
  <div className="row mx-0 mt-2 tv-target-fund__container">
    {
      targetFunds.map(fund => (
        <button
          key={fund.isin}
          className={`
            col tv-target-fund p-4 mr-2 text-left
            ${selectedTargetFundIsin === fund.isin ? 'tv-target-fund--active' : ''}
          `}
          onClick={() => onSelectFund(fund)}
        >
          {(selectedTargetFundIsin === fund.isin) ?
            (<div className="tv-target-fund__corner-check">
              <span>
                <img src={checkImage} alt="Success" />
              </span>
            </div>)
            : ''}
          <div className="tv-target-fund__inner-container">
            <h5 className="mb-2 tv-target-fund__title">
              <Message>{`target.funds.${fund.isin}.title`}</Message>
              <InfoTooltip name={fund.isin}>
                <TargetFundTooltipBody targetFundIsin={fund.isin} />
              </InfoTooltip>
            </h5>
            <div className="mb-2 tv-target-fund__description">
              <Message>{`target.funds.${fund.isin}.description`}</Message>
            </div>
            <a href={`example.com/${fund.isin}`} className="tv-target-fund__description"> {/* TODO: once we have links, resolve by isin */}
              <Message>target.funds.terms</Message>
            </a>
          </div>
        </button>
      ))
    }
  </div>
);

const noop = () => null;

TargetFundSelector.defaultProps = {
  targetFunds: [],
  onSelectFund: noop,
  selectedTargetFundIsin: '',
};

TargetFundSelector.propTypes = {
  targetFunds: Types.arrayOf(Types.shape({ isin: Types.string.isRequired })),
  onSelectFund: Types.func,
  selectedTargetFundIsin: Types.string,
};

export default TargetFundSelector;
