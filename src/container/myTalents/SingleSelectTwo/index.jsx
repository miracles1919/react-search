/*  单选下拉框
*   <SingleSelect
*       changEvent={this.changEvent.bind(this,'phone')}
*       listData ={this.state.listData}
*       defaultInfo='默认值'
*       clickFun={this.clickCallback}
*       stateErr={this.state.phoneErr}
*       skin = 'new'
*   />
*
* 必选
*   defaultInfo 默认值
*   listData    列表数据
*   changEvent  改变父级state方法
*
* 可选
*   clickFun    点击回调
*   stateErr    控制错误提示显示的state
*   onMouseEnter 鼠标进入列表选项的事件回调
*   skin        皮肤
*
* */
import React from 'react';
import newStyle from './Select.css';
import { HOST ,fSetCookieMes } from '../../../utils/common';
import PropTypes from 'prop-types';

import { Scrollbars } from 'react-custom-scrollbars';

import QueueAnim from 'rc-queue-anim';

export default class SingleSelectTwo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isUlShow : false

        }
    }
    //点击向下箭头
    listDown =(e)=> {
        e.stopPropagation();
        this.setState({
            isUlShow : !this.state.isUlShow
        })
    }
    addNewJob = (e)=>{
      fSetCookieMes('newPublish',5);
        e.stopPropagation();
        console.log(window.location.origin+'/initPublish.html');
        window.open(window.location.origin+'/initPublish.html');
    }
    liPick =(item,index,e)=> {
        this.props.changEvent(item,e)
        e.stopPropagation();
        this.setState({
            isUlShow : false
        })
        if(this.props.clickFun){
            this.props.clickFun(index)
        }
    }

    creatList =()=> {
            let lis = null;
            if(this.props.listData){
                    lis = this.props.listData.map(function(item,index){
                        return(
                            <li key={item+index} onClick={this.liPick.bind(this,item,index)}>{item.name}</li>
                        )
                    }.bind(this))
                    return lis
            }
    }

    _Blur =(e)=>{
        //失去焦点隐藏
        let currentTarget = e.currentTarget;
        let self = this;
        if (!currentTarget.contains(document.activeElement)) {
            self.setState({isUlShow:false})
        }
    }

    durationFunc = (e) => {
      if (e.key === '3') {
        return 350;
      }
      if (e.key === '5') {
        return 350;
      }
      return 250;
    }

    render() {
        let _style = null;
        _style = newStyle;
        let fontSize = this.props.fontSize?this.props.fontSize:'14px';
        return(
            <div className={ this.state.isUlShow?_style.single_SelectHover:_style.single_Select}
                  tabIndex="0" onBlur={this._Blur} >
                 <div onClick={this.listDown} className={_style.singleBox}>
                    <span className={_style.single_left}
                            style={(this.props.defaultInfo=='请选择所属职位，再上传简历') ? {color:'#C4CED8',fontSize: fontSize}:{color:'#333',fontSize:fontSize}}>
                            {this.props.defaultInfo}
                    </span>
                    <span className={_style.single_down}  style={this.state.isUlShow?{transform:'rotate(180deg)'}:{transform:'rotate(0deg)'}} ></span>
                    <ul className={this.state.isUlShow?_style.single_showData:''}>
                        <Scrollbars style={{ width: '100%', height: '100%' }}>
                            <QueueAnim
                                interval={60}
                                leaveReverse
                                duration={this.durationFunc}
                            >
                                { this.state.isUlShow?
                                        this.creatList()
                                    :null}

                            </QueueAnim>
                        </Scrollbars>
                        <div onClick={this.addNewJob} style={ this.state.isUlShow?{'display':'block'}:{'display':'none'}} className={_style.fabuzhiwei}><b className={_style.addJia}></b> <span>新增职位</span></div>
                    </ul>


                </div>
                <QueueAnim
                    ease={['easeInQuart']}
                    className ={_style.animation_box}
                >
                    { this.props.stateErr?
                        [<div key='1' className={_style.InputWarningInsideBox}>
                            <div className={_style.InputErrIcon}>
                                <span className={_style.InputErrIconBtm}></span>
                                <span className={_style.InputErrIconTop}></span>
                            </div>
                            <span style={{marginLeft:this.props.fixStyle?this.props.fixStyle:'20px'}}>{this.props.errTxt?this.props.errTxt:'请补充正确的信息'}</span>
                        </div>]
                        :null}

                </QueueAnim>
            </div>
        )
    }
}
SingleSelectTwo.propTypes = {
    listData: React.PropTypes.array.isRequired
};
