import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import cs from 'classnames'
import { addSearchKey } from 'action/myTalent'

import styles from  './index.less'

const navObj = [
  {
    name: '本地简历',
    path: '/myTalents'
  },
  {
    name: '人才跟进',
    path: '/myTalents/talenFollow'
  },
  {
    name: '职位架构',
    path: '/myTalents/jobMana'
  },
  {
    name: '上传简历',
    path: '/myTalents/uploadResume'
  }
];

class Header extends Component{
  constructor(props){
    super(props);
    const path = props.location.pathname;
    let index;
    for(let i = 0; i < navObj.length; i++){
      if(navObj[i].path === path){
        index = i;
      }
    }
    this.state = {
      activeIndex: index || 0, // 激活状态的序列
      searchInput: '', // 搜索框
    };
  }
  componentWillReceiveProps(nextProps){
    const path = nextProps.location.pathname;
    let index;
    for(let i = 0; i < navObj.length; i++){
      if(navObj[i].path === path){
        index = i;
      }
    }
    this.setState({activeIndex: index})
  }
  render(){
    const { activeIndex, searchInput } = this.state;
    const { local_resume_num, talent_up_resume_num, p_job_list_num  } = this.props.titleNum;
    return (
      <div className={styles.libResource}>
        <div className={styles.btnsGroup}>
          {
            navObj.map((item, index) => (
              <Link to={item.path} key={index}
                    className={cs({[styles.btn]: true, [styles.active]: index === activeIndex})}
                    onClick={() => {this.setState({activeIndex: index})}}
              >
              { item.name }{
                index === 0 ? `(${local_resume_num})` :
                  index === 1 ? `(${talent_up_resume_num})` :
                    index === 2 ? `(${p_job_list_num})` : null
              }
                {
                  item.mark && <i className={styles.mark}>{ item.mark }</i>
                }
              </Link>
            ))
          }
        </div>
        {
          (activeIndex === 0 || activeIndex === 1) ?
            <div className={styles.searchGroup}>
              <div className={styles.inputCon}>
                <input type="text" className={styles.searchInput}
                       placeholder="请输入姓名/手机号码" value={searchInput}
                       onChange={e => {
                         const value = e.target.value;
                         this.setState({searchInput: value});
                       }}
                />
                <span className={styles.searchBtn} onClick={() => {
                  const { dispatch } = this.props;
                  dispatch(addSearchKey(this.state.searchInput))
                }}><img className={styles.search0} src={require('./img/search0.png')} alt=""/><img className={styles.search1} src={require('./img/search1.png')} alt=""/></span>
              </div>
            </div> : null
        }
        
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    localTalentSearchKey: state.localTalentSearchKey.search_key,
    titleNum: state.localTalentSearchKey.titleNum
  }
}

export default connect(mapStateToProps)(Header)
