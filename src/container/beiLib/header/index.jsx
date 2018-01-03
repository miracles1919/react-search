import React, { Component } from 'react'
import { Link } from 'react-router'
import cs from 'classnames'

import { fetchDailyResumes, fetchTalentResumes, changeParams } from 'action/dailyRecommend'

import styles from  './index.less'

const navObj = [
  {
    name: '每日推荐',
    path: '/beiLib',
    index: 0
  },
  {
    name: '辈出鹰眼',
    path: '/beiLib/hawkeye',
    index: 1
  },
  {
    name: '人才期刊',
    path: '/beiLib/talent',
    mark: '精英',
    index: 2
  }
];

export default class Header extends Component{
  constructor(props){
    super(props);
    const path = props.location.pathname;
    let index;
    for(let i = 0; i < navObj.length; i++){
      if(navObj[i].path === path){
        index = navObj[i].index;
      }
    }
    this.state = {
      activeIndex: index || 0, // 激活状态的序列
      searchInput: '', // 搜索框
      path, // 路径
      canBeiTalent: props.userInfo.can_beichoo_super_talent, // 人才期刊是否需要出现简历搜索
    };
  }
  componentWillReceiveProps(nextProps){
    const path = nextProps.location.pathname;
    let index;
    for(let i = 0; i < navObj.length; i++){
      if(navObj[i].path === path){
        index = navObj[i].index;
      }
    }
    this.setState({
      path,
      activeIndex: index,
      canBeiTalent: nextProps.userInfo.can_beichoo_super_talent
    });
  }
  render(){
    const { activeIndex, searchInput, path, canBeiTalent } = this.state;
    const { dispatch, resumeParams } = this.props;
    return (
      <div className={styles.libResource}>
        <div className={styles.btnsGroup}>
          {
            navObj.map((item, index) => (
              <Link to={item.path} key={index}
                    className={cs({[styles.btn]: true, [styles.active]: index === activeIndex})}
                    onClick={() => {this.setState({activeIndex: index, searchInput: ''}, () => {
                      const { dispatch } = this.props;
                      dispatch(changeParams({search_key: ''}))
                    })}}
              >
              { item.name }
                {
                  item.mark && <i className={styles.mark}>{ item.mark }</i>
                }
              </Link>
            ))
          }
        </div>
        {
          activeIndex === 1 ?
            <div className={styles.addCareerCon}>
              <span className={styles.addCareer} onClick={() => {
                window.open(`${location.origin}/initPublish.html`)
              }}>新增职位</span>
            </div> :
            (activeIndex === 0 || (activeIndex === 2 && canBeiTalent)) ?
            <div className={styles.searchGroup}>
              <div className={styles.inputCon}>
                <input type="text" className={styles.searchInput}
                       placeholder="请输入关键字搜索" value={searchInput}
                       onChange={e => {
                         const value = e.target.value;
                         this.setState({searchInput: value});
                       }}
                />
                {
                  searchInput && <span className={styles.close} onClick={() => {
                    this.setState({searchInput: ''}, () => {
                      const { dispatch, resumeParams } = this.props;
                      if(path === navObj[0].path){
                        dispatch(fetchDailyResumes({
                          ...resumeParams,
                          search_key: ''
                        }));
                      }else if(path === navObj[2].path){
                        dispatch(fetchTalentResumes({
                          search_key: '',
                          page: 1
                        }))
                      }
                      
                    });
                  }}><img src={require('./imgs/close.png')} /></span>
                }
                <span className={styles.searchBtn} onClick={() => {
                  if(path === navObj[0].path){
                    dispatch(fetchDailyResumes({
                      ...resumeParams,
                      search_key: searchInput
                    }));
                  }else if(path === navObj[2].path){
                    dispatch(fetchTalentResumes({
                      search_key: searchInput,
                      page: 1
                    }))
                  }
                }}>
              <img src={require('./imgs/search.png')}/>
            </span>
              </div>
            </div> : null
        }
        
      </div>
    )
  }
}
