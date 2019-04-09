import React from 'react'
import './style.less'
import Link from 'next/link'

class ServerError extends React.Component {
  render() {

    return (
      <div className='wrapper'>
        <div className='container'>
          <div className='img bgImg img404'></div>
          <p className='tips'>抱歉！服务器开小差了，点此 <Link className='back' href='/' ><a>返回首页</a></Link></p>
        </div>
      </div>
    )
  }

}

export default ServerError