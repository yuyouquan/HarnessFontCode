import { React, Fragment, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Button, message } from 'antd'
// import actions from '@/micro-action'
const Home = () => {
    useEffect(() => {
        // actions.setGlobalState({ token: '2222', rtoken: 'dddddd' })
    })

    return (
        // 使用React.Fragment 来避免向 DOM 添加额外的节点
        <Fragment>
            Home
            <Button onClick={() => message.success('antd 6 升级成功！')}
type="primary">
                测试 Antd 6
            </Button>
        </Fragment>
    )
}
export default Home
