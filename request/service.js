/*
 *	uni.request调用略原始，仿照axios进行封装
 *	author:王文特
 */

import {merge} from './utils.js'
import Interceptors from './interceptors.js'

export default function service(options) {
	
}

// 添加函数静态属性

// 请求配置
// TODO(feat)：后续可通过函数添加多种配置，可进行切换访问不同域名，环境下接口，项目比较赶，目前仅加入default通用配置
service.config = {
	default: {
		headers: {
			'Content-Type': 'application/json;charset=UTF-8'
		},
		timeout: 5000,
		baseURL: '',
		url: '',
		method: 'GET',
		data: {}
	},
	create(){ //创建配置
		
	}
}


service.create = function(options) {
	return new Request(merge(this.config.default, options))
}

function Request(config) {
	let self = this
	this.interceptors = new Interceptors()
	const request = function (options) {
		const current = merge(config, options)
		return new Promise((resolve, reject) => {
			self.interceptors.request.setOptions(1, current)
			self.interceptors.request.run((config)=>{
				uni.request({
					header: config.headers,
					method: config.method,
					url: `${config.baseURL}${config.url}`,
					data: config.data,
					timeout: config.timeout,
					success(res) {
						self.interceptors.response.setOptions(0, 1)
						self.interceptors.response.setOptions(2, res)
						self.interceptors.response.run(response=>{
							// console.log('response',response)
							resolve(response)
						},'success')
					},
					fail(error) {
						self.interceptors.response.setOptions(0, 2)
						self.interceptors.response.setOptions(3, error)
						self.interceptors.response.run(error=>{
							// console.log('error',error)
							reject(error)
						},'fail')
					}
				})
			})
		})
	}
	request.interceptors = this.interceptors
	return request
}




