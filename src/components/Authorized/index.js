import { useState, useEffect } from 'react'
import { React, Fragment } from 'react'
import { useStore } from '@/store'
import { observer } from 'mobx-react'
const Auth = (props) => {
    const { children, optionCode } = props
    const [permissionHas, setPermissionHas] = useState(false)
    const { userStore } = useStore()

    const getChildrenList = (list) => {
        if (optionCode !== undefined) {
            for (let i of list) {
                if (optionCode.includes(i.reCode)) {
                    setPermissionHas(true)
                    break
                } else if (i.childList && i.childList.length > 0) {
                    getChildrenList(i.childList)
                }
            }
        } else {
            setPermissionHas(true)
        }
    }
    useEffect(() => {
        userStore.authList && getChildrenList(userStore.authList)
    }, [userStore.authList])
    return <Fragment>{permissionHas && children}</Fragment>
}
export default observer(Auth)
