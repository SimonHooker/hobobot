
var socket = io.connect('http://'+window.location.hostname+':80');

$(function() {

	var importantElements = {

	};


	var socket = io.connect('http://'+window.location.hostname+':80');

	socket.on('connect',function(data){
		// Iniital data


		console.log(data);
	});


	socket.on('message',function(data){

		console.log(data);

	});
	
});


