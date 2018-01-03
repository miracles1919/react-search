import React, { Component } from 'react'

export default class Test1 extends Component {

  render () {
    return (
      <div>
        test 1
        <button onClick={this.onClick}>login</button>
      </div>
    )
  }
}
