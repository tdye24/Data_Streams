var express = require('express');  
var router = express.Router();  
var https = require('https');

/* GET characters page. */  
router.get('/', (req, res, next) => {
	let html = "";
	res.writeHead(200, {'Content-Type': 'application/json'});
	var path = '/cbdbapi/person.php?id=' + encodeURI(req.query.wd) + '&o=json';
	var options = {
		'host': 'cbdb.fas.harvard.edu',
		'port': '',
		'path': path,
		'method': 'get',
		'headers': {
			
		},
		'timeout': 60*1000
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
				console.log("Timeout!");
				html = '{"Package" : {"PersonAuthority" : {"PersonInfo" : ""}}}';
				resolve(html);
				req.abort();
			});
			req.on('error', (e) => {
				console.log("请求接口数据时发生错误！" + e.message);
			});
			req.end();
		});
	};
	async function fn2() {
		var tempObj = {

		};
		var obj = [];
		var personId = '';//Id
		var name = '';//姓名
		var gender = '';//性别
		var dynasty = '';//朝代
		
		var birth = '';//出生
		var dynastyBirth = '';
		var eraBirth = '';
		var eraYearBirth = '';
		
		var death = '';//死亡
		var dynastyDeath = '';
		var eraDeath = '';
		var eraYearDeath = '';

		var basicInfoObj = {

		};

		var personAddresses = {

		};

		var personKinshipInfoObj = {

		};

		var personSourcesObj = {

		};

		var personEntryInfo = {

		};

		var personPostingsObj = {

		};

		var personSocialStatusObj = {

		};

		let html = await fn1();
		if (JSON.parse(html).Package.PersonAuthority.PersonInfo == '') {
			obj = [];
		} else {
			tempObj = JSON.parse(html).Package.PersonAuthority.PersonInfo.Person;

			if (Object.keys(tempObj)[0] != 0) {
				basicInfoObj = tempObj.BasicInfo;
				personAddresses = tempObj.PersonAddresses;
				personKinshipInfoObj = tempObj.PersonKinshipInfo;
				personTextsObj = tempObj.PersonTexts;

				personSourcesObj = tempObj.PersonSources;

				personEntryInfoObj = tempObj.PersonEntryInfo;

				personPostingsObj = tempObj.PersonPostings;

				personSocialStatusObj = tempObj.PersonSocialStatus;

				personId = basicInfoObj.PersonId;

				name = basicInfoObj.ChName;
				
				gender = basicInfoObj.Gender;
				if(gender === '0') {
					gender = '男';
				} else {
					gender = '女';
				}

				dynasty = basicInfoObj.Dynasty;
				if (dynasty == '未詳'||dynasty == '') {
					dynasty = '';
				}

				dynastyBirth = basicInfoObj.DynastyBirth;
				eraBirth = basicInfoObj.EraBirth;
				eraYearBirth = basicInfoObj.EraYearBirth;

				dynastyDeath = basicInfoObj.DynastyDeath;
				eraDeath = basicInfoObj.EraDeath;
				eraYearDeath = basicInfoObj.EraYearDeath;

				if (dynastyBirth == '未詳'||dynastyBirth == '') {
					dynastyBirth = '';
				} else {
					dynastyBirth = '(' + dynastyBirth;
				}

				if (eraBirth == '未詳'||eraBirth == '') {
					eraBirth = '';
				}

				if (eraYearBirth == '未詳'||eraYearBirth == '') {
					eraYearBirth = '';
				} else {
					eraYearBirth += '年)';
				}

				if (dynastyDeath == '未詳'||dynastyDeath == '') {
					dynastyDeath = '';
				} else {
					dynastyDeath = '(' + dynastyDeath; 
				}

				if (eraDeath == '未詳'||eraDeath == '') {
					eraDeath = '';
				}

				if (eraYearDeath == '未詳'||eraYearDeath == '') {
					eraYearDeath = '';
				} else {
					eraYearDeath += '年)';
				}

				if(basicInfoObj.YearBirth == '未詳'||basicInfoObj.YearBirth == '') {
					birth = dynastyBirth + eraBirth + eraYearBirth;
				} else {
					birth = '公元' + basicInfoObj.YearBirth + '年' + dynastyBirth + eraBirth + eraYearBirth;
				}

				if(basicInfoObj.YearDeath == '未詳'||basicInfoObj.YearDeath == '') {
					death = dynastyDeath + eraDeath + eraYearDeath;
				} else {
					death = '公元' + basicInfoObj.YearDeath + '年' + dynastyDeath + eraDeath + eraYearDeath;
				}

				var personAliases = tempObj.PersonAliases;
				var alias = [];
				if (personAliases != '') {
					var aliasObj = personAliases.Alias;

					if (Object.keys(aliasObj)[0] != 0) {
						alias.push(aliasObj);
					} else {
						alias = aliasObj;
					} 

				} else {
					alias = [];
				}

				var address = [];
				
				if (personAddresses != '') {
					if(Object.keys(personAddresses.Address)[0] != 0) {
						var addressObj = {

						};
						addressObj['address1'] = personAddresses.Address.AddrName;
						addressObj['address2'] = personAddresses.Address.belongs1_name;
						addressObj['address3'] = personAddresses.Address.belongs2_name;
						addressObj['address4'] = personAddresses.Address.belongs3_name;
						addressObj['address5'] = personAddresses.Address.belongs4_name;
						addressObj['address6'] = personAddresses.Address.belongs5_name;
						address.push(addressObj);
					} else {
						
						for (var j = 0; j < personAddresses.Address.length; j++) {
							var addressObj = {

							};
							addressObj['address1'] = personAddresses.Address[j].AddrName;
							addressObj['address2'] = personAddresses.Address[j].belongs1_name;
							addressObj['address3'] = personAddresses.Address[j].belongs2_name;
							addressObj['address4'] = personAddresses.Address[j].belongs3_name;
							addressObj['address5'] = personAddresses.Address[j].belongs4_name;
							addressObj['address6'] = personAddresses.Address[j].belongs5_name;
							address.push(addressObj);
						}
					}
					
				} else {
					address = [];
				}



				var personTextsObj = tempObj.PersonTexts;
				var texts = [];
				if (personTextsObj != '') {
					var textsObj = personTextsObj.Text;

					if (Object.keys(textsObj)[0] != 0) {
						texts.push(textsObj);
					} else {
						texts = textsObj;
					}
				} else {
					texts = [];
				}

				var sourceList = [];
				var sourceStr = '';
				if(personSourcesObj == '') {
					source = [];
				}else{
					var sourceObj = personSourcesObj.Source;
					if(Object.keys(sourceObj)[0] != 0) {
						let sourceStr1 = sourceObj.Source;
						let sourceStr2 = sourceObj.Pages;
						if(sourceStr2 != '') {
							sourceStr = sourceStr1 + '(' + sourceStr2 + '页)';
						}else {
							sourceStr = sourceStr1;
						}
						sourceList.push(sourceStr);
					}else {
						for(var m = 0; m < sourceObj.length; m ++) {
							let sourceStr1 = sourceObj[m].Source;
							let sourceStr2 = sourceObj[m].Pages;
							if(sourceStr2 != '') {
								sourceStr = sourceStr1 + '(' + sourceStr2 + '页)';
							}else {
								sourceStr = sourceStr1;
							}
							sourceList.push(sourceStr);
						}
					}	
				}

				var entry = [];
				if(personEntryInfoObj == ''){
					entry = [];
				}else {
					var EntryObj = personEntryInfoObj.Entry;
					if(Object.keys(EntryObj)[0] != 0) {
						var door = EntryObj.RuShiDoor;
						var type = EntryObj.RuShiType;
						var year = EntryObj.RuShiYear;
						var notes = EntryObj.Notes;

						var info = '';
						if(year == '0' || year == '') {
							info = notes;
						}else {
							info = '(' + year + '年)' + notes;
						}

						entry.push({
							'door': door,
							'type': type,
							'info': info,
						});
					}else {
						var info;
						for(var index = 0; index < EntryObj.length; index++) {
							var door = EntryObj[index].RuShiDoor;
							var type = EntryObj[index].RuShiType;
							var year = EntryObj[index].RuShiYear;
							var notes = EntryObj[index].Notes;

							info = '';
							if(year == '0' || year == '') {
								info = notes;
							}else {
								info = '(' + year + ')' + notes;
							}

							entry.push({
								'door': door,
								'type': type,
								'info': info,
							});
						}
					}
					
				}

				var postings = [];
				if(personPostingsObj == '') {
					postings = [];
				}else {
					var posting = personPostingsObj.Posting;
					if(Object.keys(posting)[0] != 0) {
						var firstYear = posting.FirstYear;
						var officeName = posting.OfficeName;
						var type = posting.ChuShouType;
						var lastYear = posting.LastYear;

						if(lastYear == '0') {
							lastYear = '';
						}

						postings.push({
							'firstYear': firstYear,
							'name': officeName,
							'type': type,
							'lastYear': lastYear,
						});
					}else {
						for(var t = 0; t < posting.length; t++) {
							var firstYear = posting[t].FirstYear;
							var officeName = posting[t].OfficeName;
							var type = posting[t].ChuShouType;
							var lastYear = posting[t].LastYear;

							if(lastYear == '0') {
								lastYear = '';
							}

							postings.push({
								'firstYear': firstYear,
								'name': officeName,
								'type': type,
								'lastYear': lastYear,
							});
						}
					}
				}

				var status = [];
				if(personSocialStatusObj == '') {
					status = [];
				}else {
					var socialStatusObj = personSocialStatusObj.SocialStatus;

					if(Object.keys(socialStatusObj)[0] != 0) {
						status.push(socialStatusObj.StatusName);				
					}else {
						for(var id = 0; id < socialStatusObj.length; id ++) {
							status.push(socialStatusObj[id].StatusName + ' ');
						}
					}
				}



				var relation = [];
				if (personKinshipInfoObj == '') {
					relation = [];
				} else {
					var kinship = personKinshipInfoObj.Kinship;
					if (Object.keys(kinship)[0] != 0) {
						relation.push({
							'kinPersonId': kinship.KinPersonId,
							'kinPersonName': kinship.KinPersonName,
							'kinRelName': kinship.KinRelName
						});
					} else {
						
						for (var k = 0; k < kinship.length; k++) {
							var relationObj = {

							};
							relationObj['kinPersonId'] = kinship[k].KinPersonId;
							relationObj['kinPersonName'] = kinship[k].KinPersonName;
							relationObj['kinRelName'] = kinship[k].KinRelName;
							relation.push(relationObj);
						}
					}
				}

				obj.push({
					'id': personId,
					'name': name,
					'gender': gender,
					'dynasty': dynasty,
					'birth': birth,
					'death': death,
					'alias': alias,
					'address': address,
					'relation': relation,
					'texts': texts,
					'source': sourceList,
					'entry': entry,
					'postings': postings,
					'status': status,
				});
			} else {
				for (var i = 0; i < tempObj.length; i ++) {
					basicInfoObj = tempObj[i].BasicInfo;
					personAddresses = tempObj[i].PersonAddresses;

					personKinshipInfoObj = tempObj[i].PersonKinshipInfo;

					personSourcesObj = tempObj[i].PersonSources;

					personEntryInfoObj = tempObj[i].PersonEntryInfo;

					personPostingsObj = tempObj[i].PersonPostings;

					personSocialStatusObj = tempObj[i].PersonSocialStatus;

					personId = basicInfoObj.PersonId;

					name = basicInfoObj.ChName;

					gender = basicInfoObj.Gender;
					if(gender === '0') {
						gender = '男';
					} else {
						gender = '女';
					}

					dynasty = basicInfoObj.Dynasty;
					if (dynasty == '未詳'||dynasty == '') {
						dynasty = '';
					}

					dynastyBirth = basicInfoObj.DynastyBirth;
					eraBirth = basicInfoObj.EraBirth;
					eraYearBirth = basicInfoObj.EraYearBirth;

					dynastyDeath = basicInfoObj.DynastyDeath;
					eraDeath = basicInfoObj.EraDeath;
					eraYearDeath = basicInfoObj.EraYearDeath;

					if (dynastyBirth == '未詳'||dynastyBirth == '') {
						dynastyBirth = '';
					} else {
						dynastyBirth = '(' + dynastyBirth;
					}

					if (eraBirth == '未詳'||eraBirth == '') {
						eraBirth = '';
					}

					if (eraYearBirth == '未詳'||eraYearBirth == '') {
						eraYearBirth = '';
					} else {
						eraYearBirth += '年)';
					}

					if (dynastyDeath == '未詳'||dynastyDeath == '') {
						dynastyDeath = '';
					} else {
						dynastyDeath = '(' + dynastyDeath; 
					}

					if (eraDeath == '未詳'||eraDeath == '') {
						eraDeath = '';
					}

					if (eraYearDeath == '未詳'||eraYearDeath == '') {
						eraYearDeath = '';
					} else {
						eraYearDeath += '年)';
					}

					if(basicInfoObj.YearBirth == '未詳'||basicInfoObj.YearBirth == '') {
						birth = dynastyBirth + eraBirth + eraYearBirth;
					} else {
						birth = '公元' + basicInfoObj.YearBirth + '年' + dynastyBirth + eraBirth + eraYearBirth;
					}

					if(basicInfoObj.YearDeath == '未詳'||basicInfoObj.YearDeath == '') {
						death = dynastyDeath + eraDeath + eraYearDeath;
					} else {
						death = '公元' + basicInfoObj.YearDeath + '年' + dynastyDeath + eraDeath + eraYearDeath;
					}

					var personAliases = tempObj[i].PersonAliases;
					var alias = [];
					if (personAliases != '') {
						var aliasObj = personAliases.Alias;

						if (Object.keys(aliasObj)[0] != 0) {
							alias.push(aliasObj)
						} else {
							alias = aliasObj;
						} 

					} else {
						alias = [];
					}

					var address = [];

					if (personAddresses != '') {
						if(Object.keys(personAddresses.Address)[0] != 0) {
							var addressObj = {

							};
							addressObj['address1'] = personAddresses.Address.AddrName;
							addressObj['address2'] = personAddresses.Address.belongs1_name;
							addressObj['address3'] = personAddresses.Address.belongs2_name;
							addressObj['address4'] = personAddresses.Address.belongs3_name;
							addressObj['address5'] = personAddresses.Address.belongs4_name;
							addressObj['address6'] = personAddresses.Address.belongs5_name;
							address.push(addressObj);
						} else {
							
							for (var j = 0; j < personAddresses.Address.length; j++) {
								var addressObj = {

								};
								addressObj['address1'] = personAddresses.Address[j].AddrName;
								addressObj['address2'] = personAddresses.Address[j].belongs1_name;
								addressObj['address3'] = personAddresses.Address[j].belongs2_name;
								addressObj['address4'] = personAddresses.Address[j].belongs3_name;
								addressObj['address5'] = personAddresses.Address[j].belongs4_name;
								addressObj['address6'] = personAddresses.Address[j].belongs5_name;
								address.push(addressObj);
							}
						}
					}

					var personTextsObj = tempObj[i].PersonTexts;
					var texts = [];
					if (personTextsObj != '') {
						var textsObj = personTextsObj.Text;

						if (Object.keys(textsObj)[0] != 0) {
							texts.push(textsObj);
						} else {
							texts = textsObj;
						}
					} else {
						texts = [];
					}

					var sourceList = [];
					var sourceStr = '';
					if(personSourcesObj == '') {
						source = [];
					}else{
						var sourceObj = personSourcesObj.Source;
						if(Object.keys(sourceObj)[0] != 0) {
							let sourceStr1 = sourceObj.Source;
							let sourceStr2 = sourceObj.Pages;
							if(sourceStr2 != '') {
								sourceStr = sourceStr1 + '(' + sourceStr2 + '页)';
							}else {
								sourceStr = sourceStr1;
							}
							sourceList.push(sourceStr);
						}else {
							for(var m = 0; m < sourceObj.length; m ++) {
								let sourceStr1 = sourceObj[m].Source;
								let sourceStr2 = sourceObj[m].Pages;
								if(sourceStr2 != '') {
									sourceStr = sourceStr1 + '(' + sourceStr2 + '页)';
								}else {
									sourceStr = sourceStr1;
								}
								sourceList.push(sourceStr);
							}
						}	
					}

					var entry = [];
					if(personEntryInfoObj == ''){
						entry = [];
					}else {
						var EntryObj = personEntryInfoObj.Entry;
						if(Object.keys(EntryObj)[0] != 0) {
							var door = EntryObj.RuShiDoor;
							var type = EntryObj.RuShiType;
							var year = EntryObj.RuShiYear;
							var notes = EntryObj.Notes;

							var info = '';
							if(year == '0' || year == '') {
								info = notes;
							}else {
								info = '(' + year + '年)' + notes;
							}

							entry.push({
								'door': door,
								'type': type,
								'info': info,
							});
						}else {
							var info;
							for(var index = 0; index < EntryObj.length; index++) {
								var door = EntryObj[index].RuShiDoor;
								var type = EntryObj[index].RuShiType;
								var year = EntryObj[index].RuShiYear;
								var notes = EntryObj[index].Notes;

								info = '';
								if(year == '0' || year == '') {
									info = notes;
								}else {
									info = '(' + year + '年)' + notes;
								}

								entry.push({
									'door': door,
									'type': type,
									'info': info,
								});
							}
						}
						
					}

					var postings = [];
					if(personPostingsObj == '') {
						postings = [];
					}else {
						var posting = personPostingsObj.Posting;
						if(Object.keys(posting)[0] != 0) {
							var firstYear = posting.FirstYear;
							var officeName = posting.OfficeName;
							var type = posting.ChuShouType;
							var lastYear = posting.LastYear;

							if(lastYear == '0') {
								lastYear = '';
							}

							postings.push({
								'firstYear': firstYear,
								'name': officeName,
								'type': type,
								'lastYear': lastYear,
							});
						}else {
							for(var t = 0; t < posting.length; t++) {
								var firstYear = posting[t].FirstYear;
								var officeName = posting[t].OfficeName;
								var type = posting[t].ChuShouType;
								var lastYear = posting[t].LastYear;

								if(lastYear == '0') {
									lastYear = '';
								}

								postings.push({
									'firstYear': firstYear,
									'name': officeName,
									'type': type,
									'lastYear': lastYear,
								});
							}
						}
					}	


					var status = [];
					if(personSocialStatusObj == '') {
						status = [];
					}else {
						var socialStatusObj = personSocialStatusObj.SocialStatus;

						if(Object.keys(socialStatusObj)[0] != 0) {
							status.push(socialStatusObj.StatusName);				
						}else {
							for(var id = 0; id < socialStatusObj.length; id ++) {
								status.push(socialStatusObj[id].StatusName + ' ');
							}
						}
					}									

					var relation = [];
					if (personKinshipInfoObj == '') {
						relation = [];
					} else {
						var kinship = personKinshipInfoObj.Kinship;
						if (Object.keys(kinship)[0] != 0) {
							relation.push({
								'kinPersonId': kinship.KinPersonId,
								'kinPersonName': kinship.KinPersonName,
								'kinRelName': kinship.KinRelName
							});
						} else {
							for (var k = 0; k < kinship.length; k++) {
								var relationObj = {

								};
								relationObj['kinPersonId'] = kinship[k].KinPersonId;
								relationObj['kinPersonName'] = kinship[k].KinPersonName;
								relationObj['kinRelName'] = kinship[k].KinRelName;
								relation.push(relationObj);
							}
						}
					}
					obj.push({
						'id': personId,
						'name': name,
						'gender': gender,
						'dynasty': dynasty,
						'birth': birth,
						'death': death,
						'alias': alias,
						'address': address,
						'relation': relation,
						'texts': texts,
						'source': sourceList,
						'entry': entry,
						'postings': postings,
						'status': status,
					});
				}
			}
		}
		res.write(JSON.stringify(obj));
		res.end();
	};
	fn2();
});  
module.exports = router;  