/**
 * Created by lenovo on 2017/12/21.
 */
import React, { Component } from 'react'
import styles from  './index.less'
import Recommend from './recommend'

export default class BeiLib extends Component{
  constructor(props){
    super(props);
  }
  render(){

    return (
      <div className={styles.beichoo_resource}>
        <Recommend/>
        <div className={styles.childCon}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
