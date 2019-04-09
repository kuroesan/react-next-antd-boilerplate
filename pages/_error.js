import React from 'react'
import ErrorPage from '../components/Exception/ErrorPage'
export default class Error extends React.Component {
  static defaultProps = {
    statusCode: 200
  }
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null
    return { statusCode }
  }

  render() {
    return (
      <ErrorPage statusCode={this.props.statusCode || 200} />
    );
  }
}