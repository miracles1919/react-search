import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'

/**
 * 下拉组件
 */
const Trigger = ({
  list,
  width = '100%',
  height = 'auto',
  itemHeight = '20px',
  borderColor,
  show,
  maxLenth = 6,
  onChange,
  onHover,
  onThirdChange,
}) => {
  let display = show === false ? 'none' : 'block'

  const ulStyle = {
    display,
    maxHeight: maxLenth * parseInt(itemHeight) + 2,
    width,
    borderColor,
    height,
  }
  const liStyle = {
    height: itemHeight,
  }

  const handleClick = (e) => {
    if (onChange) {
      onChange({ show: false, selected: e.target.innerHTML })
    }
    if (onThirdChange) {
      onThirdChange(e.target.innerHTML)
    }
  }

  const onMouseDown = (e) => {
    e.preventDefault()
  }

  return (
    <ul className={styles.trigger} style={ulStyle}>
      {list.map((item) => {
        return (
          <li
            key={item}
            onClick={handleClick}
            onMouseDown={onMouseDown}
            onMouseEnter={onHover}
            style={liStyle}
            className={styles.item}
          >
            {item}
          </li>
        )
      })}
    </ul>
  )
}

Trigger.propTypes = {
  list: PropTypes.array.isRequired,
  width: PropTypes.string,
  itemHeight: PropTypes.string,
  show: PropTypes.bool,
  maxLenth: PropTypes.number,
  onChange: PropTypes.func,
  onHover: PropTypes.func,
}

export default Trigger
