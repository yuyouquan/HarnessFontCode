import http from 'axios'
import { message } from 'antd'
import actions from '@/micro-action'
import { getLoginUrl } from '@/utils'
import API_Data_CODES from './code'

http.defaults.baseURL = process.env.REACT_APP_API_PATH //线上

// 请求拦截器
http.interceptors.request.use((request) => {
    request.headers['Authorization'] = localStorage.getItem('micro-app-template-token')
    request.headers['P-Auth'] = localStorage.getItem('micro-app-template-token')
    request.headers['P-Rtoken'] = localStorage.getItem('micro-app-template-rtoken')
    request.headers['P-AppId'] = process.env.REACT_APP_APP_ID
    request.timeout = 60000
    return request
})

async function handleResponse(response) {
    let result
    //处理4001 token过期
    if (response.request.responseType === 'blob') {
        return Promise.resolve(response)
    } else if (response.data.code === API_Data_CODES.TOKEN_ERROR) {
        try {
            const data = await http.post(`${process.env.REACT_APP_COMMON_API_PATH}/common-sso/refreshToken`)
            localStorage.setItem(
                'micro-app-template-token',
                data.data.data.token
            )
            localStorage.setItem(
                'micro-app-template-rtoken',
                data.data.data.rtoken
            )
            actions.setGlobalState({
                token: data.data.data.token,
                rtoken: data.data.data.rtoken
            })
            window.location.reload()
        } catch (error) {
            result = '会话过期，请重新登录'
            message.error(result);
            localStorage.removeItem('micro-app-template-token')
            localStorage.removeItem('micro-app-template-rtoken')
            window.location.href = getLoginUrl()
        }
    } else if (response.data.code === API_Data_CODES.R_TOKEN_ERROR) {
        result = '会话过期，请重新登录'
        message.error(result);
        localStorage.removeItem('micro-app-template-token')
        localStorage.removeItem('micro-app-template-rtoken')
        window.location.href = getLoginUrl()
    } else if (response.data.code === API_Data_CODES.SUCCESS) {
        return Promise.resolve(response)
    } else {
        result =
            `请求失败:  ${response.data.msg}`
        message.error(result);
    }
    return Promise.reject(result)
}

// 返回拦截器
http.interceptors.response.use(
    (response) => {
        return handleResponse(response)
    },
    (error) => {
        if (error.response) {
            return handleResponse(error.response)
        }
        const result = '请求异常: ' + error?.response?.msg
        message.error(result)
        return Promise.reject(result)
    }
)

export default http
