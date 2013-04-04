var ircLib = require('irc'), fs = require('fs'), http = require('http'), twitter = require('ntwitter');

// Config

var config = require('./config.js');

var client = new ircLib.Client(config.server, config.botname , {
	channels: config.channels,
	userName: config.username,
	password: config.password,
	realName: config.realname
});

// Twitter

var twit = require('./twitcredentials.js');

var t = new twitter({
	consumer_key: twit.consumer_key,
	consumer_secret: twit.consumer_secret,
	access_token_key: twit.access_token_key,
	access_token_secret: twit.access_token_secret
});


// Command Handlers

if (typeof String.prototype.startsWith != 'function') { // Thanks to http://stackoverflow.com/a/646643/2152712
	String.prototype.startsWith = function (str){
		return this.indexOf(str) == 0;
	};
}

function inArray(needle, haystack) { // Thanks to http://stackoverflow.com/a/784015/2152712
	var length = haystack.length;
	for(var i = 0; i < length; i++) {
		if(haystack[i] == needle) return true;
	}
	return false;
}

function mE(isadmin,exact,inputMessage,inputWant){
	if (isadmin === true && inArray(from,config.admins) == false){
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

// Ccommands

client.addListener('message', function (from, to, message) {

	console.log(to + ' => ' + from + ': ' + message);

	if (mE(false,true,message,"meow")){
		client.say(to,"nyan~");
	} else if (mE(false,true,message,"about")){
		client.say(to,"A bot made by Madison Tries to do things for her because she is lazy.");
		client.say(to,"Source available at: https://github.com/Phalanxia/MadiBot/");
	} else if (mE(false,true,message,"help")){
		client.notice(from,"meow, now, help, say, act, moo, snug | Admin Commands: join, part, say-a, act-a, tweet");
	} else if (mE(true,true,message,"quit")){
		// How do
	} else if (mE(true,false,message,"join")){
		var cleaned = message.substring(6, message.length);
		client.join(cleaned);
	} else if (mE(true,false,message,"part")){
		var cleaned = message.substring(6, message.length);
		client.part(cleaned);
	} else if (mE(true,false,message,"tweet")){
		var toPost = message.substring(message.length, 7);
		t.updateStatus(toPost, function(err, data){
			if (err) console.log('Tweeting Failed: ' + err);
			else console.log('Tweeted! <3');
		});
	} else if (mE(true,false,message,"say-a ")){
		var splitMessage = message.split(" ");
		var parsedmessage = splitMessage[1].length + splitMessage[0].length + 2;
		client.say(splitMessage[1],message.substring(parsedmessage,message.length));
	} else if (mE(false,false,message,"say ")){
		var say = message.substring(message.length, 5);
		client.say(to,say);
	} else if (mE(true,false,message,"act-a ")){
		var splitMessage = message.split(" ");
		var parsedmessage = splitMessage[1].length + splitMessage[0].length + 2;
		client.action(splitMessage[1],message.substring(parsedmessage,message.length));
	} else if (mE(true,false,message,"act ")){
		var say = message.substring(message.length, 5);
		client.action(to,say);
	} else if (mE(true,false,message,"snug ")){
		var target = message.substring(message.length, 6);
		client.action(to, "snuggles " + target + " ;3");
	} else if (mE(false,true,message,"now")){
		var nowtime = new Date();
		client.say(to,nowtime);
	} else if (mE(false,false,message,"moo")){
		client.action(to,'licks ' + from + ";3");
	}
});

// Errors

client.addListener('error', function(message) {
	console.log('error: ', message);
});