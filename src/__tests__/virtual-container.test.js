/* eslint-disable jsx-a11y/accessible-emoji */

import React from 'react'
import enzyme, { mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Waypoint from 'react-waypoint'
import VirtualContainer from '../'

enzyme.configure({ adapter: new Adapter() })

const waypointStates = {
  top: {
    initialVisible: {
      previousPosition: null,
      currentPosition: Waypoint.above,
    },
    initialVisibleInside: {
      previousPosition: null,
      currentPosition: Waypoint.inside,
    },
    initialNotVisible: {
      previousPosition: null,
      currentPosition: Waypoint.below,
    },
    becomesVisible: {
      previousPosition: Waypoint.below,
      currentPosition: Waypoint.inside,
    },
    becomesNotVisible: {
      previousPosition: Waypoint.inside,
      currentPosition: Waypoint.below,
    },
  },
  bottom: {
    initialVisible: {
      previousPosition: null,
      currentPosition: Waypoint.below,
    },
    initialVisibleInside: {
      previousPosition: null,
      currentPosition: Waypoint.inside,
    },
    initialNotVisible: {
      previousPosition: null,
      currentPosition: Waypoint.above,
    },
    becomesVisible: {
      previousPosition: Waypoint.above,
      currentPosition: Waypoint.inside,
    },
    becomesNotVisible: {
      previousPosition: Waypoint.inside,
      currentPosition: Waypoint.above,
    },
  },
}

describe('VirtualContainer', () => {
  const Placeholder = () => <div>🙈</div>
  const Actual = () => <div>🐵</div>
  const props = {
    placeholder: Placeholder,
    render: Actual,
  }
  let wrapper
  let topWaypoint
  let bottomWaypoint
  let changeTop
  let changeBottom
  beforeEach(() => {
    wrapper = mount(<VirtualContainer {...props} />)
    topWaypoint = wrapper.find(Waypoint).at(0)
    bottomWaypoint = wrapper.find(Waypoint).at(1)
    changeTop = topWaypoint.prop('onPositionChange')
    changeBottom = bottomWaypoint.prop('onPositionChange')
  })
  it('should initially render the placeholder', () => {
    expect(wrapper.containsMatchingElement(<Placeholder />)).toBe(true)
  })
  describe('initial waypoint firing', () => {
    it('only one waypoint has fired - show placeholder', () => {
      changeTop(waypointStates.top.initialVisible)
      wrapper.update()
      expect(wrapper.containsMatchingElement(<Placeholder />)).toBe(true)
    })
    it('both waypoints fire, top visible, bottom not visible - show placeholder', () => {
      changeTop(waypointStates.top.initialVisible)
      changeBottom(waypointStates.bottom.initialNotVisible)
      wrapper.update()
      expect(wrapper.containsMatchingElement(<Placeholder />)).toBe(true)
    })
    it('both waypoints fire, top not visible, bottom visible - show placeholder', () => {
      changeTop(waypointStates.top.initialNotVisible)
      changeBottom(waypointStates.bottom.initialVisible)
      wrapper.update()
      expect(wrapper.containsMatchingElement(<Placeholder />)).toBe(true)
    })
    it('both waypoints fire, top visible, bottom visible - show actual', () => {
      changeTop(waypointStates.top.initialVisible)
      changeBottom(waypointStates.bottom.initialVisible)
      wrapper.update()
      expect(wrapper.containsMatchingElement(<Actual />)).toBe(true)
    })
  })
  describe('waypoints updating', () => {
    describe('top visible, bottom not visible', () => {
      beforeEach(() => {
        changeTop(waypointStates.top.initialVisible)
        changeBottom(waypointStates.bottom.initialNotVisible)
        wrapper.update()
      })
      it('bottom waypoint becomes visible', () => {
        changeBottom(waypointStates.bottom.becomesVisible)
        wrapper.update()
        expect(wrapper.containsMatchingElement(<Actual />)).toBe(true)
      })
    })
    describe('top not visible, bottom visible', () => {
      beforeEach(() => {
        changeTop(waypointStates.top.initialNotVisible)
        wrapper.update()
        changeBottom(waypointStates.bottom.initialVisible)
        wrapper.update()
      })
      it('top waypoint becomes visible', () => {
        changeTop(waypointStates.top.becomesVisible)
        wrapper.update()
        expect(wrapper.containsMatchingElement(<Actual />)).toBe(true)
      })
    })
    describe('top visible, bottom visible', () => {
      beforeEach(() => {
        changeTop(waypointStates.top.initialVisible)
        changeBottom(waypointStates.bottom.initialVisible)
        wrapper.update()
      })
      it('bottom waypoint becomes not visible', () => {
        changeBottom(waypointStates.bottom.becomesNotVisible)
        wrapper.update()
        expect(wrapper.containsMatchingElement(<Placeholder />)).toBe(true)
      })
      it('top waypoint becomes not visible', () => {
        changeTop(waypointStates.top.becomesNotVisible)
        wrapper.update()
        expect(wrapper.containsMatchingElement(<Placeholder />)).toBe(true)
      })
    })
  })
  it('should apply the default top offset', () => {
    const lwrapper = mount(<VirtualContainer {...props} />)
    expect(
      lwrapper
        .find(Waypoint)
        .at(0)
        .children()
        .first()
        .prop('offsetTop'),
    ).toBe('50vh')
  })
  it('should apply the default bottom offset', () => {
    const lwrapper = mount(<VirtualContainer {...props} />)
    expect(
      lwrapper
        .find(Waypoint)
        .at(1)
        .children()
        .first()
        .prop('offsetBottom'),
    ).toBe('50vh')
  })
  it('should apply the custom top offset', () => {
    const lwrapper = mount(<VirtualContainer {...props} offsetTop="20vh" />)
    expect(
      lwrapper
        .find(Waypoint)
        .at(0)
        .children()
        .first()
        .prop('offsetTop'),
    ).toBe('20vh')
  })
  it('should apply the custom bottom offset', () => {
    const lwrapper = mount(<VirtualContainer {...props} offsetBottom="40vh" />)
    expect(
      lwrapper
        .find(Waypoint)
        .at(1)
        .children()
        .first()
        .prop('offsetBottom'),
    ).toBe('40vh')
  })
  it('should assign the scrollableAncestor', () => {
    const lwrapper = mount(
      <VirtualContainer {...props} scrollableAncestor="window" />,
    )
    expect(
      lwrapper
        .find(Waypoint)
        .at(0)
        .prop('scrollableAncestor'),
    ).toBe('window')
    expect(
      lwrapper
        .find(Waypoint)
        .at(1)
        .prop('scrollableAncestor'),
    ).toBe('window')
  })
  it('should render the default element', () => {
    const lwrapper = mount(<VirtualContainer {...props} />)
    expect(
      lwrapper
        .children()
        .first()
        .type(),
    ).toBe('div')
  })
  it('should render the custom element', () => {
    const lwrapper = mount(<VirtualContainer {...props} el="section" />)
    expect(
      lwrapper
        .children()
        .first()
        .type(),
    ).toBe('section')
  })
  it('should render the actual element when optimistic is set', () => {
    const lwrapper = mount(<VirtualContainer {...props} optimistic />)
    expect(lwrapper.containsMatchingElement(<Actual />)).toBe(true)
  })
  it('should render the default style when no className or style provided', () => {
    expect(
      wrapper
        .children()
        .first()
        .prop('style'),
    ).toEqual({ position: 'relative' })
  })
  it('should not render the default style when a className is provided', () => {
    const lwrapper = mount(<VirtualContainer {...props} className="foo" />)
    expect(
      lwrapper
        .children()
        .first()
        .prop('style'),
    ).toBeUndefined()
  })
  it('should render a custom style', () => {
    const lwrapper = mount(
      <VirtualContainer {...props} style={{ position: 'absolute' }} />,
    )
    expect(
      lwrapper
        .children()
        .first()
        .prop('style'),
    ).toEqual({ position: 'absolute' })
  })
  it('should pass down any addition props to the el', () => {
    const additionalProps = {
      foo: 'bar',
      baz: 'qux',
    }
    const lwrapper = mount(<VirtualContainer {...props} {...additionalProps} />)
    expect(
      lwrapper
        .children()
        .first()
        .props(),
    ).toMatchObject(additionalProps)
  })
  it('should not re-render the placeholder when onlyIn is set', () => {
    const lwrapper = shallow(<VirtualContainer {...props} onlyIn />)
    const lchangeTop = lwrapper
      .find(Waypoint)
      .at(0)
      .prop('onPositionChange')
    const lchangeBottom = lwrapper
      .find(Waypoint)
      .at(1)
      .prop('onPositionChange')
    lchangeTop(waypointStates.top.initialVisible)
    lchangeBottom(waypointStates.bottom.initialNotVisible)
    expect(lwrapper.containsMatchingElement(<Placeholder />)).toBe(true)
    lchangeBottom(waypointStates.bottom.becomesVisible)
    lwrapper.update()
    expect(lwrapper.containsMatchingElement(<Actual />)).toBe(true)
    lchangeBottom(waypointStates.bottom.becomesNotVisible)
    lwrapper.update()
    expect(lwrapper.containsMatchingElement(<Actual />)).toBe(true)
  })
  it('calls onChange when the virtualisation changes', () => {
    const onChangeSpy = jest.fn()
    const lwrapper = shallow(
      <VirtualContainer {...props} onChange={onChangeSpy} />,
    )
    const lchangeTop = lwrapper
      .find(Waypoint)
      .at(0)
      .prop('onPositionChange')
    const lchangeBottom = lwrapper
      .find(Waypoint)
      .at(1)
      .prop('onPositionChange')
    lchangeTop(waypointStates.top.initialVisible)
    lchangeBottom(waypointStates.bottom.initialNotVisible)
    expect(onChangeSpy).toHaveBeenCalledTimes(0)
    lchangeBottom(waypointStates.bottom.becomesVisible)
    lwrapper.update()
    expect(onChangeSpy).toHaveBeenCalledTimes(1)
    lchangeBottom(waypointStates.bottom.becomesNotVisible)
    lwrapper.update()
    expect(onChangeSpy).toHaveBeenCalledTimes(2)
  })
})
