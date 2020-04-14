import axios from 'axios';

const httpService = axios.create({
    // baseURL: 'http://localhost:9999', // 需自定义
    baseURL: '', // 需自定义
    timeout: 3000 // 需自定义
});
// request拦截器
httpService.interceptors.request.use(
    config => {
        // 让每个请求携带token
        config.headers['Authorization'] = localStorage.getItem("Authorization");
        return config;
    },
    error => {
        console.log(error); // for debug
        Promise.reject(error)
    }
)
// respone拦截器
httpService.interceptors.response.use(
    response => {
        // 统一处理状态
        const res = response.data;
        return res;
    },
    // 处理处理
    error => {
        if (error && error.response) {
            switch (error.response.status) {
                case 400:
                    error.message = '错误请求';
                    break;
                case 401:
                    error.message = '未授权，请重新登录';
                    break;
                case 403:
                    error.message = '拒绝访问';
                    break;
                case 404:
                    error.message = '请求错误,未找到该资源';
                    break;
                case 405:
                    error.message = '请求方法未允许';
                    break;
                case 408:
                    error.message = '请求超时';
                    break;
                case 500:
                    error.message = '服务器端出错';
                    break;
                case 501:
                    error.message = '网络未实现';
                    break;
                case 502:
                    error.message = '网络错误';
                    break;
                case 503:
                    error.message = '服务不可用';
                    break;
                case 504:
                    error.message = '网络超时';
                    break;
                case 505:
                    error.message = 'http版本不支持该请求';
                    break;
                default:
                    error.message = `${error.response.msg}`;
            }
        } else {
            error.message = "连接到服务器失败";
        }
        return Promise.reject(error.message);
    }
)

/*网络请求部分*/

/*
 *  get请求
 *  url:请求地址
 *  params:参数
 * */
function get(url, params = {}) {
    return httpService({
        url: url,
        method: 'get',
        params: params
    })
}

/*
 *  post请求
 *  url:请求地址
 *  params:参数
 * */
function origiPost(url, params = {}) {
    return httpService({
        url: url,
        method: 'post',
        data: params
    })
}
function post(url,params={}) {
    return new Promise((resolve, reject) => {
        origiPost(url, params).then(result => {
            if (result.isSuccess) {
                resolve(result.data)
            } else {
                reject(result.msg)
            }
        }).catch(erro => {
            reject(erro)
        })
    })
}

export {
    get,
    post
}