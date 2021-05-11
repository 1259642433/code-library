import {merge} from './utils.js'

function Middleware(type) { // type 0 请求 1 响应
	// if(type !== 0 || type !== 1){
	// 	console.log(new Error('类型错误'))
	// }
	let self = this

	this.options = {
		status: 0, // 1 请求成功 2 请求失败
		config:{},
		response:undefined,
		error:undefined //TODO：分为请求错误，响应错误
	}
	
	this.functionList = []
	
	function* runG() {
		 for(let item of self.functionList){
			 yield item()
		 }
		 return true
	}
	
	this.setOptions = function(type,data){
		const typeMap = new Map([
			[0,'status'],
			[1,'config'],
			[2,'response'],
			[3,'error'],
		])
		typeMap.get(type) && (this.options[typeMap.get(type)] = data)
	}
	
	this.run = function(fn,status) {  // status 状态
		for (let v of runG()) { // 目前没有暴露next()对请求流程进行控制的需求,直接遍历执行
		    self.options = merge(self.options,v)
		}
		
		if(type === 0){
			fn(self.options.config)
		} else if(type === 1){
			if(status === 'success'){
				fn(self.options.response)
			} else if(status === 'fail'){
				fn(self.options.error)
			}
			
		}
	}
	
	this.use = function(fn1=()=>{},fn2=()=>{}) {
		const wrap = function (){
			let result = {}
			if(type === 0) {
				result.config = fn1(self.options.config) || self.options.config
				result.error = fn2(self.options.error) || self.options.error
			} else if(type === 1){
				if(self.options.status === 1){
					result.response = fn1(self.options.response) || self.options.response
				} else if(self.options.status === 2){
					result.error = fn2(self.options.error)|| self.options.error
				}
			}
			return result
		}.bind(this)
		this.functionList.push(wrap)
		// const previousFn = this.middleware
		// this.middleware = (next) => {
		// 	previousFn.call(this, () => {
		// 		return wrap.call(this,next,fn1,fn2)
		// 	})
		// 	function wrap(next,fn1,fn2){
		// 		console.log(++i)
		// 		if(type === 0){
		// 			fn1(next,this.options.config)
		// 			fn2(next,this.options.error)
		// 		} else if(type === 1){
		// 			fn1(next,this.options.response)
		// 			fn2(next,this.options.error)
		// 		}
		// 		next()
		// 	}
		// }
		// console.log(previousFn,this.middleware())
	}
	
}

function Interceptors(options){
	this.request = new Request(options)
	this.response = new Response(options)
}

function Request(config,fn){
	Middleware.call(this,0)
	
}

function Response(response,error) {
	Middleware.call(this,1)
}

export default Interceptors