import React from 'react'
import PropTypes from 'prop-types'
import styles from './RowItem.less'

const RowItem = ({
  name,
  config,
  children,
  isMulti,
  multiBtn,
}) => {
  let style = {
    background: '#F4F5F6',
    padding: '10px 50px',
    marginBottom: name !== '已选条件' ? '14px' : '2px',
  }

  let initStyle = {
    marginBottom: name !== '已选条件' ? '14px' : '2px',
  }

  return (
    <div className={styles.row} style={isMulti ? style : initStyle}>
      <div className={styles.label}>{`${name}:`}</div>
      <div className={styles.middle}>
        {children}
        {isMulti ?
          <div style={{ marginTop: '15px' }}>
            {multiBtn}
          </div> : null
        }
      </div>
      <div className={styles.config}>
        {
          config ? config.map((item, index) => {
            let { span, show, onClick } = item
            return (
              show ?
                <span
                  className={styles.configSpan}
                  key={`${name}-${index}`}
                  onClick={onClick}
                >
                  {span}
                </span>
                : null
            )
          }) : null
        }
      </div>
    </div>
  )
}

const Button = ({ name, onClick, onBlur, onHover }) => {

  return (
    <button
      className={styles.btn}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onBlur}
    >
      {name}
    </button>
  )
}


RowItem.propTypes = {
  name: PropTypes.string,
  config: PropTypes.array,
  children: PropTypes.object,
  onClick: PropTypes.func,
}

Button.propTypes = {
  name: PropTypes.string,
  onClick: PropTypes.func,
}

module.exports = {
  RowItem,
  Button,
}
