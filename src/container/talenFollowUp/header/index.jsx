import React, { Component } from 'react'
import { Link } from 'react-router'
import cs from 'classnames'

import styles from  './index.less'

const navObj = [
  {
    name: '本地简历(400)',
    path: '/talenFollowUp'
  },
  {
    name: '人才跟进(100)',
    path: '/talenFollowUp',
    // path: ''
  },
  {
    name: '职位架构(10)',
    // path: '/beiLib/talent',
    path: '/talenFollowUp',
    // mark: '精英'
  },
  {
    name: '上传简历',
    // path: '/beiLib',
    path: '/talenFollowUp'
  }
];

export default class Header extends Component{
  constructor(props){
    super(props);
    const path = props.location.pathname;
    let index;
    for(let i = 0; i < navObj.length; i++){
      if(navObj.path === path){
        index = i;
        return;
      }
    }
    this.state = {
      activeIndex: index || 0, // 激活状态的序列
      searchInput: '', // 搜索框
    };
    console.log(props);
  }
  render(){
    const { activeIndex, searchInput } = this.state;
    return (
      <div className={styles.libResource}>
        <div className={styles.btnsGroup}>
          {
            navObj.map((item, index) => (
              <Link to={item.path} key={index}
                    className={cs({[styles.btn]: true, [styles.active]: index === activeIndex})}
                    onClick={() => {this.setState({activeIndex: index})}}
              >
              { item.name }
                {
                  item.mark && <i className={styles.mark}>{ item.mark }</i>
                }
              </Link>
            ))
          }
        </div>
        <div className={styles.searchGroup}>
          <div className={styles.inputCon}>
            <input type="text" className={styles.searchInput}
                   placeholder="请输入姓名/手机号" value={searchInput}
                   onChange={e => {
                     const value = e.target.value;
                     this.setState({searchInput: value});
                   }}
            />
            <span className={styles.searchBtn}>search</span>
          </div>
        </div>
      </div>
    )
  }
}
