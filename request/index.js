import service from './service.js'
import store from '@/store'
import Vue from 'vue'

const request = service.create({
	baseURL:'http://localhost:8081',
	timeout: 30000
})

// console.log(request)
// console.log(request.interceptors)

request.interceptors.request.use(config=>{
	config.headers.Authorization = 'Bearer ' + store.getters.token
	return config
},error=>{
	return error
})

request.interceptors.response.use(res=>{
	if(res.data.code !== 200){
		switch(res.data.code){
			case 401:
				// store.dispatch('user/logout')
				// navigator.replaceAll('/pages/login/index')
				// showToast('登录失效，请重新登录')
				break;
			default:
				// showToast(res.data.message || res.data)
		}
		return Promise.reject(new Error(res.data.message || 'Error'))
	}
	return res.data
},error=>{
	return Promise.reject(error)
})

export default request
