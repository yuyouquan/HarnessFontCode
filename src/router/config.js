import { lazy } from 'react'
const Home = lazy(() => import('@/pages/Home'))

const NotFound = lazy(() => import('@/components/notFound'))
const Forbidden = lazy(() => import('@/components/forbidden'))


export const routerItems = [

    {
        path: '/',
        title: '首页',
        component: Home,
        key: 'Home',
        unfold: false,
        exact: true,
        isChoose: false,
        isShow: false
    },
    {
        path: '/403',
        key: 'Forbidden',
        component: Forbidden,
        isShow: false,
        exact: false
    },
    {
        path: '*',
        key: 'NotFound',
        component: NotFound,
        isShow: false,
        exact: false
    }
]
export const routerOtherItems = []
