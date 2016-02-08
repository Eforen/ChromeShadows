

//let nextSocket = 0
const socketObj = []
const socketConnection = []

export function getNextSocketID() {
	return socketObj.length
}

export function getSocket(id) {
	return socketObj[id]
}
export function getSocketCon(id) {
	return socketConnection[id]
}
export function getConIdFromSocket(socket){
	for (var i = socketObj.length - 1; i >= 0; i--) {
		if(socketObj[i] == socket) return socketConnection[i]
	}
	return -1
}

export function addSocket(socket, ConID) {
	if(typeof(ConID) == "undefined") ConID = -1
	//socketObj.insert(nextSocket, socket)
	//socketConnection.insert(nextSocket, ConID)
	let nextSocket = socketObj.length
	//console.log("|"+nextSocket+"|")
	socketObj[nextSocket] = socket
	socketConnection[nextSocket] = ConID
	//nextSocket++
	return nextSocket
}

export function setSocketConnection(socketID, ConID) {
	//console.log("Socket #%d: Setting con to %d", socketID, ConID)
	if(typeof(ConID) == "undefined") ConID = -1
	if(socketConnection.length > socketID){
		let oldID = socketConnection[socketID]
		socketConnection[socketID] = ConID
		//socketConnection.insert(socketID, ConID)
		return oldID
	}
	return -1
}