/**
 * Created by lenovo on 2017/12/21.
 */
import React, { Component } from 'react'
import styles from  './index.less'

import Header from './header'
import Recommend from './recommend'

export default class BeiLib extends Component{
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className={styles.beichoo_resource}>
        {/*<Header/>*/}
        <Header location={this.props.location} />
        <Recommend/>
        <div className={styles.childCon}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
