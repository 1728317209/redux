import compose from './compose'

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */

// [middleware 源码解读](https://note.youdao.com/s/8U6AbQpv)
export default function applyMiddleware(...middlewares) {
  /**
   * applyMiddleware 返回的这个方法，作为 enhancer 在 [createStore.js](https://github.com/1728317209/redux/blob/ys/feature-read-code/src/createStore.js#L42) 中调用 `enhancer(createStore)(reducer, preloadedState)`  
   * createStore 就是 [createStore.js](https://github.com/1728317209/redux/blob/ys/feature-read-code/src/createStore.js#L42) 中的 createStore 方法
   */
  return createStore => (...args) => {
    const store = createStore(...args)
    let dispatch = () => {
      throw new Error(
        `Dispatching while constructing your middleware is not allowed. ` +
          `Other middleware would not be applied to this dispatch.`
      )
    }

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    // 用 middlewares 封装 store.dispatch 生成一个新的 store.dispatch
    dispatch = compose(...chain)(store.dispatch)

    // 强化 store 其实就是**用封装后的 dispatch 替换原来的 dispatch**
    return {
      ...store,
      dispatch
    }
  }
}
