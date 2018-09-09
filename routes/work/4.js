var express = require('express');  
var router = express.Router();  
var http = require('http');

/* GET works page. */  
router.get('/', (req, res, next) => {
	let html = "";
	var obj = [];
	res.writeHead(200, {'Content-Type': 'application/json'});
	var path = '/gj/webapi/workAnnotations?uri=' + encodeURI(req.query.wd) + '&key=9f1a3bca69ef5f35f1f073558338da1423de484f';
	var options = {
		'host': 'data1.library.sh.cn',
		'port': '',
		'path': path,
		'method': 'get',
		'headers': {
			
		},
		'timeout': 10*1000
	};
	function fn1() {
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
		var htmlObj = JSON.parse(html);
		if (htmlObj.data == []) {
			obj = [];
		} else {
			for (var i =0; i < htmlObj.data.length; i++) {
				var sourceObj = {

				};

				if (htmlObj.data[i].source.title != undefined) {
					sourceObj['title'] = htmlObj.data[i].source.title;
				} else {
					sourceObj['title'] = '';
				}

				if (htmlObj.data[i].sourceTime != undefined) {
					sourceObj['time'] = htmlObj.data[i].sourceTime;
				} else {
					sourceObj['time'] ='';
				}

				if (htmlObj.data[i].sourceCreator != undefined) {
					sourceObj['creator'] = htmlObj.data[i].sourceCreator;
				} else {
					sourceObj['creator'] ='';
				}

				if (htmlObj.data[i].hasBody != undefined) {
					sourceObj['body'] = htmlObj.data[i].hasBody;
				} else {
					sourceObj['body'] ='';
				}

				obj.push(sourceObj);
			}
		}
		res.write(JSON.stringify(obj));
		res.end();
	};
	fn2();
});  
module.exports = router;  