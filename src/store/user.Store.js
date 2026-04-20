//用户模块
import { makeAutoObservable } from 'mobx'
class UserStore {
  //定义数据
  userinfo = {};
  authList = [];

  constructor() {
    //响应式处理
    makeAutoObservable(this, { reset: false }, { autoBind: true });
  }

  //定义方法
  changeUserinfo = (data) => {
    this.userinfo = data
  }
  changeAuthList = (data) => {
    this.authList = data
  }
}

//导出Store
export default UserStore;