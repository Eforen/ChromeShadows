import * as actions from "../actions/connections";
import * as fetchers from "../fetchers/connections";

import util from 'util'

//util.log("test Connections Start")

//util.log(util.inspect(actions, {showHidden: false, depth: null}))
//util.log(util.inspect(fetchers, {showHidden: false, depth: null}))
export var Connections = Object.assign(actions, fetchers)
//util.log(util.inspect(connectionsObject, {showHidden: false, depth: null}))

//util.log("test Connections End")
//exports = connectionsObject; 