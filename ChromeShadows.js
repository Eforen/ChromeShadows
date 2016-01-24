//Activate source mapping support
import { install } from 'source-map-support';
    install();

//Activate ES6
require('babel-register');

// load your app
require("./src/server.js");