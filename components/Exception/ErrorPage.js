import { Component } from 'react'
import NotFound from './404'
import ServerError from './500'

class ErrorPage extends Component {
  static defaultProps = {
    statusCode: 200
  }
  render() {
    let RenderComp;
    switch (this.props.statusCode) {
      case 200:
      case 404: {
        RenderComp = () => <NotFound />
        break;
      }
      case 500: {
        RenderComp = () => <ServerError />
        break;
      }
      default:
        break;
    }
    return (
      <RenderComp />
    );
  }
}

export default ErrorPage;