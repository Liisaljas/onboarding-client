import React from 'react';
import { shallow } from 'enzyme';
import { Message } from 'retranslate';

import AuthenticationLoader from './AuthenticationLoader';
import { Loader } from '../../common';

describe('Authenticaion loader', () => {
  let component;
  let props;

  beforeEach(() => {
    props = {};
    component = shallow(<AuthenticationLoader {...props} />);
  });

  it('shows a loader', () => {
    expect(component.contains(<Loader />)).toBe(true);
  });

  it('does not show the control code message if no control code given', () => {
    expect(component.contains(<Message>login.control.code</Message>)).toBe(false);
  });

  it('shows the control code and the control code message if the code is given', () => {
    const controlCode = '1337';
    component.setProps({ controlCode });
    expect(component.text()).toContain(controlCode);
    expect(component.contains(<Message>login.control.code</Message>)).toBe(true);
  });

  it('can cancel authentication', () => {
    const onCancel = jest.fn();
    component.setProps({ onCancel });
    const clickButton = () => component.find('button').simulate('click');
    expect(component.contains(<Message>login.stop</Message>)).toBe(true);
    expect(onCancel).not.toHaveBeenCalled();
    clickButton();
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});