import React, { Component } from 'react'
import PropTypes from 'prop-types'

import style from './index.less'

export default class Confirm extends Component{
  
  render(){
    
    const { handle, show } = this.props;
    
    return (
      <div className={style.confirm} style={{display: show ? 'block' : 'none'}} onClick={() => {handle && handle()}}>
        
        <div className={style.confirmCon} onClick={e => {
          if(e.preventBubble){
            e.preventBubble();
          }else{
            e.stopPropagation();
          }
        }}>
          
          <div className={style.closeCon}>
            
            <span onClick={() => {handle && handle()}}>
              
              <img src={require('./imgs/modal_x.png')} />
              
            </span>
            
          </div>
          
          <div className={style.container}>
            {this.props.children}
          </div>
          
        </div>
        
      </div>
    )
  }
}

Confirm.propTypes = {
  handle: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
}
