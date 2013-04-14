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

// Commands

client.addListener('message', function (from, to, message) {

	console.log(to + ' => ' + from + ': ' + message);

	var adminCommands = {
		quit : function () {
			setTimeout(function() {
				console.log('Exiting.');
				process.exit(0);
			}, 100); },
		join : function (target,message) {
			client.join(target); },
		part : function (target,message) {
			client.part(target); },
		tweet : function (target,message) {
			t.updateStatus(message, function(err, data){
				if (err) {
					client.notice(from,'Tweeting Failed: ' + err);
					console.log('Tweeting Failed:' + err);
				} else {
					client.notice(from,'Tweeted <3');
					console.log('Tweeted <3');
				}
			}); },
		saya: function (target,message) {
			client.say(target,message.substring(target.length + 1,message.length)); },
		acta: function (target,message) {
			client.action(target,message.substring(target.length + 1,message.length)); }
	};

	var publicCommands = {
		meow : function () { 
			client.say(to,'nyan~'); },
		help : function () {
			client.notice(from,'meow, now, help, say, act, moo, snug, lick, poke | Admin Commands: join, part, quit, saya, acta, tweet'); },
		about : function () {
			client.say(to,'A bot made by Madison Tries to do things for her because she is lazy.');
			client.say(to,'Source available at: https://github.com/Phalanxia/MadiBot/'); },
		say: function (target,message) {
			client.say(to,message.substring(target.length + 1,message.length)); },
		act: function (target,message) { 
			client.action(to,message.substring(target.length + 1,message.length)); },
		snug : function (target,message) { 
			client.action(to, 'snuggles ' + target + ' <3 ;3'); },
		now : function () {
			var nowtime = new Date();
			client.say(to,nowtime); },
		moo : function () {
			client.action(to,'licks ' + from + ' ;3'); },
		lick : function (target,message) {
			client.action(to, 'licks ' + target + ' ;3'); },
		poke : function (target,message) {
			client.action(to, 'pokes ' + target); }
	};

	if (message.startsWith(config.commandchar)){
		console.log('Command Detected');
		message = message.substring(1, message.length);
		var parsedCommand = message.split(' ');
		var commandName = parsedCommand[0];
		var noCommand = message.substring(message.length, commandName.length + 1);
		if (typeof publicCommands[commandName] != 'undefined'){
			publicCommands[commandName](parsedCommand[1],noCommand);
		} else if (inArray(from,config.admins) == true){ // Is the user an admin? Check for admin commands!
			if (typeof adminCommands[commandName] != 'undefined'){
				adminCommands[commandName](parsedCommand[1],noCommand);
			}
		}
	}

});

// Errors

client.addListener('error', function(message) {
	console.log('error: ', message);
});