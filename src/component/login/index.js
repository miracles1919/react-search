import React, { Component } from 'react'
import { login } from 'service/login'
import { connect } from 'react-redux'
import { changeState } from '../../redux/action/hawkeye'
import hawkeye from '../../redux/reducer/hawkeye'

class Login extends Component {

  handleClick = () => {
    // login({
    //   account: 'admin@fanfandata.com',
    //   password: '123456',
    // }).then(result => {
    //   const { success, data, message } = result
    //   if (success) {
    //     // api调用成功
    //     console.log(data)
    //   } else {
    //     // api调用失败
    //     console.log(message)
    //   }
    // })


    const { dispatch } = this.props
    dispatch(changeState({test: 111}))
  }

  render () {
    console.log(this.props)
    return (
      <div>
        login1231
        <button onClick={this.handleClick}>11</button>
      </div>
    )
  }
}

// const mapStateToprops = state => ({
//   test: state.test,
// })
//
const mapStateToprops = state => {
  console.log('sta', state)
  return { test: state.test }
}


export default connect(mapStateToprops)(Login)

// export default Login
