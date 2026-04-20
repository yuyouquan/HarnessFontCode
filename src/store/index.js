import React from 'react'
import { configure } from 'mobx'
import UserStore from './user.Store'
import AppStore from './app.Store'

configure({ enforceActions: true })
class RootStore {
    // 组合store
    constructor() {
        this.userStore = new UserStore()
        this.appStore = new AppStore()
    }
}

//实例化根store注入context
const rootStore = new RootStore()
const context = React.createContext(rootStore)

const useStore = () => React.useContext(context)

export { useStore }
