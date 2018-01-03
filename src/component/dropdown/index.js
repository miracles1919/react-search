import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'
import Trigger from './Trigger'

export default class DropDown extends Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false,
    }
  }

  onHover = () => {
    this.setState({ show: true })
  }

  onBlur = () => {
    this.setState({ show: false })
  }

  onChange = (newState) => {
    this.setState(newState)
    const { onSelect } = this.props
    if (onSelect) {
      onSelect(newState.selected)
    }
  }

  render () {
    const { width, name, list } = this.props

    const { show } = this.state

    const style = {
      width,
    }

    return (
      <div
        className={styles.dropdown}
        style={style}
        onMouseEnter={this.onHover}
        onMouseLeave={this.onBlur}
      >
        <div>
          <div className={styles.select}>{name}</div>
          <Trigger
            list={list}
            show={show}
            onChange={this.onChange}
          />
        </div>


      </div>
    )
  }
}

DropDown.propTypes = {
  width: PropTypes.string,
  paddingLeft: PropTypes.string,
  name: PropTypes.string,
  list: PropTypes.array,
  onSelect: PropTypes.func,
}
