import { React, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './index.module.scss'
import lds from 'lodash'


const MenuMain = (props) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [menuItems, setMenuItems] = useState([])
    const menuItemsList = [
        {
            title: '工作空间',
            key: 'workspace',
            items: [
                {
                    name: '模板',
                    key: '',
                    path: '/',
                    isChoose: false
                }
            ]
        }
    ]
    const openMicroApp = (name, path) => {
        navigate(path)
        props.changeShow(false)
    }
    const initMenuItemsList = () => {
        const tempMenuItemsList = lds.cloneDeep(menuItemsList)
        const tempkey = location.pathname.split('/')[1]
        tempMenuItemsList.map(v => {
            v.items && v.items.map(i => {
                if (i.key == tempkey) {
                    i.isChoose = true
                }
            })
        })
        setMenuItems(tempMenuItemsList)
    }
    useEffect(() => {
        if (props.isShow) {
            initMenuItemsList()
        } else {
            setMenuItems([])
        }
    }, [props.isShow])

    return (
        <div className={styles['contentDiv']}>
            {
                menuItems.map(v => {
                    return (
                        <div key={v.key}>
                            <p className={styles['MenuTitle']}
                            >{v.title}</p>
                            <div className={styles['MenuItemsDiv']}>
                                {
                                    v.items && v.items.map(i => {
                                        return (
                                            <div className={styles['MenuItemDiv']}
                                                key={i.key}>
                                                <a className={i.isChoose ? styles['MenuItemChoosed'] : styles['MenuItem']}
                                                    onClick={() => openMicroApp(i.name, i.path)}>{i.name}
                                                </a>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div >
                    )
                })
            }

        </div >
    )
}
export default MenuMain