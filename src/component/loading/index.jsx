import React from 'react';
import style from './index.less';

const Loading = () => (
  <div className={style.loading}>
    <span className={style.part1}></span>
    <span className={style.part2}></span>
    <span className={style.part3}></span>
  </div>
)

export default Loading
