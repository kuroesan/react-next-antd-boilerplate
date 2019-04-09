import { Fragment } from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'
import stores from '../store'
import { configure } from 'mobx'
import { Provider } from 'mobx-react'
import Helmet from 'react-helmet'
import { RouterTitle } from '../config/routerConfig'

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
      <Fragment>
        <Helmet
          title={`${RouterTitle[router.pathname]} | React + Next + Antd Boilerpalte`}
        />
        <Head>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta charSet='utf-8' />
          <link rel='shortcut icon' href='/static/favicon.ico' type='image/ico' />
        </Head>
        <Container>
          <Provider {...stores}>
            <Component {...pageProps} router={router} />
          </Provider>
        </Container>
      </Fragment>
    )
  }
}