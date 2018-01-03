/**
 * 分页
 * @Author wj
 * 使用
 * <Pagination currentPage = {1} totalPages = { 100 } pageCallback = { your handle function } />
 * @params
 * currentPage: 当前页，默认应该是第一页
 * totalPages： 所有的分页总数
 * pageCallback： 分页的回调函数
 * */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';

import style from './index.css';

export default class Pagination extends Component{
  constructor(props){
    super(props);
    this.state = {
      currentPage: props.currentPage || 1, // 默认是第一个
      totalPages: props.totalPages || 0, // 总共的分页数据
      measure: 10, // 度量标准
      pages: [], // 用于存放生成的页码的数组
      inputVal: '', // 输入框的值
    };
    this.numToArr = this.numToArr.bind(this); // 由当前选择的页码生成新的分页数组
    this.pagesGenerator = this.pagesGenerator.bind(this); // 生成页码
    this.changeCurrentPage = this.changeCurrentPage.bind(this); // 改变当前页
    this.changeInpuVal = this.changeInpuVal.bind(this); // 改变输入框中的值
    this.plusOrMinus = this.plusOrMinus.bind(this); // 点击上一页或者下一页
    this.clearInputVal = this.clearInputVal.bind(this); // 点击上一页，下一页，按钮页时清空input中的值
  }
  componentDidMount(){
    this.pagesGenerator(this.state.totalPages);
  }
  componentWillReceiveProps(nextProps){
    const { totalPages, currentPage } = nextProps;
    /*if(this.state.totalPages !== totalPages){
      this.setState({
        totalPages,
        currentPage: 1
      }, () => {
        this.pagesGenerator(totalPages)
      })
    }*/
    this.setState({
      totalPages,
      currentPage: currentPage
    }, () => {
      this.pagesGenerator(totalPages)
    })
  }
  pagesGenerator(totalPages){
    const { currentPage, measure } = this.state;
    const { numToArr } = this;
    let arr ;
    if(totalPages <= measure){ // 当页码的总数不足10页时
      arr = numToArr(totalPages);
    }else{ // 页码总数超过10
      if(currentPage <= 6){ // 前6页
        arr = numToArr(10);
      }else if(currentPage + 4 > totalPages){ // 当前页右边页数已经不足4页，已经不满足居中要求
        arr = numToArr(totalPages);
      }else{ // 实现当前页的居中
        arr = numToArr(currentPage + 4);
      }
    }
    this.setState({pages: arr});
  }
  numToArr(nums){
    const { measure } = this.state;
    const arr = [];
    let i = 1;
    let num = nums;
    while((i <= measure) && num >= 1){
      arr.unshift(num);
      i++;
      num--;
    }
    return arr;
  }
  changeCurrentPage(currentPage){
    const { totalPages } = this.state;
    const { pageCallback } = this.props;
    if(currentPage > totalPages){
      currentPage = totalPages;
    }
    if(currentPage < 1){
      currentPage = 1;
    }
    this.setState({currentPage}, () => {
      pageCallback && pageCallback(currentPage);
      this.pagesGenerator(this.state.totalPages);
    });
  }
  changeInpuVal(e){
    let val = e.target.value.trim();
    if(val && val !== '0'){ // 防止第一个数输入的是0
      if(isNaN(val)){ // 输入的不是数字

      }else{ // 输入的是数字
        val = parseInt(val);
        this.setState({inputVal: val}, () => {
          this.changeCurrentPage(this.state.inputVal);
        });
      }
    }else{
      this.setState({inputVal: ''});
    }
  }
  plusOrMinus(type){
    let { currentPage, totalPages } = this.state;
    this.clearInputVal();
    if(type === 'prev' && currentPage > 1){
      this.changeCurrentPage(--currentPage);
    }
    if(type === 'next' && currentPage < totalPages){
      this.changeCurrentPage(++currentPage);
    }
  }
  clearInputVal(){
    this.setState({inputVal: ''});
  }
  render(){
    const { currentPage, inputVal, pages, totalPages } = this.state;
    const { changeInpuVal, plusOrMinus, changeCurrentPage, clearInputVal } = this;
    return (
      <div className={style.pagination}>
        <div className={style.pages}>
          <ul>
            <li onClick={() => {plusOrMinus('prev')}}>上一页</li>
            {
              pages.map((item,index) => (
                <li key={`_${item}${index}`} onClick={() => {
                  clearInputVal();
                  changeCurrentPage(item)
                }}
                    className={cs({[style.active]: item === currentPage})}>{ item }</li>
              ))
            }
            <li onClick={() => {plusOrMinus('next')}}>下一页</li>
          </ul>
        </div>
        <div className={style.totals}>
          共 { totalPages } 页
        </div>
        <div className={style.codeIn}>
          跳转 至
          <input type="text" value={inputVal} onChange={changeInpuVal} className={style.inputIn} />
          页
        </div>
      </div>
    );
  }
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  pageCallback: PropTypes.func.isRequired
};
