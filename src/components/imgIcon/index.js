import { React } from 'react'
import styles from './index.module.scss'

const ImgIcon = (props) => {
    return (
        <img src={props.src}
            style={{ width: props.width, height: props.height }} />
    )
}
export default ImgIcon