import Xhr from '@/services/xhr/index';

/**
 * 封装ajax请求
 * @param {any}
 */

class LoginService {
    getAuthList(params) {
        return Xhr.get('/Permission/get_permission/', { params: params });
    }
    getUserInfo() {
        return Xhr.post(`${process.env.REACT_APP_COMMON_API_PATH}/common-sso/queryUserByToken`);
    }
    login(params) {
        return Xhr.post(`${process.env.REACT_APP_COMMON_API_PATH}/common-sso/login`, params)
    }
    loginOut(params) {
        return Xhr.post(`${process.env.REACT_APP_COMMON_API_PATH}/common-sso/logout`, params)
    }
}

// 实例化再导出
export default new LoginService();