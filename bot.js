var ircLib = require('irc');
var fs = require('fs');

var client = new ircLib.Client('irc.freenode.net','' , {
	channels: [''],
});

var commandChar = "*"

client.addListener('message', function (from, to, message) {
	console.log(to + ' => ' + from + ': ' + message);
	if (message.indexOf(commandChar + "meow") > -1){
		client.say(to,"Meow");
	} else if (message.indexOf(commandChar + "time") > -1){
		var nownow = new Date();
		client.say(to,nownow);
	} else if (message.indexOf(commandChar + "help") > -1){
		client.notice(from,"meow, time, help");
	}
});

client.addListener('error', function(message) {
	console.log('error: ', message);
});