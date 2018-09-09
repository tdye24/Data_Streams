var express = require('express');  
var router = express.Router();  
var http = require('http');
var reg = require('../../utils/reg');

var fun = function (htmlObj) {
	var Obj = {

	};
	Obj['result'] = [];
	for (var i = 0; i < htmlObj.result.length; i ++) {
		var monarchName = '';
		if(htmlObj.result[i].monarchName == 'NON') {
			monarchName = '未详';
		} else {
			monarchName = htmlObj.result[i].monarchName;
		}
		Obj['result'].push({
			'monarch': htmlObj.result[i].monarch,
			'reignTitle': htmlObj.result[i].reignTitle,
			'monarchName': monarchName,
			'label': htmlObj.result[i].label,
			'dynasty': htmlObj.result[i].dynasty,
			'begin': htmlObj.result[i].begin,
			'end': htmlObj.result[i].end
		});
			
	}
	return Obj;
}

/* GET dynasties page. */  
router.get('/', (req, res, next) => {
	res.writeHead(200, {'Content-Type': 'application/json'});

	var path1 = '/temporal/' + encodeURI(req.query.wd) + '.json?key=9f1a3bca69ef5f35f1f073558338da1423de484f';
	
	var path2 = '/temporal/' + encodeURI(req.query.wd.substring(0, req.query.wd.length - 1)) + '.json?key=9f1a3bca69ef5f35f1f073558338da1423de484f';
	
	var options1 = {
		'host': 'data1.library.sh.cn',
		'port': '',
		'path': path1,
		'method': 'get',
		'headers': {
			
		},
		'timeout': 10*1000
	};

	var options2 = {
		'host': 'data1.library.sh.cn',
		'port': '',
		'path': path2,
		'method': 'get',
		'headers': {
			
		},
		'timeout': 10*1000
	};

	function fn1(options) {
		let html = '';
		return new Promise((resolve, reject) => {
			let req = http.request(options, (res) => {
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
				console.log("Timeout!");
				req.abort();
			});
			req.on('error', (e) => {
				console.log("请求接口数据时发生错误！" + e.message);
			});
			req.end();
		});
	};

	async function fn2() {
		let html1 = await fn1(options1);
		let html2 = await fn1(options2);
		// console.log(html1);
		// console.log(html2);
		let obj1 = fun(JSON.parse(html1));
		let obj2 = fun(JSON.parse(html2));

		if(JSON.stringify(obj1) == '{"result":[]}') {
			res.write(JSON.stringify(obj2));
		} else {
			res.write(JSON.stringify(obj1));
		}

		res.end();
	};
	fn2();
});  
module.exports = router;  