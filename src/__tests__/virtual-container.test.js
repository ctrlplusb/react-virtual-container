/* eslint-disable jsx-a11y/accessible-emoji */

import React from 'react'
import enzyme, { mount as enzymeMount } from 'enzyme'
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
  const Actual = () => <div data-test-id="actual">🐵</div>
  const defaultProps = {
    render: Actual,
  }
  const mount = (props = {}) => {
    const wrapper = enzymeMount(
      <VirtualContainer {...defaultProps} {...props} />,
    )
    const topWaypoint = wrapper.find(Waypoint).at(0)
    const bottomWaypoint = wrapper.find(Waypoint).at(1)
    const changeTop = topWaypoint.prop('onPositionChange')
    const changeBottom = bottomWaypoint.prop('onPositionChange')
    return {
      wrapper,
      topWaypoint,
      bottomWaypoint,
      changeTop,
      changeBottom,
    }
  }
  it('should initially render the placeholder if one was provided', () => {
    const { wrapper } = mount({ placeholder: Placeholder })
    expect(wrapper.containsMatchingElement(<Placeholder />)).toBe(true)
  })
  describe('initial waypoint firing', () => {
    describe('with placeholder', () => {
      it('only one waypoint has fired - show placeholder', () => {
        const { wrapper, changeTop } = mount({ placeholder: Placeholder })
        changeTop(waypointStates.top.initialVisible)
        wrapper.update()
        expect(wrapper.containsMatchingElement(<Placeholder />)).toBe(true)
      })
      it('both waypoints fire, top visible, bottom not visible - show placeholder', () => {
        const { wrapper, changeTop, changeBottom } = mount({
          placeholder: Placeholder,
        })
        changeTop(waypointStates.top.initialVisible)
        changeBottom(waypointStates.bottom.initialNotVisible)
        wrapper.update()
        expect(wrapper.containsMatchingElement(<Placeholder />)).toBe(true)
      })
      it('both waypoints fire, top not visible, bottom visible - show placeholder', () => {
        const { wrapper, changeTop, changeBottom } = mount({
          placeholder: Placeholder,
        })
        changeTop(waypointStates.top.initialNotVisible)
        changeBottom(waypointStates.bottom.initialVisible)
        wrapper.update()
        expect(wrapper.containsMatchingElement(<Placeholder />)).toBe(true)
      })
      it('both waypoints fire, top visible, bottom visible - show actual', () => {
        const { wrapper, changeTop, changeBottom } = mount({
          placeholder: Placeholder,
        })
        changeTop(waypointStates.top.initialVisible)
        changeBottom(waypointStates.bottom.initialVisible)
        wrapper.update()
        expect(wrapper.containsMatchingElement(Actual())).toBe(true)
      })
    })
    describe('without placeholder', () => {
      it('only one waypoint has fired - show nothing', () => {
        const { wrapper, changeTop } = mount()
        changeTop(waypointStates.top.initialVisible)
        wrapper.update()
        expect(wrapper.containsMatchingElement(<Placeholder />)).toBe(false)
        expect(wrapper.containsMatchingElement(Actual())).toBe(false)
      })
      it('both waypoints fire, top visible, bottom not visible - show nothing', () => {
        const { wrapper, changeTop, changeBottom } = mount()
        changeTop(waypointStates.top.initialVisible)
        changeBottom(waypointStates.bottom.initialNotVisible)
        wrapper.update()
        expect(wrapper.containsMatchingElement(<Placeholder />)).toBe(false)
        expect(wrapper.containsMatchingElement(Actual())).toBe(false)
      })
      it('both waypoints fire, top not visible, bottom visible - show nothing', () => {
        const { wrapper, changeTop, changeBottom } = mount()
        changeTop(waypointStates.top.initialNotVisible)
        changeBottom(waypointStates.bottom.initialVisible)
        wrapper.update()
        expect(wrapper.containsMatchingElement(<Placeholder />)).toBe(false)
        expect(wrapper.containsMatchingElement(Actual())).toBe(false)
      })
      it('both waypoints fire, top visible, bottom visible - show actual', () => {
        const { wrapper, changeTop, changeBottom } = mount()
        changeTop(waypointStates.top.initialVisible)
        changeBottom(waypointStates.bottom.initialVisible)
        wrapper.update()
        expect(wrapper.containsMatchingElement(Actual())).toBe(true)
      })
    })
  })
  describe('waypoints updating', () => {
    describe('with placeholder', () => {
      describe('top visible, bottom not visible', () => {
        it('bottom waypoint becomes visible', () => {
          const { wrapper, changeTop, changeBottom } = mount({
            placeholder: Placeholder,
          })
          changeTop(waypointStates.top.initialVisible)
          changeBottom(waypointStates.bottom.initialNotVisible)
          wrapper.update()
          // Change:
          changeBottom(waypointStates.bottom.becomesVisible)
          wrapper.update()
          expect(wrapper.containsMatchingElement(Actual())).toBe(true)
        })
      })
      describe('top not visible, bottom visible', () => {
        it('top waypoint becomes visible', () => {
          const { wrapper, changeTop, changeBottom } = mount({
            placeholder: Placeholder,
          })
          changeTop(waypointStates.top.initialNotVisible)
          wrapper.update()
          changeBottom(waypointStates.bottom.initialVisible)
          wrapper.update()
          // Change:
          changeTop(waypointStates.top.becomesVisible)
          wrapper.update()
          expect(wrapper.containsMatchingElement(Actual())).toBe(true)
        })
      })
      describe('inAndOut, top visible, bottom visible', () => {
        it('bottom waypoint becomes not visible', () => {
          const { wrapper, changeTop, changeBottom } = mount({
            placeholder: Placeholder,
            inAndOut: true,
          })
          changeTop(waypointStates.top.initialVisible)
          changeBottom(waypointStates.bottom.initialVisible)
          wrapper.update()
          // Change
          changeBottom(waypointStates.bottom.becomesNotVisible)
          wrapper.update()
          expect(wrapper.containsMatchingElement(<Placeholder />)).toBe(true)
        })
        it('top waypoint becomes not visible', () => {
          const { wrapper, changeTop, changeBottom } = mount({
            placeholder: Placeholder,
            inAndOut: true,
          })
          changeTop(waypointStates.top.initialVisible)
          changeBottom(waypointStates.bottom.initialVisible)
          wrapper.update()
          // Change:
          changeTop(waypointStates.top.becomesNotVisible)
          wrapper.update()
          expect(wrapper.containsMatchingElement(<Placeholder />)).toBe(true)
        })
      })
    })
    describe('without placeholder', () => {
      it('bottom waypoint becomes visible', () => {
        const { wrapper, changeTop, changeBottom } = mount()
        changeTop(waypointStates.top.initialVisible)
        changeBottom(waypointStates.bottom.initialNotVisible)
        wrapper.update()
        // Change:
        changeBottom(waypointStates.bottom.becomesVisible)
        wrapper.update()
        expect(wrapper.containsMatchingElement(Actual())).toBe(true)
      })
      describe('top not visible, bottom visible', () => {
        it('top waypoint becomes visible', () => {
          const { wrapper, changeTop, changeBottom } = mount()
          changeTop(waypointStates.top.initialNotVisible)
          wrapper.update()
          changeBottom(waypointStates.bottom.initialVisible)
          wrapper.update()
          changeTop(waypointStates.top.becomesVisible)
          wrapper.update()
          expect(wrapper.containsMatchingElement(Actual())).toBe(true)
        })
      })
      describe('inAndOut, top visible, bottom visible', () => {
        it('bottom waypoint becomes not visible', () => {
          const { wrapper, changeTop, changeBottom } = mount({
            inAndOut: true,
          })
          changeTop(waypointStates.top.initialVisible)
          changeBottom(waypointStates.bottom.initialVisible)
          wrapper.update()
          // Change
          changeBottom(waypointStates.bottom.becomesNotVisible)
          wrapper.update()
          expect(wrapper.containsMatchingElement(<Placeholder />)).toBe(false)
          expect(wrapper.containsMatchingElement(Actual())).toBe(false)
        })
        it('top waypoint becomes not visible', () => {
          const { wrapper, changeTop, changeBottom } = mount({
            inAndOut: true,
          })
          changeTop(waypointStates.top.initialVisible)
          changeBottom(waypointStates.bottom.initialVisible)
          wrapper.update()
          // Change:
          changeTop(waypointStates.top.becomesNotVisible)
          wrapper.update()
          expect(wrapper.containsMatchingElement(<Placeholder />)).toBe(false)
          expect(wrapper.containsMatchingElement(Actual())).toBe(false)
        })
      })
    })
  })
  it('should apply the default top offset', () => {
    const { wrapper } = mount()
    expect(
      wrapper
        .find(Waypoint)
        .at(0)
        .children()
        .first()
        .prop('offsetTop'),
    ).toBe('50vh')
  })
  it('should apply the default bottom offset', () => {
    const { wrapper } = mount()
    expect(
      wrapper
        .find(Waypoint)
        .at(1)
        .children()
        .first()
        .prop('offsetBottom'),
    ).toBe('50vh')
  })
  it('should apply the custom top offset', () => {
    const { wrapper } = mount({ offsetTop: '20vh' })
    expect(
      wrapper
        .find(Waypoint)
        .at(0)
        .children()
        .first()
        .prop('offsetTop'),
    ).toBe('20vh')
  })
  it('should apply the custom bottom offset', () => {
    const { wrapper } = mount({ offsetBottom: '40vh' })
    expect(
      wrapper
        .find(Waypoint)
        .at(1)
        .children()
        .first()
        .prop('offsetBottom'),
    ).toBe('40vh')
  })
  it('should assign the scrollableAncestor', () => {
    const { wrapper } = mount({ scrollableAncestor: 'window' })
    expect(
      wrapper
        .find(Waypoint)
        .at(0)
        .prop('scrollableAncestor'),
    ).toBe('window')
    expect(
      wrapper
        .find(Waypoint)
        .at(1)
        .prop('scrollableAncestor'),
    ).toBe('window')
  })
  it('should render the default element', () => {
    const { wrapper } = mount({ scrollableAncestor: 'window' })
    expect(
      wrapper
        .children()
        .first()
        .type(),
    ).toBe('div')
  })
  it('should render the custom element', () => {
    const { wrapper } = mount({ el: 'section' })
    expect(
      wrapper
        .children()
        .first()
        .type(),
    ).toBe('section')
  })
  it('should render the actual element when optimistic is set', () => {
    const { wrapper } = mount({ optimistic: true })
    expect(wrapper.containsMatchingElement(Actual())).toBe(true)
  })
  it('should render the default style when no className or style provided', () => {
    const { wrapper } = mount()
    expect(
      wrapper
        .children()
        .first()
        .prop('style'),
    ).toEqual({ position: 'relative' })
  })
  it('should not render the default style when a className is provided', () => {
    const { wrapper } = mount({ className: 'foo' })
    expect(
      wrapper
        .children()
        .first()
        .prop('style'),
    ).toBeUndefined()
  })
  it('should render a custom style', () => {
    const { wrapper } = mount({ style: { position: 'absolute' } })
    expect(
      wrapper
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
    const { wrapper } = mount(additionalProps)
    expect(
      wrapper
        .children()
        .first()
        .props(),
    ).toMatchObject(additionalProps)
  })
  it('calls onChange when the virtualisation changes', () => {
    const onChangeSpy = jest.fn()
    const { wrapper, changeTop, changeBottom } = mount({
      onChange: onChangeSpy,
    })
    changeTop(waypointStates.top.initialVisible)
    changeBottom(waypointStates.bottom.initialNotVisible)
    expect(onChangeSpy).toHaveBeenCalledTimes(0)
    changeBottom(waypointStates.bottom.becomesVisible)
    wrapper.update()
    expect(onChangeSpy).toHaveBeenCalledTimes(1)
    changeBottom(waypointStates.bottom.becomesNotVisible)
    wrapper.update()
    expect(onChangeSpy).toHaveBeenCalledTimes(2)
  })
})
