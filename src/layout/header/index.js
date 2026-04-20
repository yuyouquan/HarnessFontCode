import { React, useState, useRef, useEffect } from 'react'
import styles from './index.module.scss'
import MenuMain from './components/menuMain'
import MenuProfile from './components/menuProfile'
import { generateUserAvatar } from '@/utils'
import HomeComponentIcon from '@/assets/icon/icon_headerMenu.svg'
import HomeLogoIcon from '@/assets/icon/icon-默认-导航栏-logo.svg'
import { CSSTransition } from 'react-transition-group'
import '@/commonCss/CSSTransition.scss'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { observer } from 'mobx-react'
const Header = () => {
    const MenuMainDivRef = useRef(null)
    const MenuProfileDivRef = useRef(null)
    const navigate = useNavigate()
    const { userStore } = useStore()
    const [isShowMenuMain, setIsShowMenuMain] = useState(false)
    const [isShowMenuProfile, setIsShowMenuProfile] = useState(false)
    const changeShowMenuMain = (state) => {
        setIsShowMenuMain(state)
    }
    const changeShowMenuProfile = (state) => {
        setIsShowMenuProfile(state)
    }
    const clickCallback = (event) => {
        if (MenuMainDivRef.current.contains(event.target)) {
            return
        } else {
            setIsShowMenuMain(false)
        }
        if (MenuProfileDivRef.current.contains(event.target)) {
            return
        } else {
            setIsShowMenuProfile(false)
        }
    }
    useEffect(() => {
        if (isShowMenuMain || isShowMenuProfile) {
            document.addEventListener('click', clickCallback, false)
            return () => {
                document.removeEventListener('click', clickCallback, false)
            }
        }
    }, [isShowMenuMain, isShowMenuProfile])
    return (
        <div className={styles['contentDiv']}>
            <div className={styles['contentLeftDiv']}>
                <div
                    className={styles['MenuMainDiv']}
                    ref={MenuMainDivRef}>
                    <img
                        className={styles['MenuMainIcno']}
                        onClick={() =>
                            changeShowMenuMain(isShowMenuMain ? false : true)
                        }
                        src={HomeComponentIcon}
                    />
                    {/* <CSSTransition
                        classNames="Micro-Template-Header-MenuMain" //className值，防止重复
                        in={isShowMenuMain} //用于判断是否出现的状态
                        timeout={500} //动画持续时间
                        unmountOnExit>
                        <MenuMain
                            changeShow={changeShowMenuMain}
                            isShow={isShowMenuMain}
                        />
                    </CSSTransition> */}
                </div>
                <div className={styles['headerDivider']}></div>
                <div className={styles['headerWord']}
                    onClick={() => {
                        navigate('/')
                    }}>
                    template
                </div>
            </div>
            <div className={styles['contentRightDiv']}>
                <div
                    className={styles['MenuProfileDiv']}
                    ref={MenuProfileDivRef}>
                    <img
                        className={styles['profilePhoto']}
                        onClick={() =>
                            changeShowMenuProfile(
                                isShowMenuProfile ? false : true
                            )
                        }
                        src={generateUserAvatar(userStore.userinfo?.employeeNo)}
                    />
                    <CSSTransition
                        classNames="Micro-Template-Header-MenuProfile" //className值，防止重复
                        in={isShowMenuProfile} //用于判断是否出现的状态
                        timeout={500} //动画持续时间
                        unmountOnExit>
                        <MenuProfile
                            changeShow={changeShowMenuProfile}
                            isShow={isShowMenuProfile}
                        />
                    </CSSTransition>
                </div>
            </div>
        </div>
    )
}

export default observer(Header)
