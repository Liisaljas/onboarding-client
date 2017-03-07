import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router';
import { Message } from 'retranslate';

import { Loader, Radio } from '../../common';
import PensionFundTable from './pensionFundTable';
import ExactFundSelector from './exactFundSelector';
import { SelectSources } from './SelectSources';

describe('Select sources step', () => {
  let component;

  beforeEach(() => {
    component = shallow(<SelectSources />);
  });

  it('renders a loader when loading source or target funds', () => {
    component.setProps({ loadingSourceFunds: true });
    expect(component.get(0)).toEqual(<Loader className="align-middle" />);
    component.setProps({ loadingSourceFunds: false, loadingTargetFunds: true });
    expect(component.get(0)).toEqual(<Loader className="align-middle" />);
  });

  it('does not render a loader when funds loaded', () => {
    component.setProps({ loadingSourceFunds: false, loadingTargetFunds: false });
    expect(component.get(0)).not.toEqual(<Loader className="align-middle" />);
  });

  it('renders a title', () => {
    expect(component.contains(<Message>select.sources.current.status</Message>)).toBe(true);
  });

  it('renders a pension fund table with given funds', () => {
    const sourceFunds = [{ iAmAFund: true }, { iAmAlsoAFund: true }];
    component.setProps({ sourceFunds });
    expect(component.contains(<PensionFundTable funds={sourceFunds} />)).toBe(true);
  });

  it('renders a link to the next step', () => {
    expect(component.contains(
      <Link className="btn btn-primary mt-5" to="/steps/transfer-future-capital">
        <Message>steps.next</Message>
      </Link>,
    )).toBe(true);
  });

  it('sets the full selection radio as selected only when all funds selected', () => {
    const fullSelectionRadio = () => component.find(Radio).first();
    component.setProps({
      sourceSelectionExact: false,
      sourceSelection: [{ name: 'a', percentage: 1 }, { name: 'b', percentage: 1 }],
    });
    expect(fullSelectionRadio().prop('selected')).toBe(true);

    component.setProps({ sourceSelectionExact: true });
    expect(fullSelectionRadio().prop('selected')).toBe(false);

    component.setProps({
      sourceSelectionExact: false,
      sourceSelection: [],
    });
    expect(fullSelectionRadio().prop('selected')).toBe(false);
  });

  it('selects all funds when clicking on the full selection radio', () => {
    const onSelect = jest.fn();
    const sourceFunds = [{ isin: 'a' }, { isin: 'b' }];
    const targetFunds = [{ isin: 'c' }];
    const fullSelection = [
      { sourceFundIsin: 'a', targetFundIsin: 'c', percentage: 1 },
      { sourceFundIsin: 'b', targetFundIsin: 'c', percentage: 1 },
    ];
    component.setProps({ sourceFunds, targetFunds, onSelect });
    expect(onSelect).not.toHaveBeenCalled();
    component.find(Radio).first().simulate('select');
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(fullSelection, false);
  });

  it('sets the no selection radio as selected only when no funds selected', () => {
    const noneSelectionRadio = () => component.find(Radio).last();
    component.setProps({
      sourceSelectionExact: false,
      sourceSelection: [],
    });
    expect(noneSelectionRadio().prop('selected')).toBe(true);

    component.setProps({ sourceSelectionExact: true });
    expect(noneSelectionRadio().prop('selected')).toBe(false);

    component.setProps({
      sourceSelectionExact: false,
      sourceSelection: [{ name: 'a', percentage: 0.5 }, { name: 'b', percentage: 1 }],
    });
    expect(noneSelectionRadio().prop('selected')).toBe(false);
  });

  it('shows subtitle for no funds only when it is selected', () => {
    const noneSelectionRadio = () => component.find(Radio).last();
    component.setProps({
      sourceSelectionExact: false,
      sourceSelection: [],
    });

    expect(noneSelectionRadio().prop('selected')).toBe(true);
    expect(component.contains(<Message>select.sources.select.none.subtitle</Message>)).toBe(true);

    component.setProps({
      sourceSelectionExact: false,
      sourceSelection: [{ name: 'a', percentage: 0.5 }, { name: 'b', percentage: 1 }],
    });

    expect(noneSelectionRadio().prop('selected')).toBe(false);
    expect(component.contains(<Message>select.sources.select.none.subtitle</Message>)).toBe(false);
  });

  it('selects no funds when clicking on the no selection radio', () => {
    const onSelect = jest.fn();
    const sourceFunds = [{ isin: 'a' }, { isin: 'b' }];
    component.setProps({ sourceFunds, onSelect });
    expect(onSelect).not.toHaveBeenCalled();
    component.find(Radio).last().simulate('select');
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith([], false);
  });

  it('sets the exact fund selector active as selected when fund selection is exact', () => {
    component.setProps({ sourceSelectionExact: true });
    const exactFundSelector = () => component.find(Radio).at(1);
    expect(exactFundSelector().prop('selected')).toBe(true);
    component.setProps({ sourceSelectionExact: false });
    expect(exactFundSelector().prop('selected')).toBe(false);
  });

  it('shows the exact fund selector when fund selection is exact', () => {
    const exactFundSelectorRendered = () => !!component.find(ExactFundSelector).length;
    component.setProps({ sourceSelectionExact: true });
    expect(exactFundSelectorRendered()).toBe(true);
    component.setProps({ sourceSelectionExact: false });
    expect(exactFundSelectorRendered()).toBe(false);
  });

  it('selects exact funds when the selector tells it to', () => {
    const onSelect = jest.fn();
    component.setProps({ onSelect, sourceSelectionExact: true });
    const selection = [{ name: 'a', percentage: 0.7 }, { name: 'b', percentage: 0.8 }];
    expect(onSelect).not.toHaveBeenCalled();
    component.find(ExactFundSelector).simulate('select', selection);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(selection, true);
  });
});
