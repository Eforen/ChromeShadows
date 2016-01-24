//Activate source mapping support
require('source-map-support').install();

//Activate nicer looking stack traces
//require('cute-stack')();

//Activate ES6
require('babel-register');

// load your app
require("./src/server.js");