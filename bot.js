var ircLib = require('irc'), fs = require('fs'), http = require('http');

var config = require('./config.js');

var client = new ircLib.Client(config.server, config.botname , {
	channels: config.channels,
	userName: config.username,
	password: config.password,
	realName: config.realname
});

if (typeof String.prototype.startsWith != 'function') {
	String.prototype.startsWith = function (str){
		return this.indexOf(str) == 0;
	};
}

client.addListener('message', function (from, to, message) {
	console.log(to + ' => ' + from + ': ' + message);
	function mE(isadmin,exact,inputMessage,inputWant){
		if (isadmin === true && from != config.admins){
			return false;
		} else {
			if (message.indexOf(config.commandchar + inputWant) > -1 && message.startsWith(config.commandchar + inputWant)){
				if (exact === true && message != config.commandchar + inputWant){
					return false;
				} else {
					return true;
				}
			} else {
				return false;
			}
		}
	}
	if (mE(false,true,message,"meow")){
		client.say(to,"nyan~");
	} else if (mE(false,true,message,"about")){
		client.say(to,"A bot made by Madison Tries to do things for her because she is lazy.");
		client.say(to,"Source available at: https://github.com/Phalanxia/MadiBot/");
	} else if (mE(false,true,message,"help")){
		client.notice(from,"meow, time, help");
	} else if (mE(true,true,message,"quit")){
	} else if (mE(true,false,message,"join")){
		var cleaned = message.substring(5, message.length);
		client.join(cleaned);
	} else if (mE(true,false,message,"part")){
		var cleaned = message.substring(6, message.length);
		client.part(cleaned);
	} else if (mE(true,false,message,"say-a ")){
		var splitmessage = message.split(" ");
		var parsedmessage = splitmessage[1].length + splitmessage[0].length + 2;
		client.say(splitmessage[1],message.substring(parsedmessage,message.length));
	} else if (mE(false,true,message,"now")){
		var nowtime = new Date();
		client.say(to,nowtime);
	} else if (mE(false,false,message,"say ")){
		var say = message.substring(message.length, 5);
		client.say(to,say);
	}
});

client.addListener('error', function(message) {
	console.log('error: ', message);
});