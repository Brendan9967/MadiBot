var ircLib = require('irc'), fs = require('fs'), http = require('http');

var config = require('./config.js');

var client = new ircLib.Client(config.server, config.botname , {
	channels: config.channels,
	userName: config.username,
	password: config.password,
	realName: config.realname
});

client.addListener('message', function (from, to, message) {
	console.log(to + ' => ' + from + ': ' + message);
	function mE(isadmin,inputMessage,inputWant){
		if (isadmin === true && from != config.admin){
			return false;
		} else {
			if (message.indexOf(config.commandchar + inputWant) > -1){
				return true;
			} else {
				return false;
			}
		}
	}
	if (mE(false,message,"meow")){
		client.say(to,"nyan~");
	} else if (mE(false,message,"about")){
		client.say(to,"A bot made by Madison Tries to do things for her because she is lazy.");
		client.say(to,"Source available at: https://github.com/Phalanxia/MadiBot/");
	} else if (mE(false,message,"help")){
		client.notice(from,"meow, time, help");
	} else if (mE(true,message,"quit")){
		// Not Yet
	} else if (mE(true,message,"join")){
		var cleaned = message.substring(5, message.length);
		client.join(cleaned);
		chans.push(cleaned);
	} else if (mE(true,message,"part")){
		// Idk How
	} else if (mE(false,message,"time")){
		var nowtime = new Date();
		client.say(to,nowtime);
	} else if (mE(false,message,"say")){
		var say = message.substring(5, message.length);
		client.say(to,say);
	} else if(mE(true,message,"admin")){
		client.say(to,"<3");
	}
});

client.addListener('error', function(message) {
	console.log('error: ', message);
});