import React, { Component } from 'react';
import ReactLoading from 'react-loading';

export default class Loading extends Component {
  render() {
    const { color = 'black', size, type } = this.props;
    return (
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          ...this.props.style,
        }}
      >
        <ReactLoading
          className="Loading"
          color={color}
          height={size}
          type={type || 'bubbles'}
          width={size}
        />
      </div>
    );
  }
}
