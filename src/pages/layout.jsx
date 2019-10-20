import React, { Component } from 'react';

export default class LayoutPagae extends Component {
  state = {
    collapsed: false,
    user: 'Liz',
  };
  render() {
    return (
      <div>我是布局</div>
    );
  }
}