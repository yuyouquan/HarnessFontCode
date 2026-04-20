import http from '@/services/xhr/index'


export const artifactList = (params) => {
  return http.get('/artifact/', { params })
}
export const filterOptions = (params) => {
  return http.get('/artifact/filter_options/', { params })
}
