var express = require('express');
var path = require('path');
var auth = require('basic-auth');
var compression = require('compression');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);


// Helper methods

	var makeMention = function(userId) {
		return '<@' + userId + '>';
	};
	 
	var isDirect = function(userId, messageText) {
		var userTag = makeMention(userId);
		return messageText &&
			   messageText.length >= userTag.length &&
			   messageText.substr(0, userTag.length) === userTag;
	};

// The io connection

	io.on('connection',function(client){
		// Send inital state somehow?
		return {foo:'bar'};
	});

// The actual bot

	var Slack = require('slack-client');
	var slack = new Slack(process.env.SLACK_TOKEN, true, true);

	slack.on('open', function () {
		var channels = Object.keys(slack.channels)
			.map(function (k) { return slack.channels[k]; })
			.filter(function (c) { return c.is_member; })
			.map(function (c) { return c.name; });

		var groups = Object.keys(slack.groups)
			.map(function (k) { return slack.groups[k]; })
			.filter(function (g) { return g.is_open && !g.is_archived; })
			.map(function (g) { return g.name; });

		console.log('Welcome to Slack. You are ' + slack.self.name + ' of ' + slack.team.name);

		if (channels.length > 0) {
			console.log('You are in: ' + channels.join(', '));
		}
		else {
			console.log('You are not in any channels.');
		}

		if (groups.length > 0) {
		   console.log('As well as: ' + groups.join(', '));
		}
	});

	slack.on('message', function(message) {

		var channel = slack.getChannelGroupOrDMByID(message.channel);
		//console.log( channel );
		var user = slack.getUserByID(message.user);
		
		io.sockets.emit( 'message' , message );

		if (message.type === 'message' && isDirect(slack.self.id, message.text)) {
			console.log('foo' + ':' + user.name + ':' + message.text);
		}
	});

	slack.login();





// Server boot for status display
	app.use(function(req, res, next) {
	    var user = auth(req);

	    if (user === undefined || user['name'] !== process.env.HTTP_USER || user['pass'] !== process.env.HTTP_PASSWORD) {
	        res.statusCode = 401;
	        res.setHeader('WWW-Authenticate', 'Basic realm="MyRealmName"');
	        res.end('Unauthorized');
	    } else {
	        next();
	    }
	});

	app.use(compression());
	app.use(express.static(path.join(__dirname, 'public')));



	server.listen(80);
	console.log('Server running at http://127.0.0.1/');
	console.log({
		team: process.env.SLACK_TEAM,
		token: process.env.SLACK_TOKEN
	});
