//用户模块
import { makeAutoObservable } from 'mobx'
class AppStore {
    //定义数据
    lang = 'zh_CN'
    activityUrl = ''

    constructor() {
        //响应式处理
        makeAutoObservable(this, { reset: false }, { autoBind: true })
    }

    //定义方法
    //切换语言
    changeLang = (language) => {
        localStorage.setItem('lang', language)
        this.lang = language
    }
    //切换activity
    changeActivityUrl = (url) => {
        this.activityUrl = url
    }
}

//导出Store
export default AppStore
