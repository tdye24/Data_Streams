var express = require('express');  
var router = express.Router();  
var http = require('http');

/* GET works page. */  
router.get('/', (req, res, next) => {
	let html = "";
	res.writeHead(200, {'Content-Type': 'application/json'});
	var path = '/gj/webapi/seals?freeText=' + encodeURI(req.query.wd) + '&key=9f1a3bca69ef5f35f1f073558338da1423de484f';
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
		var obj = [];
		var data = JSON.parse(html).data;
		if (data == []) {
			obj = [];
		} else {
			for (var i = 0; i < data.length; i++) {
				var dataObj = {

				};
				if (data[i].sealCharacters != undefined) {
					dataObj['sealCharacters'] = data[i].sealCharacters;
				} else {
					dataObj['sealCharacters'] = '';
				}

				if (data[i].img != undefined) {
					if (data[i].img == []) {
						dataObj['img'] = [];
					} else {
						var img = [];
						for (var j = 0; j < data[i].img.length; j++) {
							img.push(data[i].img[j].imgUri);
						}
						dataObj['img'] = img;
					}
				} else {
					dataObj['img'] = [];
				}

				if (data[i].owner != undefined) {
					if (data[i].owner == []) {
						dataObj['owner'] = [];
					} else {
						var owner = [];
						for (var j = 0; j < data[i].owner.length; j++) {
							owner.push(data[i].owner[j].name);
						}
						dataObj['owner'] = owner;
					}
				} else {
					dataObj['owner'] = [];
				}
	
				if (data[i].libliotheca != undefined) {
					
					if (data[i].libliotheca == []) {
						dataObj['libliotheca'] = [];
					} else {
						var libliotheca = [];
						for (var k = 0; k < data[i].libliotheca.length; k++) {
							var libliothecaObj = {

							};
							libliothecaObj['name'] = data[i].libliotheca[k].name;
							libliothecaObj['description'] = data[i].libliotheca[k].description;
							libliotheca.push(libliothecaObj);
						}
						dataObj['libliotheca'] = libliotheca;
					}
					


				} else {
					dataObj['libliotheca'] = [];
				}
				obj.push(dataObj);
			}

		}
		res.write(JSON.stringify(obj));
		res.end();
	};
	fn2();
});  
module.exports = router;  