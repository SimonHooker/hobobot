
function HoboHandler(io,slack,AWS) {
	this.lambda = new AWS.Lambda();
	this.io = io;
	this.slack = slack;
}

HoboHandler.prototype.process = function(channel,user,message) {

	var hh = this;

	var action = hh.extractActionFromMessage( message.text );

	switch( action.method ) {
		case 'help':
			hh.sendHelp(channel,action.arguments);
			break;
		default:
			hh.sendUnknown(channel,action.arguments);
			break;
	}
};

HoboHandler.prototype.extractActionFromMessage = function(message) {

	var hh = this;
	var cleanerMessage = hh.removeUserTags(message);
	var messageAsArray = cleanerMessage.split(' ');

	return {
		method: messageAsArray.shift(),
		arguments: messageAsArray
	};
};

HoboHandler.prototype.removeUserTags = function(message) {
	var regexToRemoveIDTags = /<@[A-Z0-9]*>:?/gi;
	var regexToConsolidateWhitespace = /[\s]+/gi;
	return message
				.toLowerCase()
				.replace(regexToRemoveIDTags,'')
				.replace(regexToConsolidateWhitespace,' ')
				.trim();
};

HoboHandler.prototype.sendHelp = function(channel,arguments) {
	switch(arguments[0] || 'DEFAULT') {
		case 'help':
			channel.send('Why are you asking for help on the help command?');
			break;
		case 'DEFAULT':
			channel.send(
				'You may tell me to do the following things and I might even listen!\n'+
				'*Help* - These are here to help you apparently.\n'+
				'```'+
				'help                          returns this help list'+
				'\n'+
				'help command                  returns help on a specific command'+
				'```\n'+
				'*Timesheets* - Everyone lives timesheets right?\n'+
				'```'+
				'foo                           bar'+
				'\n'+
				'aetaeteeaea arg1 arg2         afsfsafass'+
				'```\n'
			);
			break;
		default:
			channel.send('I couldn\'t find any help subjects for *'+arguments[0]+'* - maybe you spelt it wrongly?');
			break;
	}
};

HoboHandler.prototype.sendUnknown = function(channel,arguments) {
	channel.send(
		'I\'m sorry but I didn\'t recognise that command'
	);
};

module.exports = HoboHandler;




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
/*
hh.io.sockets.emit( 'message' , {
	user: user.name,
	text: JSON.stringify(message)
} );
*/
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

hh.lambda.invoke({
	FunctionName: "hobobot-handle-message",
	Payload: JSON.stringify(payload)
}, function(err, data) {
	if (err) {
		hh.io.sockets.emit( 'message' , {
			user: user.name,
			text: JSON.stringify(err)
		} );
	} else {
		hh.io.sockets.emit( 'message' , {
			user: user.name,
			text: JSON.stringify(data.payload)
		} );
	}
});
*/	