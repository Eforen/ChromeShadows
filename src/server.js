/**
 * To run the server:
 * node ChromeShadows [options]
 *
 * Options:
 *	-v Verbose logging
 *	--locale Locale to use as default
 *	--port Port to run server on
 *  --respawn Minutes between respawn
 *  --save Minutes between autosave
 */

//General Library Imports
/*
var util = require('util'),
	commander = require('commander'),
	localize = require('localize'),
	telnet = require('wez-telnet'),
	fs = require('fs'),
	colorize = require('colorize'),
	clear = require('clear'),
	redux = require('redux');
*/
import util from 'util'
import commander from 'commander'
import localize from 'localize'
import telnet from 'wez-telnet'
import fs from 'fs'
import colorize from 'colorize'
import clear from 'clear'

//Inner Libraries
//var Events = require('./events.js')
import {getStore} from './data';
import * as actionCOM from './actions/connections'

//Globals
var packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'))
var version = packageObj.version

commander
	.version('0.0.1') // todo: yank from package.json
	.option('-s, --save [time]', 'Number of minutes between auto-save ticks [10]', 10)
	.option('-r, --respawn [time]', 'Number of minutes between respawn tickets [20]', 20)
	.option('-p, --port [portNumber]', 'Port to host telnet server [23]', 23)
	.option('-l, --locale [lang]', 'Default locale for the server', 'en')
	.option('-v, --verbose', 'Verbose console logging.')
	.parse(process.argv);

//Main logic

//commands
//data
//rooms
//items

//Data Store

//Data arrays
var playerData = [],
roomData = [],
itemData = [],
npcsData = [];

// Server Vars
var saveinterval;

function init(rebootServer){
	
	rebootServer = typeof rebootServer == 'boolean' ? rebootServer : true; //Set default

	if(rebootServer){
		util.log("Server: Starting on port "+commander.port+"...");
 
 		var s = new telnet.Server(function (socket) {
			// I am the connection callback
			


			/*
			// Register all of the events
			for (var event in Events.events) {
				socket.on(event, Events.events[event]);
				util.log("Events: "+event+" loaded...");
			}

			socket.write("Connected... Hello World...\n\r"+
						 "Talk to me!\n\r"+
						 ">. ");
			socket.on('data', function (buf) {
				console.log("data:", buf.toString('ascii'));
				socket.telnetCommand(253, [248]);
				socket.write("You said " + buf + '\n\r'+
							 '>. ');
			});
			socket.on('resize', function (width, height) {
				console.log("resized to %dx%d", width, height);
			});
			*/

			socket.on('data', function (buf) {
				//console.log("Connection #"+socket.ConnectionID+": MSG...")
				getStore().dispatch(actionCOM.newMsg(socket.ConnectionID, buf))
			});
			socket.on('interrupt', function () {
				getStore().dispatch(actionCOM.interrupt(socket.ConnectionID))
			});
			socket.on('close', function () {
				getStore().dispatch(actionCOM.close(socket.ConnectionID))
			});

			getStore().dispatch(actionCOM.newCom(socket))
			console.log("Connection #"+socket.ConnectionID+": Connected...")

			//socket.emit('login', socket);
		});
		s.listen(commander.port).on('error', function(err) {
			if (err.code === 'EADDRINUSE') {
				util.log("Cannot start server on port " + commander.port + ", address is already in use.");
				util.log("Do you have a MUD server already running?");
			} else if (err.code === 'EACCES') {
				util.log("Cannot start server on port " + commander.port + ": permission denied.");
				util.log("Are you trying to start it on a priviledged port without being root?");
			} else {
				util.log("Failed to start MUD server:");
				util.log(err);
			}
			process.exit(1);
		});
	}
}

/**
 * Save all activated players
 */
function save(){
	util.log("Data: Saving All...");
	//Save Each
	util.log("Data: Saving Done...");
}


/**
 * Load rooms, items, npcs. Register everything.
 * Configure everything.
 */
function load(callback){
	util.log("Data: Saving All...");
	//Save Each
	util.log("Data: Saving Done...");
}

let serverCommandAlias = {
	saveall: 'saveAll',
	loadall: 'hotswap',
	hotswap: 'hotswap',
	save: 'saveObj',
	load: 'loadObj',
	restart: 'restart',
	reboot: 'restart',
	stop: 'shutdown',
	shutdown: 'shutdown',
	exit: 'shutdown',
	halt: 'shutdown',
	quit: 'shutdown',
	help: 'help'
}

/**
 * Commands that the server executable itself accepts in its CMD
 */
let serverCommandMethods = {
	/**
	 * Save all server data including active players
	 */
	saveAll : function (args)
	{
		save();
	},
	/**
	 * Hard restart that drops all connected players after saving
	 */
	restart: function (args)
	{
		util.log("RESTARTING...");
	},
	/**
	 * Attempt restart but keep players connected
	 */
	hotswap : function (args)
	{
		util.log("HOTSWAPING Data...");
	},
	/**
	 * Shutdown that drops all connected players after saving
	 */
	shutdown : function (args)
	{
		save();
		util.log("Shutting Down...");
  		process.exit( );
	},
	/**
	 * Show CMD help stuff
	 */
	help : function (args)
	{
		save();
		util.log(colorize.ansify('#cyan[Available Commands]:\n'+
			'\t#blue[*] #green[SaveAll]\n'+
			'\t\tSave all server data including active players\n'+
			'\t#blue[*] #green[Restart]\n'+
			'\t\tHard restart that drops all connected players after saving\n'+
			'\t#blue[*] #green[Hotswap]\n'+
			'\t\tAttempt restart but keep players connected\n'+
			'\t#blue[*] #green[Shutdown]\n'+
			'\t\tShutdown that drops all connected players after saving\n'+
			'\t#blue[*] #green[Help]\n'+
			'\t\tThis message\n'));
	}
};

// Clear stuff
clear();

// Tell node to use Unicode
process.stdin.setEncoding('utf8');

// Start that shit up!!!
init();

//join the main thread
process.stdin.resume();

//Gracefull Shutdown
process.on( 'SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  serverCommandMethods.shutdown()
  process.exit( );
})


//Proccess serverside commands
process.stdin.on('data', function (data)
{
	data = data.toLowerCase();
	data = data.trim();
	var command = data.split(' ');

	if (!(command[0] in serverCommandAlias)) {
		console.log("Command Not Found...");
		return;
	}

	serverCommandMethods[serverCommandAlias[command[0]]](data.split(' ').slice(1).join(' '));
});