/*
 输入组件
 父级传递属性
 必填
 valueState	 绑定输入值的state键名
 changeState	 修改父级state的方法 changeState(key,value) key为修改state键名 value为state键值
 parentState  父级state对象

 选填
 errState	 标记输入值是否错误的state键名 (添加此属性则激活错误提示 )
 placeholder	 placeholder值
 isDisabled   是否禁用输入框
 errTxt  	 错误提示信息文案
 skin		 适用于b端或新B风格 输入'b'或'c' 主题色不同 默认b端

 使用

 changeState = (key,value)=>{
 var obj = {};
 obj[key] = value
 this.setState(obj)
 }

 <div style={{height:'36px',width:'130px'}}>   //外包层自由控制大小位置
 <Input valueState='userName' changeState={this.changeState} parentState={this.state}
 errState='isErr' placeholder='这里填姓名' isDisabled={false} errTxt='这是错误提示文案'
 skin='b'/>
 </div>
 */

import React from 'react';

import ReactDOM from 'react-dom';

import style from './confirm_modal.css';

export default class Input extends React.Component {
    constructor(props) {
        super(props);


    }


    click_btn = (val)=>{

        this.props.handle(val)
    }

    render() {

        return(
            <div className={style.container} style={this.props.show?{}:{display:"none"}}>

                <div className={style.content}>
                    <p className={style.value} style={this.props.small?{fontSize:this.props.small}:{}}>{this.props.value}</p>
                    <p className={style.smallValue}>{this.props.smallValue}</p>
                    <input value="取消" className={style.btns} type="button" onClick={this.click_btn.bind(this,false)}/>

                    <input value="确定" className={style.btn} type="button" onClick={this.click_btn.bind(this,true)}/>

                    <img src={require('./img/close.png')} className={style.close} onClick={this.click_btn.bind(this,false)}/>

                </div>

            </div>
        )
    }
}




