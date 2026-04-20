import { useEffect } from 'react'
import { React, Fragment } from 'react'
import { useStore } from '@/store'
import { observer } from 'mobx-react'
import { useNavigate } from 'react-router-dom'
const AuthPage = (props) => {
    const { children, optionCode } = props
    const { userStore, appStore } = useStore()
    const navigate = useNavigate()
    let permissionHas = true
    const getChildrenList = (list) => {
        if (optionCode !== undefined) {
            if (list.length === 0) {
                permissionHas = false
            } else {
                for (let i of list) {
                    if (optionCode.includes(i.reCode)) {
                        permissionHas = true
                        break
                    } else if (i.childList && i.childList.length > 0) {
                        getChildrenList(i.childList)
                    } else {
                        permissionHas = false
                    }
                }
            }
        } else {
            permissionHas = true
        }
    }
    useEffect(() => {
        if (userStore.authList) {
            console.log('111')
            getChildrenList(userStore.authList)
            if (!permissionHas) {
                navigate(`${appStore.activityUrl}/403`)
            }
        }
    }, [userStore.authList])
    return <Fragment>{children}</Fragment>
}
export default observer(AuthPage)
