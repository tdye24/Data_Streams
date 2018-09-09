var express = require('express');  
var router = express.Router();  
var http = require('http');
var reg = require('../../utils/reg');

/* GET dynasties page. */  
router.get('/', (req, res, next) => {
	var html = {

	};
	res.writeHead(200, {'Content-Type': 'application/json'});

	var path1 = '/data/' + encodeURI(req.query.wd) + '.json?key=9f1a3bca69ef5f35f1f073558338da1423de484f';
	var options1 = {
		'host': 'data1.library.sh.cn',
		'port': '',
		'path': path1,
		'method': 'get',
		'headers': {
			
		},
		'timeout': 10*1000
	};


	var path2 = '/temporal/' + encodeURI(req.query.wd) + '.json?key=9f1a3bca69ef5f35f1f073558338da1423de484f';
	var options2 = {
		'host': 'data1.library.sh.cn',
		'port': '',
		'path': path2,
		'method': 'get',
		'headers': {
			
		},
		'timeout': 10*1000
	};

	let html1 = '';
	function fn1() {
		return new Promise((resolve, reject) => {
			let req = http.request(options1, (res) => {
				res.on('data', (data) => {
					html1 += data;
				});
				res.on('end', () => {
					resolve(html1);
				});
				res.on('error', () => {
					console.log('接口响应时发生错误!');
				});
			});
			req.setTimeout(options1.timeout, () => {
				console.log("Timeout1");
				req.abort();
			});
			req.on('error', (e) => {
				console.log("请求接口数据时发生错误！" + e.message);
			});
			req.end();
		});
	};

	var html2 = '';
	function fn2() {
		return new Promise((resolve, reject) => {
			let req = http.request(options2, (res) => {
				res.on('data', (data) => {
					html2 += data;
				});
				res.on('end', () => {
					resolve(html2);
				});
				res.on('error', () => {
					console.log('接口响应时发生错误!');
				});
			});
			req.setTimeout(options2.timeout, () => {
				console.log("Timeout1");
				req.abort();
			});
			req.on('error', (e) => {
				console.log("请求接口数据时发生错误！" + e.message);
			});
			req.end();
		});
	};
	async function fn3() {
		let html1 = await fn1();
		let html2 = await fn2();

		html1 = JSON.parse(html1);
		html2 = JSON.parse(html2);

		if(!html1.result.data) {
			html['data'] = '';
		} else {
			html['data'] = html1.result.data;
		}
		html['result'] = [];
		
		for (var i = 0; i < html2.result.length; i ++) {
			html['result'].push({
				'monarch': html2.result[i].monarch,
				'reignTitle': html2.result[i].reignTitle,
				'monarchName': html2.result[i].monarchName,
				'label': html2.result[i].label,
				'dynasty': html2.result[i].dynasty,
				'begin': html2.result[i].begin,
				'end': html2.result[i].end
			});
			
		}
		res.write(JSON.stringify(html));
		res.end();
	};
	fn3();
});  
module.exports = router;  