import http from '@/services/xhr/index'


export const deviceList = (params) => {
  return http.get('/device/', { params })
}
export const statusStatistics = (params) => {
  return http.get('/device/status_statistics/', { params })
}
export const applicationDetail = (params) => {
  return http.get(`device_application/${params.id}/application_detail/`, { params })
}
