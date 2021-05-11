export function merge(opt1, opt2) {
	if (Object.prototype.toString.call(opt1) !== '[object Object]' && Object.prototype.toString.call(opt2) !==
		'[object Object]') {
		console.log(new Error('service: merge failed!'))
		return opt1
	}
	let optCopy = JSON.parse(JSON.stringify(opt1))
	Object.keys(opt2).forEach(k => {
		if (k in opt1) optCopy[k] = opt2[k]
	})
	return optCopy
}