const withPrefix = name => `@login/${name}`;

export const CHANGE_PHONE_NUMBER = withPrefix('CHANGE_PHONE_NUMBER');

// START gets control code, then we start polling.
export const MOBILE_AUTHENTICATION_START = withPrefix('MOBILE_AUTHENTICATION_START');
export const MOBILE_AUTHENTICATION_START_SUCCESS = withPrefix('MOBILE_AUTHENTICATION_START_SUCCESS');
export const MOBILE_AUTHENTICATION_START_ERROR = withPrefix('MOBILE_AUTHENTICATION_START_ERROR');

export const MOBILE_AUTHENTICATION_SUCCESS = withPrefix('MOBILE_AUTHENTICATION_SUCCESS');
export const MOBILE_AUTHENTICATION_ERROR = withPrefix('MOBILE_AUTHENTICATION_ERROR');

export const MOBILE_AUTHENTICATION_CANCEL = withPrefix('MOBILE_AUTHENTICATION_CANCEL');
