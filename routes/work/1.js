var express = require('express');  
var router = express.Router();  
var http = require('http');

/* GET works page. */  
router.get('/', (req, res, next) => {
	let html = "";
	res.writeHead(200, {'Content-Type': 'application/json'});

	var path = '/gj/webapi/instances?freetext=' + encodeURI(req.query.wd) + '&key=9f1a3bca69ef5f35f1f073558338da1423de484f';
	var options = {
		'host': 'data1.library.sh.cn',
		'port': '',
		'path': path,
		'method': 'get',
		'headers': {
			
		},
		'timeout': 10*1000
	};
	var tempObj = {

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
		var data = [];
		tempObj = JSON.parse(html);
		if (tempObj.data == []) {
			data = [];
		} else {
			for (var i = 0; i < tempObj.data.length; i++) {
				var dataObj = {

				};
				if ((tempObj.data)[i].dtitle != undefined) {
					dataObj['title'] = (tempObj.data)[i].dtitle;
				} else {
					dataObj['title'] = '';
				}
				


				if ((tempObj.data)[i].creator == []) {
					dataObj['creator'] = [];
				} else {
					var creator = [];
					for (var j = 0; j < (tempObj.data)[i].creator.length; j++){
						var creatorObj = {

						};
						if ((((tempObj.data)[i].creator)[j]).temporalValue != undefined) {
							creatorObj['temporal'] = (((tempObj.data)[i].creator)[j]).temporalValue;
						} else {
							creatorObj['temporal'] = '';
						}

						if ((((tempObj.data)[i].creator)[j]).label != undefined) {
							creatorObj['label'] = (((tempObj.data)[i].creator)[j]).label;
						} else {
							creatorObj['label'] = '';
						}
						
		 				
		 				creator.push(creatorObj);
					}
					dataObj['creator'] = creator;
				}
				if ((tempObj.data)[i].label != undefined) {
					dataObj['version'] = (tempObj.data)[i].label;
				} else {
					dataObj['version'] = '';
				}
				
				if ((tempObj.data)[i].fullClassName != undefined) {
					dataObj['class'] = (tempObj.data)[i].fullClassName;
				} else {
					dataObj['class'] = '';
				}
				
				if ((tempObj.data)[i].uri != undefined) {
					dataObj['uri'] = (tempObj.data)[i].uri;
				} else {
					dataObj['uri'] = '';
				}
				data.push(dataObj);
			}

		}
		res.write(JSON.stringify(data));
		res.end();
	};
	fn2();
});  
module.exports = router;  