import React from 'react';
import { render } from 'react-dom';
import config from 'react-global-configuration';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';
import { Provider as TranslationProvider } from 'retranslate';
import { Provider as ReduxProvider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';
import mixpanel from 'mixpanel-browser';
import MixpanelProvider from 'react-mixpanel';

import initializeConfiguration from './config/config';
import translations from './translations';
import './index.scss';

import requireAuthentication from './requireAuthentication';
import LoginPage, { reducer as loginReducer, actions as loginActions } from './login';
import TermsOfUse from './termsOfUse';
import NewUser from './newUserFlow/newUser';
import NonMember from './newUserFlow/nonMember';
import SignUpPage from './newUserFlow/signUp';
import Payment from './newUserFlow/payment';
import { reducer as exchangeReducer, actions as exchangeActions } from './exchange';
import trackingReducer from './tracking';
import { reducer as comparisonReducer, actions as comparisonActions } from './comparison';

import App from './app';
import AccountPage from './account';
import Steps, {
  SelectSources,
  TransferFutureCapital,
  ConfirmMandate,
  Success,
} from './onboardingFlow';

const rootReducer = combineReducers({
  routing: routerReducer,
  login: loginReducer,
  exchange: exchangeReducer, // exchage of funds
  comparison: comparisonReducer,
  tracking: trackingReducer,
  form: formReducer,
});

const composeEnhancers = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose; // eslint-disable-line

const routingMiddleware = routerMiddleware(browserHistory);

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk, routingMiddleware)));

const history = syncHistoryWithStore(browserHistory, store);

// TODO: figure out a place where to put these two
function getDataForApp() {
  const { login } = store.getState();
  if (login.token && !(login.user || login.loadingUser)) {
    store.dispatch(loginActions.getUser());
  }
}

function getDataForFlow(nextState) {
  store.dispatch(exchangeActions.mapUrlQueryParamsToState(nextState.location.query));
  const { login, exchange, comparison } = store.getState();
  if (login.token && !(exchange.sourceFunds || exchange.loadingSourceFunds ||
    exchange.targetFunds || exchange.loadingTargetFunds || comparison.loadingComparison)) {
    store.dispatch(exchangeActions.getSourceFunds());
    store.dispatch(exchangeActions.getTargetFunds());
    store.dispatch(comparisonActions.getComparison());
  }
}

function getDataForAccount() {
  const { login, exchange } = store.getState();
  if (login.token && !(exchange.sourceFunds || exchange.loadingSourceFunds)) {
    store.dispatch(exchangeActions.getSourceFunds());
  }
}

function getLanguage() {
  const params = window.location.search;

  if (params.includes('language=et')) {
    return 'et';
  } else if (params.includes('language=en')) {
    return 'en';
  }
  return 'et';
}

function scrollToTop() {
  window.scrollTo(0, 0);
}

initializeConfiguration();

mixpanel.init(config.get('mixpanelKey'));

render((
  <MixpanelProvider mixpanel={mixpanel}>
    <TranslationProvider
      messages={translations} language={getLanguage()} fallbackLanguage="et"
    >
      <ReduxProvider store={store}>
        <Router history={history}>
          <Route path="/login" component={LoginPage} />
          <Route path="/terms-of-use" component={TermsOfUse} />
          <Route path="/" component={requireAuthentication(App)} onEnter={getDataForApp}>

            <Route path="/steps" onEnter={getDataForFlow}>
              <Route path="new-user" component={NewUser} onEnter={scrollToTop} />
              <Route path="non-member" component={NonMember} />
              <Route path="signup" component={SignUpPage} />
              <Route path="payment" component={Payment} />
            </Route>

            <Route path="/steps" component={Steps} onEnter={getDataForFlow}>
              <Route path="select-sources" component={SelectSources} onEnter={scrollToTop} />
              <Route
                path="transfer-future-capital"
                component={TransferFutureCapital}
                onEnter={scrollToTop}
              />
              <Route path="confirm-mandate" component={ConfirmMandate} onEnter={scrollToTop} />
            </Route>
            <Route path="/steps/success" component={Success} />
            <Route path="/account" component={AccountPage} onEnter={getDataForAccount} />
          </Route>
        </Router>
      </ReduxProvider>
    </TranslationProvider>
  </MixpanelProvider>
), document.getElementById('root'));
