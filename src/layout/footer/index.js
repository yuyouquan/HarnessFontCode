import { React } from 'react'
import styles from './index.module.scss'
import { useStore } from '@/store'
import { Button } from 'antd/lib/radio'

const Footer = () => {
    const { appStore } = useStore()
    const changeLang = (language) => {
        appStore.changeLang(language)
        window.location.reload()
    }
    return (
        <div className={styles['contentDiv']}>
            <Button onClick={() => changeLang('zh_CN')}
                type="success"
            >changeLang</Button>
        </div>
    )
}

export default Footer