var http = require('http');
var os = require('os');


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


		if (message.type === 'message' && isDirect(slack.self.id, message.text)) {
			console.log('foo' + ':' + user.name + ':' + message.text);
		}
	});

	slack.login();


// Server boot for status display
	var server = http.createServer(function (request, response) {
		response.writeHead(200, {'Content-Type': 'text/plain'});
		response.end('Hobobot is alive!\n');
	});
	server.listen(80);
	console.log('Server running at http://127.0.0.1/');
	console.log({
		team: process.env.SLACK_TEAM,
		token: process.env.SLACK_TOKEN
	});