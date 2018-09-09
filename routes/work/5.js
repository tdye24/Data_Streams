var express = require('express');  
var router = express.Router();  
var http = require('http');

/* GET works page. */  
router.get('/', (req, res, next) => {
	let html = "";
	var obj = [];
	res.writeHead(200, {'Content-Type': 'application/json'});
	//http://data1.library.sh.cn/gj/webapi/classificationList?source=6&fUri=-1&isLoop=false&key=9f1a3bca69ef5f35f1f073558338da1423de484f
	var path = '/gj/webapi/classificationList?source=' + encodeURI(req.query.source) + '&fUri=-1&' + 'isLoop=' + encodeURI(req.query.isLoop) + '&key=9f1a3bca69ef5f35f1f073558338da1423de484f';
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
		var tempObj = JSON.parse(html);

		if (tempObj.data == []) {
			obj = [];
		} else {
			var data =  tempObj.data;
			for (var i = 0; i < data.length; i++) {
				if (data[i].broader == undefined) {
					var label1 = data[i].label;
					var objec1 = {

					};
					objec1[label1] = [];
					objec1['uri'] = data[i].uri;

					obj.push(objec1);
				}
			}


			for (var j = 0; j < obj.length; j++) {
				for (var k = 0; k < data.length; k++) {

					if (data[k].broader === obj[j].uri) {
			
						var key = Object.keys(obj[j])[0];
			
						var label2 = data[k].label;
						var objec2 = {

						};
						objec2[label2] = [];
						objec2['uri'] = data[k].uri;
						obj[j][key].push(objec2);
					}
				}
			}


			for (var i = 0; i < obj.length; i++) {
				for (var j = 0; j < obj[j].length; j++) {
					for (var k = 0; k < data.length; k++) {
						if (data[k].broader === obj[j].uri) {
							var key = Object.keys(obj[j])[0];

							var label3 = data[k].label;

							obj[j][key].push(label3); 
						}
					}
				}
			}
		}
		res.write(JSON.stringify(obj));
		res.end();
	};
	fn2();
});  
module.exports = router;  