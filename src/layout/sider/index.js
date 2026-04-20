import { React, useEffect, useState } from 'react'
import styles from './index.module.scss'
import '@/commonCss/CSSTransition.scss'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { ReactComponent as UnFoldIcno } from '@/assets/icon/Icon—度量—选中.svg'
import { routerItems } from '@/router/config'
import { useNavigate, useLocation } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import cloneDeep from 'lodash/cloneDeep'
import { Popover } from 'antd'
import Auth from '@/components/Authorized'
import { observer } from 'mobx-react'

const Sider = (props) => {
    const [isShowsider, setIsShowsider] = useState(true)
    const [routerItemsList, setRouterItemsList] = useState([])
    const navigate = useNavigate()
    const location = useLocation()

    const InitSiderMenu = () => {
        let routerItemsListTemp = cloneDeep(routerItems)

        let pathTemp, key
        if (!window.__POWERED_BY_QIANKUN__) {
            pathTemp = location.pathname.split('/')
        } else {
            pathTemp = location.pathname.split(`${props.activityUrl}`)[1].split('/')
        }
        if (isNaN(pathTemp[pathTemp.length - 1])) {
            key = pathTemp.pop()
        } else {
            key = pathTemp[pathTemp.length - 2]
        }
        findIndex(routerItemsListTemp, key, 'isChoose')
        setRouterItemsList(routerItemsListTemp)
    }
    useEffect(() => {
        InitSiderMenu()
    }, [])

    const changeIsShowsider = (status) => {
        const routerItemsListTemp = cloneDeep(routerItemsList)
        if (status) {
            routerItemsListTemp.map((v) => {
                v.unfold = false
                v.isChoose = false
            })
            setRouterItemsList(routerItemsListTemp)
            setTimeout(() => {
                InitSiderMenu()
            }, 200);
        } else {
            routerItemsListTemp.map((v) => {
                v.unfold = false
            })
            setRouterItemsList(routerItemsListTemp)
        }
        setIsShowsider(status)
    }

    const onClickMenuItem = async (key, objKey) => {
        const routerItemsListTemp = cloneDeep(routerItemsList)
        await findIndex(routerItemsListTemp, key, objKey)
        setRouterItemsList(routerItemsListTemp)
        if (objKey === 'unfold') {
            setIsShowsider(true)
        }
    }

    const findIndex = (arr, key, objKey) => {
        for (let i of arr) {
            if (objKey === 'isChoose') {
                i.isChoose = false
            }
            if (i.key === key) {
                i[objKey] = !i[objKey]
            } else if (Array.isArray(i.children)) {
                findIndex(i.children, key, objKey)
            }
        }
    }

    const getSubMenus = (v) => {
        return (
            <Auth key={v.key}
                optionCode={v.auth}><ul
                    className={
                        isShowsider
                            ? `${styles['MenuUl']}`
                            : `${styles['MenuUl']} ${styles['MenuUlFold']}`
                    }>
                    {v.isShow && <li
                        className={
                            v.isChoose
                                ? `${styles['MenuTitleLi']} ${styles['MenuTitleLiChoosed']}`
                                : `${styles['MenuTitleLi']}`
                        }
                        onClick={() =>
                            onClickMenuItem(v.key, 'unfold')
                        }
                        style={!v.icon ? { paddingLeft: (13 * (v.path.split('/').indexOf(v.key))) } : {}}>
                        {!isShowsider && (
                            <Popover
                                content={v.title}
                                placement="right">
                                <div
                                    className={
                                        styles['MenuLiIcno']
                                    }>
                                    {v.icon && <img className={styles['MenuLiIconImg']}
                                        src={v.icon} />}
                                </div>
                            </Popover>
                        )}
                        {isShowsider && (
                            <>
                                <div
                                    className={
                                        styles['MenuLiIcno']
                                    }>
                                    {v.icon && <img className={styles['MenuLiIconImg']}
                                        src={v.icon} />}
                                </div>
                                <div
                                    className={
                                        styles[
                                        'MenuLiTitle'
                                        ]
                                    }>
                                    <p>{v.title}</p>
                                </div>
                                <div
                                    className={
                                        v?.unfold
                                            ? `${styles['MenuLiDown']}`
                                            : `${styles['MenuLiDown']} ${styles['MenuLiDownFold']}`
                                    }>
                                    <UnFoldIcno />
                                </div>
                            </>
                        )}
                    </li>}
                </ul>
                <CSSTransition
                    classNames="Micro-DataGraph-Sider-MenuLiFold" //className值，防止重复
                    in={v?.unfold} //用于判断是否出现的状态
                    timeout={500} //动画持续时间
                    unmountOnExit>
                    <ul
                        className={styles['MenuUlChild']}
                        id={v.key}>
                        {v.children.map((i) => (
                            i.children ?
                                getSubMenus(i)
                                :
                                <Auth key={i.key}
                                    optionCode={i.auth}>
                                    {isShowsider && (
                                        i.isShow && <li
                                            className={
                                                i.isChoose
                                                    ? `${styles['MenuLi']} ${styles['MenuChildLiChoosed']}`
                                                    : `${styles['MenuLi']}`
                                            }
                                            onClick={(e) => {
                                                onClickMenuItem(i.key, 'isChoose')
                                                navigate(
                                                    window.__POWERED_BY_QIANKUN__
                                                        ? `${props.activityUrl}${i.path}`
                                                        : `${i.path}`
                                                )
                                            }}>
                                            <div
                                                className={
                                                    styles[
                                                    'MenuLiChildTitle'
                                                    ]
                                                }
                                                style={{ paddingLeft: (13 * (v.path.split('/').indexOf(v.key))) }}
                                            >
                                                <p>{i.title}</p>
                                            </div>
                                        </li>
                                    )}
                                </Auth>
                        ))}
                    </ul>
                </CSSTransition>
            </Auth>
        )
    }

    const getMenus = (v) => {
        return (
            <Auth
                key={v.key}
                optionCode={v.auth}>
                {
                    v.isShow && <ul
                        className={
                            isShowsider
                                ? `${styles['MenuUl']}`
                                : `${styles['MenuUl']} ${styles['MenuUlFold']}`
                        }>
                        <li
                            className={
                                v.isChoose
                                    ? `${styles['MenuLi']} ${styles['MenuLiChoosed']}`
                                    : `${styles['MenuLi']}`
                            }
                            onClick={(e) => {
                                onClickMenuItem(v.key, 'isChoose')
                                navigate(
                                    window.__POWERED_BY_QIANKUN__
                                        ? `${props.activityUrl}${v.path}`
                                        : `${v.path}`
                                )
                            }}>
                            {!isShowsider && (
                                <Popover
                                    content={v.title}
                                    placement="right">
                                    <div
                                        className={
                                            styles['MenuLiIcno']
                                        }>
                                        {v.icon && <img className={styles['MenuLiIconImg']}
                                            src={v.icon} />}
                                    </div>
                                </Popover>
                            )}
                            {isShowsider && (
                                <>
                                    <div
                                        className={
                                            styles['MenuLiIcno']
                                        }>
                                        {v.icon && <img className={styles['MenuLiIconImg']}
                                            src={v.icon} />}
                                    </div>
                                    <div
                                        className={
                                            styles['MenuLiTitle']
                                        }>
                                        <p>{v.title}</p>
                                    </div>
                                </>
                            )}
                        </li>
                    </ul>
                }
            </Auth>
        )
    }

    return (
        <div
            className={
                isShowsider
                    ? styles['contentDiv-active']
                    : styles['contentDiv-unactive']
            }>
            <div className={styles['MenuUlDiv-outer']}>
                <div className={styles['MenuUlDiv-inner']}>
                    {routerItemsList.map((v) => (
                        v.children ? getSubMenus(v) : getMenus(v)
                    ))}
                </div>
            </div>
            <div
                className={styles['changeMenuIcnoDiv']}
                onClick={() => changeIsShowsider(!isShowsider)}>
                {isShowsider ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            </div>
        </div >
    )
}

export default observer(Sider)