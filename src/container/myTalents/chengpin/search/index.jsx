import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './index.css'

export default class serchComponent extends Component {

  static propTypes = {

  };

  constructor(props) {
    super(props);

    this.state = {
    onFocus:false,
    };
  }
  focus=()=>{
    this.setState({
      focus:true ,
    });
  }
  blur=()=>{
    this.setState({
      focus:false ,
    });
  }
  render() {
    const focus=this.state.focus
    ?  <div className={style.serch}>
          <div className={style.searchInner}>
              <div className={style.hotSearch}>
                  热门搜索
              </div>
              <div className={style.LineList}>
                  <span className={style.jobTextTitle}>岗位：</span>
                  <span className={style.jobText}>用户运营</span>
                  <span className={style.jobText}>JAVA</span>
                  <span className={style.jobText}>UI</span>
                  <span className={style.jobText}>设计师</span>
                  <span className={style.jobText}>PHP</span>
                  <span className={style.jobText}>销售经理</span>
                  <span className={style.jobText}>产品经理</span>
                  <span className={style.jobText}>C++</span>
                  <span className={style.jobText}>内容运营</span>
              </div>
              <div className={style.LineList}>
                  <span className={style.jobTextTitle}>公司：</span>
                  <span className={style.jobText}>阿里巴巴变</span>
                  <span className={style.jobText}>腾讯</span>
                  <span className={style.jobText}>百度</span>
                  <span className={style.jobText}>网易</span>
                  <span className={style.jobText}>华为</span>
                  <span className={style.jobText}>京东</span>
                  <span className={style.jobText}>新浪</span>
                  <span className={style.jobText}>携程</span>
              </div>
          </div>
      </div>
      :''
    return (
      <div className={style.serchWrap}>
          <div style={{textAlign: 'center'}}>
            <span>
              <input onBlur={this.blur} onFocus={this.focus} type="text"  className={style.serchIput} placeholder="请输入岗位/公司/高校名称等" />
              <span className={style.serchButton}>搜索</span>
            </span>
          </div>
        {
          focus
        }
      </div>
    );
  }
}
