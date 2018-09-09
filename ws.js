var ws = require('nodejs-websocket');

var server = ws.createServer(function(conn) {
	console.log('New Connection!');

	conn.on('text', function(data) {
		let dataObj = JSON.parse(data);
		switch (dataObj.type) {
			case 'info':
				broadcast(data);
				break;
			case 'message':
				broadcast(data)
				break;
			default:
				break;

		}
	});

	conn.on('error', function(err) {
		console.log(err);
	});

	function broadcast(str) {
		server.connections.forEach(function(conn) {
			conn.send(str);
		});
	}

}).listen(8000);