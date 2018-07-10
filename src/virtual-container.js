import React, { createElement, Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Waypoint from 'react-waypoint'

const defaultStyle = { position: 'relative' }

export default class VirtualContainer extends Component {
  static propTypes = {
    children: PropTypes.func,
    className: PropTypes.string,
    el: PropTypes.string,
    onChange: PropTypes.func,
    offsetBottom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    offsetTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    optimistic: PropTypes.bool,
    onlyIn: PropTypes.bool,
    placeholder: PropTypes.func.isRequired,
    render: PropTypes.func,
    scrollableAncestor: PropTypes.any,
    style: PropTypes.object,
  }

  static defaultProps = {
    children: undefined,
    className: undefined,
    el: 'div',
    offsetBottom: '50vh',
    offsetTop: '50vh',
    optimistic: false,
    onlyIn: false,
    render: undefined,
    scrollableAncestor: undefined,
    style: undefined,
  }

  constructor(props) {
    super(props)
    this.state = {
      virtualized: !props.optimistic,
    }
    this.initialized = false
  }

  componentDidMount() {
    if (process.env.NODE_ENV === 'development') {
      if (this.el && getComputedStyle(this.el).position == null) {
        // eslint-disable-next-line no-console
        console.warn(
          'You must provide a "position" style to your VirtualContainer element',
        )
      }
    }
  }

  componentWillUnmount() {
    this.unmounted = true
  }

  handleWaypointChange = type => ({ currentPosition, previousPosition }) => {
    if (this.unmounted) {
      return
    }

    const waypointIn = type === 'bottom' ? Waypoint.below : Waypoint.above
    const waypointOut = type === 'bottom' ? Waypoint.above : Waypoint.below

    const startsNotVisible =
      previousPosition == null && currentPosition === waypointOut
    const startsVisible =
      previousPosition == null &&
      (currentPosition === waypointIn || currentPosition === Waypoint.inside)
    const isNowVisible =
      previousPosition === waypointOut &&
      (currentPosition === waypointIn || currentPosition === Waypoint.inside)
    const isNowNotVisible =
      previousPosition === Waypoint.inside && currentPosition === waypointOut

    const virtualized =
      startsNotVisible || isNowNotVisible
        ? true
        : startsVisible || isNowVisible
          ? false
          : this.state.virtualized

    if (this.initialized === false) {
      this[type] = virtualized
      if (
        typeof this.top !== 'undefined' &&
        typeof this.bottom !== 'undefined'
      ) {
        this.initialized = true
        this.updateVirtualization(this.top || this.bottom)
      }
    } else {
      this.updateVirtualization(virtualized)
    }
  }

  updateVirtualization = virtualized => {
    if (this.state.virtualized !== virtualized) {
      this.setState({
        virtualized,
      })
      if (this.props.onChange) {
        this.props.onChange(virtualized)
      }
    }
  }

  onBottomWaypointChange = this.handleWaypointChange('bottom')

  onTopWaypointChange = this.handleWaypointChange('top')

  refCb = el => {
    if (el == null) {
      return
    }
    this.el = el
  }

  render() {
    const {
      children,
      className,
      el,
      onlyIn,
      optimistic,
      offsetTop,
      offsetBottom,
      placeholder: Placeholder,
      scrollableAncestor,
      style,
      render,
      ...passThroughProps
    } = this.props
    const { virtualized } = this.state
    const Render = children || render
    if (!Render) {
      throw new Error('Must provide a children or render function')
    }

    const stopTracking = this.initialized && onlyIn

    return createElement(
      el,
      {
        ...passThroughProps,
        className,
        style: style != null ? style : className ? undefined : defaultStyle,
        ref: this.refCb,
      },
      <Fragment>
        {!virtualized || stopTracking ? <Render /> : <Placeholder />}
        {stopTracking ? null : (
          <Waypoint
            onPositionChange={this.onTopWaypointChange}
            scrollableAncestor={scrollableAncestor}
          >
            <WaypointTarget top offsetTop={offsetTop} />
          </Waypoint>
        )}
        {stopTracking ? null : (
          <Waypoint
            onPositionChange={this.onBottomWaypointChange}
            scrollableAncestor={scrollableAncestor}
          >
            <WaypointTarget offsetBottom={offsetBottom} />
          </Waypoint>
        )}
      </Fragment>,
    )
  }
}

const WaypointTarget = ({ innerRef, offsetBottom, offsetTop, top }) => (
  <div
    style={{
      backgroundColor: 'red',
      [top ? 'top' : 'bottom']: 0,
      height: '1px',
      left: 0,
      position: 'absolute',
      transform: `translateY(${top ? `-${offsetTop}` : offsetBottom})`,
      width: '1px',
    }}
    ref={innerRef}
  >
    &nbsp;
  </div>
)

WaypointTarget.propTypes = {
  innerRef: PropTypes.any,
  offsetBottom: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  offsetTop: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  top: PropTypes.bool,
}

WaypointTarget.defaultProps = {
  innerRef: undefined,
  offsetBottom: 0,
  offsetTop: 0,
  top: false,
}
