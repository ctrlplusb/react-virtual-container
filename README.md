# react-virtual-container

Optimise your React apps by only rendering your components when they are in proximity to the viewport.


[![npm](https://img.shields.io/npm/v/react-virtual-container.svg?style=flat-square)](http://npm.im/react-virtual-container)
[![MIT License](https://img.shields.io/npm/l/react-virtual-container.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![Travis](https://img.shields.io/travis/ctrlplusb/react-virtual-container.svg?style=flat-square)](https://travis-ci.org/ctrlplusb/react-virtual-container)
[![Codecov](https://img.shields.io/codecov/c/github/ctrlplusb/react-virtual-container.svg?style=flat-square)](https://codecov.io/github/ctrlplusb/react-virtual-container)

## Table of Contents

  - [Introduction](#introduction)
  - [Example](#example)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Configuration](#configuration)

## Introduction

This library provides you with the ability to create a "virtual container", where it's children will only get rendered if the "virtual container" is within a given proximity of the viewport. This provides you with a nice mechanism by which to lazy load images or "heavy" components.

## Example

In the example below you will note two virtual containers.  As the viewport moves down the page it triggers each virtual container causing the associated component to render and replace their placeholder. You will additionally note that as the viewport moves away from the virtual containers it causes the components to be replaced by their placeholders - this is default behaviour however it can be disabled via the `onlyIn` prop.

<p align="center">
  <img width="450" height="498" src="https://i.imgur.com/q9e3W9I.gif">
</p>

## Installation

```bash
yarn add react-virtual-container
```

Or, if you prefer npm:

```bash
npm install react-virtual-container
```

### Usage

This library follows the "render prop" pattern, allowing you to specify a `render` or `children` prop. The "render prop" will be called and have its result rendered when the virtual container is within proximity of the viewport.

By default the virtual container needs to be within "50vh" proximity of the viewport. This is configurable - see [configuration](#configuration). You could set it to a pixel value or any other standard CSS unit value.

In addition to the "render prop" a useful prop is `placeholder`; it allows you to provide a  component which will be rendered by the virtual container until it is within proximity of the viewport. This allows you to avoid layout that jumps when the virtual container activates. The `placeholder` prop is optional, however, we do recommend using it where you expect content jumping to occur.

```jsx
import React from 'react'
import VirtualContainer from 'react-virtual-container'

const Placeholder = () => <div>🙈</div>

export default function MyVirtualisedComponent() {
  return (
    <VirtualContainer placeholder={Placeholder}>
      {() => <div>🐵</div>}
    </VirtualContainer>
  )
}
```

### Configuration

The virtual container component accepts the following props:

  - `children` (_PropTypes.func_)

    The "render prop" responsible for returning the elements you wish to render should the virtual container come within proximity of the viewport. You can alternatively use the `render` prop.

  - `className` (_PropTypes.string_, optional)

    A class to apply to the virtual container element.

    > Note: when providing a style for your virtual container element you MUST ensure that you have a "position" value set. This is because we use a set of absolutely positioned elements by which to track the proximity.

  - `el` (_PropTypes.string_, *default*: "div")

    The type of element that the virtual container should render as.

    > Your render prop results will render as children to this element.

  - `offsetBottom` (_PropTypes.oneOfType([PropTypes.string, PropTypes.number])_, *default*: "50vh")

    The proximity value that will trigger rendering of your "render prop" when the virtual container is within the specified distance relative to the bottom of the view port.

  - `offsetTop` (_PropTypes.oneOfType([PropTypes.string, PropTypes.number])_, *default*: "50vh")

    The proximity value that will trigger rendering of your "render prop" when the virtual container is within the specified distance relative to the top of the view port.

  - `onChange` (_PropTypes.func_)

    If provided, this callback function will be called any time the virtualisation value changes. It recieves a single boolean parameter, being `true` when virtualisation is active, and `false` when it is not.

  - `onlyIn` (_PropTypes.bool_, *default*: false)

    By default the virtual container will switch back to rendering your placeholder if your component goes out of proximity of the viewport. This can be especially helpful in keeping resource usage down, however, may not always be required. Set this flag to disable this feature.

  - `optimistic` (_PropTypes.bool_, *default*: false)

    If you set this then the placeholder will be rendered before the "render prop" whilst we determine if the virtual container is within proximity of the viewport. You should almost never use this.

  - `placeholder` (_PropTypes.func_)

    A placeholder component/function that will be rendered when the virtual container is not within proximity of the viewport. Useful to avoid your page jumping with new content being inserted (especially when scrolling from the bottom of the page up).

  - `render` (_PropTypes.func_)

    The "render prop" responsible for returning the elements you wish to render should the virtual container come within proximity of the viewport. You can alternatively use the `children` prop.

  - `scrollableAncestor` (_PropTypes.any_)

    When tracking proximity we use scroll positioning. Depending on the structure of your DOM you may want to explicitly define the element by which your scrolling is bound. For example this could be a value of "window" or a direct reference to a DOM node.

  - `style` (_PropTypes.object_)

    A style to provide to the virtual container element.

    > Note: when providing a style for your virtual container element you MUST ensure that you have a "position" value set. This is because we use a set of absolutely positioned elements by which to track the proximity.
