//Activate ES6
/*
require('babel-core/register')({
  // This will override `node_modules` ignoring - you can alternatively pass
  // an array of strings to be explicitly matched or a regex / glob
  ignore: false
});
require('babel-register')({
    "presets": ["es2015"]
});
*/

// load your app
require("./src/server.js");