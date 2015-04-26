var AWS = require('aws-sdk'); 
var config = new AWS.Config({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION
});
var lambda = new AWS.Lambda();
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
/*
	user = {
		id: 'U04GR0T77',
		name: 'simon',
		real_name: 'Simon Hooker',
		profile: {
			email: 'simon@mso.net'
		},
		is_bot: false
	}
*/

		if (message.type === 'message' && channel.is_im && user.name != 'slackbot') {

			io.sockets.emit( 'message' , {
				user: user.name,
				text: JSON.stringify(message)
			} );
			/*
			var payload = {
				user: {
					id: user.id,
					name: user.name,
					real_name: user.real_name,
					email: user.profile.email
				},
				message: message
			};

			lambda.invoke({
				FunctionName: "hobobot-handle-message",
				Payload: JSON.stringify(payload)
			}, function(err, data) {
				if (err) {
					io.sockets.emit( 'message' , {
						user: user.name,
						text: JSON.stringify(err)
					} );
				} else {
					io.sockets.emit( 'message' , {
						user: user.name,
						text: JSON.stringify(data.payload)
					} );
				}
			});
			*/		

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
