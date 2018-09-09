var reg = function(reqQuery){
	var exp = /[0-9]/;
	var res = reqQuery.split(exp)[0];
	return res;
};

module.exports = reg;