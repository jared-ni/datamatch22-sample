/** @jsx jsx */

import { Component } from 'react';
import { jsx, css } from '@emotion/core';

import { headerHeight } from 'constants/Navbar';

const dropdownStyle = css`
  position: absolute;
  top: ${headerHeight}px;
  right: 20px;
  border: 1px solid #e6e6e6;
  background-color: #ffffff;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 4px;

  a {
    color: #1f1717;
  }

  .line {
    margin: 1px 15px;
    border-color: #b1b1b1;
  }
`;

// Renders dropdown component
export default class Dropdown extends Component {
  componentDidMount() {
    // toggle dropdown when mouse pointer is clicked
    document.addEventListener('click', this.props.toggleDropdown);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.props.toggleDropdown);
  }

  render() {
    // this is a general dropdown component to render anything inside the dropdown
    const DropdownComponent = this.props.dropdown;
    return (
      <div css={dropdownStyle}>
        <DropdownComponent />
      </div>
    );
  }
}
