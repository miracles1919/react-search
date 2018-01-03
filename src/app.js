import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import route from './router/route'
import store from './redux/store'

store.subscribe(() => {
  // 监听state变化
  // console.log(store.getState())
})

const App = () => {
  return (
    <Provider store={store}>
      {route}
    </Provider>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
  // document.body.appendChild(document.createElement('div')),
)

