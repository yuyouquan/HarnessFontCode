import { React } from 'react'
import styles from './index.module.scss'
import LoginService from '@/services/user/loginService'
import { observer } from 'mobx-react'
import { useStore } from '@/store'
import { removeTokenToLogin, generateUserAvatar, getLoginUrl } from '@/utils'

const MenuProfile = (props) => {
    const { userStore } = useStore()

    const loginOut = () => {
        LoginService.loginOut().then(() => {
            localStorage.removeItem('micro-app-template-token')
            localStorage.removeItem('micro-app-template-rtoken')
            window.location.href = removeTokenToLogin(getLoginUrl());
        }).catch((e) => { console.log(e); })
    }
    return (
        <div className={styles['contentDiv']}>
            {
                props.isShow && <>
                    <div className={styles['userInfoDiv']}>
                        <img className={styles['profilePhotoImg']}
                            src={generateUserAvatar(userStore.userinfo?.employeeNo)} />
                        <p className={styles['userInfoName']}>{userStore.userinfo?.name ? userStore.userinfo?.name : 'unKnow'}</p>
                        <p className={styles['userInfoNumber']}>{userStore.userinfo?.employeeNo ? userStore.userinfo?.employeeNo : 'unknow'}</p>
                    </div>
                    <div className={styles['loginOutDiv']}
                        onClick={loginOut}>
                        <p className={styles['loginOutBtn']}>退出登录</p>
                    </div>
                </>
            }
        </div>
    )
}
export default observer(MenuProfile)