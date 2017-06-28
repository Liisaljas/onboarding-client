import {
  LOAD_PENSION_DATA_SUCCESS,

  GET_SOURCE_FUNDS_START,
  GET_SOURCE_FUNDS_SUCCESS,
  GET_SOURCE_FUNDS_ERROR,

  SELECT_EXCHANGE_SOURCES,

  GET_TARGET_FUNDS_START,
  GET_TARGET_FUNDS_SUCCESS,
  GET_TARGET_FUNDS_ERROR,

  SELECT_TARGET_FUND,

  CHANGE_AGREEMENT_TO_TERMS,

  // NOTE: maybe we should move this state to a separate mandate reducer?
  SIGN_MANDATE_MOBILE_ID_START,
  SIGN_MANDATE_MOBILE_ID_START_SUCCESS,
  SIGN_MANDATE_MOBILE_ID_CANCEL,
  SIGN_MANDATE_ID_CARD_START,
  SIGN_MANDATE_START_ERROR,
  SIGN_MANDATE_INVALID_ERROR,
  SIGN_MANDATE_SUCCESS,
  SIGN_MANDATE_ERROR,
  NO_SIGN_MANDATE_ERROR,

  GET_PENDING_EXCHANGES_START,
  GET_PENDING_EXCHANGES_SUCCESS,
  GET_PENDING_EXCHANGES_ERROR,

  QUERY_PARAMETERS,

  DISABLE_SHORT_FLOW,
} from './constants';

import {
  LOG_OUT,
} from '../login/constants';

import { getGlobalErrorCode } from '../common/errorMessage';

const initialState = {
  loadingPensionData: true,
  sourceFunds: null,
  loadingSourceFunds: false,
  sourceSelection: null,
  sourceSelectionExact: false,
  targetFunds: null,
  loadingTargetFunds: false,
  selectedFutureContributionsFundIsin: null,
  error: null,

  loadingMandate: false,
  mandateSigningControlCode: null,
  mandateSigningError: null,
  signedMandateId: false,
  agreedToTerms: false,

  loadingPendingExchanges: false,
  pendingExchanges: null,

  shortFlow: false,
};

function createFullDefaultSourceSelection({ sourceFunds, targetFunds }) {
  return sourceFunds
    .filter(fund => fund.isin !== targetFunds[0].isin)
    .map(({ isin }) => ({
      sourceFundIsin: isin,
      targetFundIsin: targetFunds[0].isin,
      percentage: 1,
    }));
}

function isContributionsFundAlreadyActive(state, isinToCompareTo) {
  return state.sourceFunds && !!state.sourceFunds
      .find(sourceFund =>
      sourceFund.activeFund && sourceFund.isin === isinToCompareTo);
}

function getContributionFundIsin(action, state) {
  if (!action.sourceSelectionExact && action.sourceSelection.length > 0) {
    const futureContributionsFundCandidate = action.sourceSelection[0].targetFundIsin;
    return isContributionsFundAlreadyActive(state, futureContributionsFundCandidate)
        ? null : futureContributionsFundCandidate;
  }
  return state.selectedFutureContributionsFundIsin;
}

let shortFlowNewState = null;

