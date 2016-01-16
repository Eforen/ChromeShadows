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
var util = require('util'),
	commander = require('commander'),
	localize = require('localize'),
	telnet = require('telnet'),
	fs = require('fs'),
	colorize = require('colorize'),
	clear = require('clear');

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

//Data arrays
var playerData = [],
roomData = [],
itemData = [],
npcsData = [];

// Server Vars
var saveinterval;

function init(){
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

serverCommandAlias = {
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
serverCommandMethods = {
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
  serverCommands.shutdown()
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