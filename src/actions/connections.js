import colorize from "colorize"

export const types = {
	NEW : "CON_NEW",
	INTERRUPT : "CON_INTERRUPT",
	MSG : "CON_MSG",
	CLOSE : "CON_CLOSE",
	RESIZE : "CON_RESIZE"
}

export function newCom(socket) {
	console.log("attempting new connection term=%s %dx%d",
		socket.term, socket.windowSize[0], socket.windowSize[1]);
	return {
		type: types.NEW,
		socket: socket
	}
}

export function interrupt(connectionID){
	return {
		type: types.INTERRUPT,
		id: connectionID
	}
}
export function resize(connectionID, width, height){
	return {
		type: types.RESIZE,
		id: connectionID,
		width: width,
		height: height
	}
}

export function newMsg(connectionID, msg) {
	return (dispatch, getState) =>  {
		getState().connections.forEach((con, index) => {
			con.socket.write(
				colorize.ansify("" + 
					(connectionID==index?"You say":(connectionID + " says")) +
					": #green["+msg.slice(0, msg.length - 1)+"]\n\r"
				)
			)
		})

		return dispatch({
			type: types.MSG,
			id: connectionID,
			msg: msg
		})
	}
}

export function close(connectionID) {
	console.log("END!");
	return {
		type: types.CLOSE,
		id: connectionID,
	}
}