export default function exchangeReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_PENSION_DATA_SUCCESS:
      return { ...state, loadingPensionData: false };
    case GET_SOURCE_FUNDS_START:
      return { ...state, loadingSourceFunds: true, error: null };
    case GET_SOURCE_FUNDS_SUCCESS:
      return {
        ...state,
        loadingSourceFunds: false,
        sourceFunds: action.sourceFunds,
        // we do not know if source or target funds get here first, so we check if we can
        // calculate the default source selection and they have not yet been calculated in
        // both the target and source fund arrival
        sourceSelection: state.targetFunds && !state.sourceSelection ?
          createFullDefaultSourceSelection({
            sourceFunds: action.sourceFunds,
            targetFunds: state.targetFunds,
          }) : state.sourceSelection,
      };
    case GET_SOURCE_FUNDS_ERROR:
      return { ...state, loadingSourceFunds: false, error: getGlobalErrorCode(action.error.body) };
    case SELECT_EXCHANGE_SOURCES:
      return {
        ...state,
        sourceSelection: action.sourceSelection,
        sourceSelectionExact: !!action.sourceSelectionExact,
        selectedFutureContributionsFundIsin: getContributionFundIsin(action, state),
      };

    case GET_TARGET_FUNDS_START:
      return { ...state, loadingTargetFunds: true, error: null };
    case GET_TARGET_FUNDS_SUCCESS:
      return {
        ...state,
        loadingTargetFunds: false,
        targetFunds: action.targetFunds,
        selectedFutureContributionsFundIsin: action.targetFunds[0].isin,
        // we do not know if source or target funds get here first, so we check if we can
        // calculate the default source selection and they have not yet been calculated in
        // both the target and source fund arrival
        sourceSelection: state.sourceFunds && !state.sourceSelection ?
          createFullDefaultSourceSelection({
            sourceFunds: state.sourceFunds,
            targetFunds: action.targetFunds,
          }) : state.sourceSelection,
      };
    case GET_TARGET_FUNDS_ERROR:
      return { ...state, loadingTargetFunds: false, error: getGlobalErrorCode(action.error.body) };
    case SELECT_TARGET_FUND:
      return {
        ...state,
        selectedFutureContributionsFundIsin:
          isContributionsFundAlreadyActive(state, action.targetFundIsin)
            ? null : action.targetFundIsin,
      };

    case SIGN_MANDATE_MOBILE_ID_START:
    case SIGN_MANDATE_ID_CARD_START:
      return { ...state, loadingMandate: true, mandateSigningError: null };
    case SIGN_MANDATE_MOBILE_ID_START_SUCCESS:
      return { ...state, mandateSigningControlCode: action.controlCode, loadingMandate: false };
    case SIGN_MANDATE_SUCCESS:
      return {
        ...state,
        mandateSigningControlCode: null,
        signedMandateId: action.signedMandateId,
        loadingMandate: false,
      };

    case SIGN_MANDATE_START_ERROR: // fallthrough
    case SIGN_MANDATE_ERROR:
      return {
        ...state,
        loadingMandate: false,
        mandateSigningControlCode: null,
        mandateSigningError: action.error,
      };
    case SIGN_MANDATE_INVALID_ERROR:
      return {
        ...state,
        loadingMandate: false,
        mandateSigningControlCode: null,
        mandateSigningError: action.error,
      };
    case SIGN_MANDATE_MOBILE_ID_CANCEL:
      return {
        ...state,
        loadingMandate: false,
        mandateSigningControlCode: null,
        signedMandateId: null,
      };

    case CHANGE_AGREEMENT_TO_TERMS:
      return {
        ...state,
        agreedToTerms: action.agreement,
      };

    case LOG_OUT:
      return initialState;
    case NO_SIGN_MANDATE_ERROR:
      return {
        ...state,
        mandateSigningError: null,
      };
    case GET_PENDING_EXCHANGES_START:
      return { ...state,
        loadingPendingExchanges: true,
        error: null,
      };
    case GET_PENDING_EXCHANGES_SUCCESS:
      return {
        ...state,
        loadingPendingExchanges: false,
        pendingExchanges: action.pendingExchanges,
      };
    case GET_PENDING_EXCHANGES_ERROR:
      return { ...state,
        loadingPendingExchanges: false,
        error: action.error,
      };
    case QUERY_PARAMETERS:
      shortFlowNewState = state.shortFlow;
      if (action.query.shortFlow) {
        shortFlowNewState = action.query.shortFlow === 'true';
      }
      return {
        ...state,
        isNewMember: action.query.isNewMember === 'true',
        shortFlow: shortFlowNewState,
      };
    case DISABLE_SHORT_FLOW:
      return {
        ...state,
        shortFlow: false,
      };
    default:
      return state;
  }
}
