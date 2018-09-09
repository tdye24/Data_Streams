var express = require('express');  
var router = express.Router();  
var https = require('https');

/* GET poems page. */  
router.get('/', (req, res, next) => {
	let html = "";
	res.writeHead(200, {'Content-Type': 'application/json'});
	var path = '/api/Coupletwords?id=' + encodeURI(req.query.key);
	var options = {
		'host': 'api.sou-yun.com',
		'port': '',
		'path': path,
		'method': 'get',
		'headers': {
			
		},
		'timeout': 10*1000
	};
	function fn1() {
		return new Promise((resolve, reject) => {
			let req = https.request(options, (res) => {
				res.on('data', (data) => {
					html += data;
				});
				res.on('end', () => {
					resolve(html);
				});
				res.on('error', () => {
					console.log('接口响应时发生错误!');
				});
			});
			req.setTimeout(options.timeout, () => {
				console.log("Timeout1");
				req.abort();
			});
			req.on('error', (e) => {
				console.log("请求接口数据时发生错误！" + e.message);
			});
			req.end();
		});
	};
	async function fn2() {
		let html = await fn1();
		//console.log(html);
		res.write(JSON.stringify(html));
		res.end();
	};
	fn2();
});  
module.exports = router;  