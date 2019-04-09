import { observable, action } from 'mobx'

class Gobal {
  @observable test = 'test'

  @action
  changeTestState = test => {
    this.test = test
  }
}

export default new Gobal();
