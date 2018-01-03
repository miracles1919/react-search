// 搜索框
export const ADD_SEARCH_KEY = 'ADD_SEARCH_KEY'

export const addSearchKey = search_key => {
  return {
    type: ADD_SEARCH_KEY,
    payload: search_key
  }
}

// 小标题后面的数字
export const CHANGE_TITLE_NUM = 'CHANGE_TITLE_NUM'

export const changeTitleNum = json => {
  return {
    type: CHANGE_TITLE_NUM,
    payload: json
  }
}
