import http from '@/services/xhr/index'


export const queryInfoByPage = (params) => {
    return http.get('/device_application/', { params })
}
export const queryStatus = () => {
    return http.get('/device_application/status_statistics/')
}
// 查询项目信息
export const queryProjectInfoBySpm = () => {
    return http.get(`${process.env.REACT_APP_SCM_PATH}/projectInfo/queryProjectNameSelectNoPermission/`)
}
//制品列表查询
export const getProjectProduct = (params) => {
    return http.get('/artifact/', { params })
}
//获取下拉
export const getPageOptions = () => {
    return http.get('/device_application/filter_options/')
}

export const getWeeklyStatistics = () => {
    return http.get('/artifact/weekly_statistics/')
}
export const handleAbandoned = (id) => {
    return http.post(`/device_application/${id}/abandoned/`)
}
export const handleProjectDetail = (id) => {
    return http.get(`/device_application/${id}/application_detail/`)
}
export const handleExtendRecycleTime = (params) => {
    const { id } = params
    return http.post(`/device_application/${id}/extend_recycle_time/`, params)
}
export const handleUpdateDeviceVersion = (id) => {
    return http.post(`/device_application/${id}/update_device_version/`)
}
export const handleVersionHistory = (id) => {
    return http.get(`/device_application/${id}/version_history/`)
}
export const handleFilterOptions = (params) => {
    return http.get('/artifact/filter_options/', { params })
}

export const handleSubmit = (params) => {
    return http.post('/device_application/submit/', params)
}

export default {
    queryInfoByPage,
    queryStatus,
    queryProjectInfoBySpm,
    getProjectProduct,
    getPageOptions,
    getWeeklyStatistics,
    handleAbandoned,
    handleProjectDetail,
    handleExtendRecycleTime,
    handleUpdateDeviceVersion,
    handleVersionHistory,
    handleFilterOptions,
    handleSubmit
}
