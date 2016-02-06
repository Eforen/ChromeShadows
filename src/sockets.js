

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
	if(typeof(ConID) == "undefined") ConID = -1
	if(socketConnection.length > socketID){
		let oldID = socketConnection[socketID]
		socketConnection[socketID] = ConID
		//socketConnection.insert(socketID, ConID)
		return oldID
	}
	return -1
}