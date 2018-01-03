import React, { Component } from 'react'
import styles from  './index.less'

import Header from './header'

export default class BeiLib extends Component{
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className={styles.beichoo_resource}>
        <Header location={this.props.location} />
        <div className={styles.childCon}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
