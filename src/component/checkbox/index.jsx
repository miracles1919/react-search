/**
 * @Author wj
 * @params id, checked, handle
 * 使用
 * <Checkbox id='xxx' checked={true/false} handle={() => {}} />
 * */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './index.less'

const Checkbox = ({ id, checked, handle, style }) => {

  const onChange = (e) => {
    if (handle) {
      handle(e.target.checked)
    }
  }

  return (
    <div className={styles.checkboxCon} style={style}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id} />
    </div>
  )
}

export default Checkbox

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  handle: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
}
