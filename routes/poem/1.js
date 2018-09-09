var express = require('express');  
var router = express.Router();  
var https = require('https');

/* GET poems page. */  
router.get('/', (req, res, next) => {
	let html = "";
	res.writeHead(200, {'Content-Type': 'application/json'});
	var path = '/api/poem?key=' + encodeURI(req.query.key) + '&scope=1' + '&dynasty=' + encodeURI(req.query.dynasty) + '&jsontype=true';
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
				console.log("Timeout！");
				req.abort();
			});
			req.on('error', (e) => {
				console.log("请求接口数据时发生错误！" + e.message);
			});
			req.end();
		});
	};
	async function fn2() {
		var obj = {

		};
		var tempObj = {

		};
		let html = await fn1();
		// console.log(html);
		tempObj = JSON.parse(html);
		//console.log(tempObj);
		if (tempObj && (tempObj.ShiData != undefined || tempObj.Authors != undefined)) {
			if (tempObj.Authors != undefined) {
				obj['Authors'] = tempObj.Authors;
			} else {
				obj['Authors'] = '';
			}
			
			obj['ShiData'] = [];
			if (tempObj.ShiData != undefined) {
				for (var i = 0; i < tempObj.ShiData.length; i ++) {

					var clausesObj = tempObj.ShiData[i].Clauses;
					var clauses = '';
					for (var j =0; j < clausesObj.length; j ++) {
						clauses += clausesObj[j].Content;
					};
					obj['ShiData'].push({
						'Title': tempObj.ShiData[i].Title.Content,
						'Dynasty': tempObj.ShiData[i].Dynasty,
						'Author': tempObj.ShiData[i].Author,
						'Type': tempObj.ShiData[i].Type,
						'Clauses': clauses
					});
				}
			} else {
				obj['ShiData'] = [];
			}
		}else {
			obj = null;

		}
		// console.log(obj);
		res.write(JSON.stringify(obj));
		// console.log(obj);
		res.end();
	};
	fn2();
});  
module.exports = router;  