import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from '../common/store/configureStore'
import App from '../common/containers/App'

const preloadedState = window.__PRELOADED_STATE__
console.log('client preloadedState', preloadedState)
const store = configureStore(preloadedState)
// 此时的 document 就是用 server/server.js 中的 fullPage 渲染出来的
// #app 作为根节点
const rootElement = document.getElementById('app')
console.log('rootElement', rootElement.innerHTML)

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  rootElement // 把服务端渲染的 #app 作为根节点，这样相当于给页面一个初始值
)
