import React from 'react'
import './style.less'
import Link from 'next/link'

class NotFound extends React.Component {

  render() {
    return (
      <div className='wrapper'>
        <div className='container'>
          <div className='img bgImg img404'></div>
          <p className='tips'>抱歉！您访问的页面不存在，点此 <Link className='back' href='/' ><a>返回首页</a></Link></p>
        </div>
      </div>
    )
  }

}

export default NotFound