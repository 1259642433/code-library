import service from './service.js'
import store from '@/store'
import { navigator,showToast } from '@/utils/mount.js'
import Vue from 'vue'

const request = service.create({
	baseURL:'https://business.haswallow.com',
	timeout: 30000
})

// console.log(request)
// console.log(request.interceptors)

request.interceptors.request.use(config=>{
	config.headers.os = store.getters.systemInfo.platform
	config.headers.Authorization = 'Bearer ' + store.getters.token
	if (config.data || config.params) {
	  config.data = filterParams(config.data || config.params)
	}
	return config
},error=>{
	return error
})

request.interceptors.response.use(res=>{
	console.log('res',res)
	if(res.data.code !== 0){
		switch(res.data.code){
			case 401:
			store.dispatch('user/logout')
				navigator.replaceAll('/pages/login/index')
				showToast('登录失效，请重新登录')
				break;
			default:
				showToast(res.data.message || res.data)
		}
		return Promise.reject(new Error(res.data.message || 'Error'))
	}
	return res.data
},error=>{
	return Promise.reject(error)
})

export default request

function filterParams (data) { // 不传空字符串的参数
  Object.keys(data).map(key => {
    if (data[key] === '') {
      delete data[key]
    }
  })
  return data
}
