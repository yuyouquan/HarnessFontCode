import { React } from 'react'
import styles from './index.module.scss'

const renderStampPair = (index) => [
    <div key={`four-${index}`} className={styles['stamp four']}>4</div>,
    <div key={`zero-${index}`} className={styles['stamp zero']}>0</div>,
]

const NotFound = () => {
    return (
        <div className={styles['error']}>
            <div>
                <div className={styles['rail']}>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(renderStampPair)}
                </div>
                <div className={styles['world']}>
                    <div className={styles['forward']}>
                        <div className={styles['box']}>
                            <div className={styles['wall']}></div>
                            <div className={styles['wall']}></div>
                            <div className={styles['wall']}></div>
                            <div className={styles['wall']}></div>
                            <div className={styles['wall']}></div>
                            <div className={styles['wall']}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default NotFound
