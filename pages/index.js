import React from 'react'
import Link from 'next/link'
import { Button } from 'antd'
import { inject } from 'mobx-react'

@inject('Gobal')
class Index extends React.Component {

  render() {
    const { test } = this.props.Gobal
    return (
      <div>
        <p>Welcome to next.js! mobx: {test}</p>
        <Link prefetch href='/test/linktest'>
          <Button type='primary'>test link</Button>
        </Link>
      </div>
    )
  }
}

export default Index
