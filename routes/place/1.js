var express = require('express');  
var router = express.Router();  
var http = require('http');
/* 判断用户搜索的地点是否为中国地点 */
var isChina = function(countryList) {
	var flag = false;
	for (var i = 0; i < countryList.length; i ++) {
		if (countryList[i]['@value'] === '中国') {
			flag = true;
		}
	}
	return flag;
}
/* 返回简体字加繁体字格式 例中国（中國）*/
var chtAndChs = function(List) {
	var str = '';
	var str = (List[0]['@language'] === 'cht') ? (List[1]['@value'] + '(' + List[0]['@value'] + ')') : (List[0]['@value'] + '(' + List[1]['@value'] + ')');
	return str;
}
/* GET places page. */  
router.get('/', (req, res, next) => {
	let html1 = '';
	let html2 = '';
	res.writeHead(200, {'Content-Type': 'application/json'});
	var path1 = '/place/' + encodeURI(req.query.wd) + '?key=9f1a3bca69ef5f35f1f073558338da1423de484f';
	var path2 = '/place/' + encodeURI(req.query.wd.substring(0, req.query.wd.length - 1)) + '?key=9f1a3bca69ef5f35f1f073558338da1423de484f';
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
		let html1 = await fn1(options1);
		let html2 = await fn1(options2);
		var tempObj = {

		};
		var obj1 = {

		};
		var obj2 = {

		};
		if (!(html1 === '未查询到数据...')) {
			tempObj = JSON.parse(html1);
			let countryList = tempObj.country;		
			if (isChina(countryList)) {//中国地点	
				obj1['wd'] = req.query.wd;
				obj1['country'] = chtAndChs(tempObj.country);
				obj1['province'] = tempObj.province;
				if (tempObj.city) {
					obj1['city'] = tempObj.city;
				} else {
					obj1['city'] = '';
				}
				
				if (tempObj.county) {
					obj1['county'] = chtAndChs(tempObj.label);
				} else {
					obj1['county'] = '';
				}

			} else {//非中国地点
				obj1['wd'] = req.query.wd;
				obj1['country'] = chtAndChs(tempObj.country);
				obj1['label'] = chtAndChs(tempObj.label);
			}

			if(tempObj.long) {//精度
				obj1['long'] = tempObj.long;
			} else {
				obj1['long'] = 116.395645;
			}

			if(tempObj.lat) {//维度
				obj1['lat'] = tempObj.lat;
			} else {
				obj1['lat'] = 39.929986;
			}

		}
		if (!(html2 === '未查询到数据...')) {
			tempObj = JSON.parse(html2);
			let countryList = tempObj.country;

			if (isChina(countryList)) {//中国地点
				obj2['wd'] = req.query.wd;
				obj2['country'] = chtAndChs(tempObj.country);
				obj2['province'] = tempObj.province;
				if (tempObj.city) {
					obj2['city'] = tempObj.city;
				} else {
					obj2['city'] = '';
				}
				
				if (tempObj.county) {
					obj2['county'] = chtAndChs(tempObj.label);
				} else {
					obj2['county'] = '';
				}
			} else {//非中国地点
				obj2['wd'] = req.query.wd;
				obj2['country'] = chtAndChs(tempObj.country);
				obj2['label'] = chtAndChs(tempObj.label);
			}

			if(tempObj.long) {//精度
				obj2['long'] = tempObj.long;
			} else {
				obj2['long'] = 116.395645;
			}

			if(tempObj.lat) {//维度
				obj2['lat'] = tempObj.lat;
			} else {
				obj2['lat'] = 39.929986;
			}
		}
		if(JSON.stringify(obj1) === '{}') {
			res.write(JSON.stringify(obj2));
		} else {
			res.write(JSON.stringify(obj1));
		}

		res.end();
	};
	fn2();
});  
module.exports = router;  