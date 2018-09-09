var express = require('express');  
var router = express.Router();  
var http = require('http');

/* GET works page. */  
router.get('/', (req, res, next) => {
	let html = "";
	var obj = [];
	res.writeHead(200, {'Content-Type': 'application/json'});
	//http://data1.library.sh.cn三国志7&key=9f1a3bca69ef5f35f1f073558338da1423de484f
	var path = '/gj/webapi/annotations?workTitle=' + encodeURI(req.query.wd) + '&source=' + encodeURI(req.query.source) + '&key=9f1a3bca69ef5f35f1f073558338da1423de484f';
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
		htmlObj = JSON.parse(html);
		var tempObj = htmlObj.data;
		if (tempObj == []) {
			obj = [];
		} else {
			for (var i = 0; i < tempObj.length; i++) {
				var dataObj = {

				};
				if (tempObj[i].hasWork.title != undefined) {
					dataObj['title'] = tempObj[i].hasWork.title;
				} else {
					dataObj['title'] = '';
				}
				var creator = [];
				if (tempObj[i].hasWork.creator != undefined) {
					if (tempObj[i].hasWork.creator == []) {
						creator = [];
					} else {
						for (var j = 0; j < (tempObj[i]).hasWork.creator.length; j ++) {
							var obje = {

							};
							if (tempObj[i].hasWork.creator[j].temporalValue != undefined) {
								obje['temporal'] = tempObj[i].hasWork.creator[j].temporalValue;
							} else {
								obje['temporal'] = '';
							}

							if (obje['label'] = tempObj[i].hasWork.creator[j].label != undefined){
								obje['label'] = tempObj[i].hasWork.creator[j].label;
							} else {
								obje['label'] = '';
							}
					
					
							creator.push(obje);
						}
					}
				} else {
					creator = [];
				}
				dataObj['creator'] = creator;
				dataObj['uri'] = tempObj[i].hasWork.uri;
				obj.push(dataObj);

			}
		}
		res.write(JSON.stringify(obj));
		res.end();
	};
	fn2();
});  
module.exports = router;  