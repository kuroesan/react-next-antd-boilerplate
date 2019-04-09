import App, { Container } from 'next/app'
import stores from '../store'
import { configure } from 'mobx'
import { Provider } from 'mobx-react'

configure({ enforceActions: 'always' })


export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps, router } = this.props
    return (
      <Container>
        <Provider {...stores}>
          <Component {...pageProps} router={router} />
        </Provider>
      </Container>)
  }
}