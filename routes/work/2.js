var express = require('express');  
var router = express.Router();  
var http = require('http');

/* GET works page. */  
router.get('/', (req, res, next) => {
	let obj = {

	};
	res.writeHead(200, {'Content-Type': 'application/json'});
///gj/webapi/items?uri=http://data.library.sh.cn/gj/resource/instance/1mcj3rbrku35o3wx&key=9f1a3bca69ef5f35f1f073558338da1423de484f
//http://data1.library.sh.cn/gj/webapi/instanceInfo?uri=http://data.library.sh.cn/gj/resource/instance/1mcj3rbrku35o3wx&key=9f1a3bca69ef5f35f1f073558338da1423de484f
	var path1 = '/gj/webapi/instanceInfo?uri=' + encodeURI(req.query.wd) + '&key=9f1a3bca69ef5f35f1f073558338da1423de484f';
	var path2 = '/gj/webapi/items?uri=' + encodeURI(req.query.wd) + '&key=9f1a3bca69ef5f35f1f073558338da1423de484f';
	/*
	*接口2
	*/
	var options1 = {
		'host': 'data1.library.sh.cn',
		'port': '',
		'path': path1,
		'method': 'get',
		'headers': {
			
		},
		'timeout': 10*1000
	};
	/*
	*接口3
	*/
	var options2 = {
		'host': 'data1.library.sh.cn',
		'port': '',
		'path': path2,
		'method': 'get',
		'headers': {
			
		},
		'timeout': 10*1000
	}
	var html1 = '';
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
			req.setTimeout(options2.timeout, () => {
				console.log("Timeout!");
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
				console.log("Timeout!");
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


		// console.log(html1);
		// console.log(html2);

		if (html1.data.title != undefined) {
			obj['title'] = html1.data.title;
		} else {
			obj['title'] = '';
		}
		

		var creatorObj = {

		}; 
		var creator = [];
		if (html1.data.creator == []) {
			creator = [];
		} else {
			for (var i = 0; i < html1.data.creator.length; i++) {
				creatorObj = {

				};
				creatorObj['temporal'] = (html1.data.creator[i]).temporalValue;
				creatorObj['label'] = (html1.data.creator[i]).label;

				creator.push(creatorObj);
			}
		}

		var contributionObj = {

		};

		var contribution = [];
		if (html1.data.contribution == []) {
			contribution = [];
		} else {
			for (var i = 0; i < html1.data.contribution.length; i++) {
				contributionObj = {

				};
				contributionObj['temporal'] = (html1.data.contribution[i]).temporalValue;
				contributionObj['label'] = (html1.data.contribution[i]).label;
				contributionObj['role'] = (html1.data.contribution[i]).role;

				contribution.push(contributionObj);
			}
		}

		obj['creator'] = creator;
		obj['contribution'] = contribution;
		if (html1.data.label != undefined) {
			obj['version'] = html1.data.label;
		} else {
			obj['version'] = '';
		}
		
		if (html1.data.fullClassName) {
			obj['class'] = html1.data.fullClassName;
		} else {
			obj['class'] = '';
		}
		
		if (html1.data.extent) {
			obj['extent'] = html1.data.extent;
		} else {
			obj['extent'] = '';
		}

		var holding = [];
		if (html2.data == []) {
			holding = [];
		} else {
			for (var j = 0; j < html2.data.length; j ++) {
				var holdingObj = {

				};
				//shelfMark
				if ((html2.data[j]).shelfMark != undefined) {
					holdingObj['shelfMark'] = (html2.data[j]).shelfMark;
				} else {
					holdingObj['shelfMark'] = '';
				} 

				//DOI
				if ((html2.data[j]).DOI != undefined) {
					holdingObj['doi'] = (html2.data[j]).DOI;
				} else {
					holdingObj['doi'] = '';
				} 
				//heldBy
				var heldBy = [];
				if (html2.data.heldBy == []) {
					heldBy = [];
				} else {
					for (var k = 0; k < (html2.data[j]).heldBy.length; k ++) {
						var heldByObj = {

						};
						if (((html2.data[j]).heldBy[k]).address != undefined) {
							heldByObj['address'] = ((html2.data[j]).heldBy[k]).address;
						} else {
							heldByObj['address'] = '';
						}
						if (((html2.data[j]).heldBy[k]).label != undefined) {
							heldByObj['label'] = ((html2.data[j]).heldBy[k]).label;
						} else {
							heldByObj['label'] = '';
						}
						
						
						heldBy.push(heldByObj);
					}
					holdingObj['heldBy'] = heldBy;
					
				}
				
				holding.push(holdingObj);
			}
			
			
		}
		obj['holding'] = holding;

		res.write(JSON.stringify(obj));


		res.end();
	}
	fn3();
	
});  
module.exports = router;  