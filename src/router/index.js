import { React, Suspense, memo } from 'react'
// import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from '@/store'
import { observer } from 'mobx-react'

import Loading from '@/components/loading'
import NotFound from '@/components/notFound'

const renderRouter = (routerList) => {
    const { appStore } = useStore()
    return routerList.map((item) => {
        const { path, exact, children } = item
        // const { path, exact, noAuth, children } = item;
        // const token = localStorage.getItem('token')
        // console.log(token)
        // if (!noAuth && !token) return <Route element={<Navigate to="/login" />}
        //     path="*" />;
        //一级路由
        return (
            <Route
                element={
                    item.redirect ? (
                        <Navigate
                            replace
                            to={`${appStore.activityUrl}${item.redirect}`}
                        />
                    ) : (
                        <item.component />
                    )
                }
                exact={exact}
                key={path}
                path={`${appStore.activityUrl}${path}`}>
                {/* 二级路由 */}
                {!!children &&
                    children.map((f) => {
                        return (
                            <Route
                                element={
                                    f.redirect ? (
                                        <Navigate
                                            replace
                                            to={`${appStore.activityUrl}${f.redirect}`}
                                        />
                                    ) : (
                                        <f.component />
                                    )
                                }
                                exact={f.exact}
                                key={f.path}
                                path={`${appStore.activityUrl}${f.path}`}>
                                {/* 三级路由 */}
                                {!!f.children &&
                                    f.children.map((s) => {
                                        return (
                                            <Route
                                                element={
                                                    s.redirect ? (
                                                        <Navigate
                                                            replace
                                                            to={`${appStore.activityUrl}${s.redirect}`}
                                                        />
                                                    ) : (
                                                        <s.component />
                                                    )
                                                }
                                                exact={s.exact}
                                                key={s.path}
                                                path={`${appStore.activityUrl}${s.path}`}
                                            />
                                        )
                                    })}
                            </Route>
                        )
                    })}
            </Route>
        )
    })
}

const Routers = (props) => {
    // console.log(props, 'props')
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                {renderRouter(props.routerItems)}
                <Route
                    element={<NotFound />}
                    path="*"
                />
            </Routes>
        </Suspense>
    )
}

export default memo(observer(Routers))
