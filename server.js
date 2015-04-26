var express = require('express');
var path = require('path');
var auth = require('basic-auth');
var compression = require('compression');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// The io connection

	io.on('connection',function(client){

		client.emit('connect',{
			foo:'bar'
		});

	});

// The actual bot

	var Slack = require('slack-client');
	var slack = new Slack(process.env.SLACK_TOKEN, true, true);

	slack.on('open', function () {
		console.log('Welcome to Slack. You are ' + slack.self.name + ' of ' + slack.team.name);
	});

	slack.on('message', function(message) {
		var channel = slack.getChannelGroupOrDMByID(message.channel);
		var user = slack.getUserByID(message.user);
		if (message.type === 'message' && channel.is_im && user.name != 'slackbot') {

			// Process the message here instead of just emitting message
			io.sockets.emit( 'message' , {
				user: user.name,
				text: message.text
			} );
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
