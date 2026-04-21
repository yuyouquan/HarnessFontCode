import http from '@/services/xhr'

/**
 * 设备管理 API
 * 接口契约（假设后端已实现）：
 *   GET    /api/device/list       列表
 *   GET    /api/device/:id        详情
 *   POST   /api/device            新增
 *   PUT    /api/device/:id        修改
 *   DELETE /api/device/:id        删除
 */
export default {
    fetchList(params) {
        // params: { page, pageSize, keyword, status }
        return http.get('/api/device/list', { params })
    },

    fetchDetail(id) {
        return http.get(`/api/device/${id}`)
    },

    create(payload) {
        // payload: { name, model, status, remark }
        return http.post('/api/device', payload)
    },

    update(id, payload) {
        return http.put(`/api/device/${id}`, payload)
    },

    remove(id) {
        return http.delete(`/api/device/${id}`)
    }
}
