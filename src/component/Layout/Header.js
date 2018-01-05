import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import styles from './Header.less'

const Header = ({ children }) => {
  const nav = [{
    name: '工作台',
    link: 'work',
  }, {
    name: '辈出人才库',
    link: 'beiLib',
  }, {
    name: '我的人才库',
    link: 'talLib',
  }, {
    name: '服务商店',
    link: 'store',
  }]

  return (
    <div style={{ paddingTop: '64px' }}>
      <div className={styles.header}>
        <div className={styles.wrap}>
          <img className={styles.logo} src={require('./img/logo.png')} alt="logo" />
          <ul className={styles.nav}>
            {
              nav.map((item, index) => {
                return (
                  <Link
                    className={styles.navLi}
                    key={`li${index}`}
                    to={item.link}
                  >
                    {item.name}
                  </Link>
                )
              })
            }
          </ul>
        </div>

      </div>
      <div>
        {children}
      </div>

    </div>
  )
}

Header.propTypes = {
  children: PropTypes.object,
}

export default Header

