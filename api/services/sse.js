

let options = {
	pingInterval: 3000,
	maxClientCount:3,
	maxStreamDuration: 30000,
	clientRetryInterval: 1000,
	startId: 1,
	historySize: 100,
	rewind: 0
}


let clients = []
let subscribers = {}

let messages = []

let nextID = options.startId

let setOptions = opts => {
	options = _.extend(options, opts)
}

let setHeader = client => {
	client.req.socket.setNoDelay(true);
	client.res.writeHead(200, {
		"Content-Type": "text/event-stream",
		"Cache-Control": "s-maxage="+(Math.floor(options.maxStreamDuration/1000)-1)+"; max-age=0; stale-while-revalidate=0; stale-if-error=0",
		"Connection": "keep-alive"
	});
	
	let body = "retry: " + options.clientRetryInterval + '\n\n';
	client.res.write(body);	
}

let subscribe = ({req, res, clientID}) => {
	let client = _.find(clients, c => c.clientID == clientID)
	if( client )  {
		res.end()
		return
	}

	if( (Number.parseInt(req.headers['last-event-id'], 10) == nextID-1) ){
		client = { req, res, clientID, lastMessageID: nextID }
		setHeader(client)
		unsubscribe(client)
		return
	}	
	
	client = { req, res, clientID, lastMessageID: nextID }
	setHeader(client)
	
	let lastID = Number.parseInt(req.headers['last-event-id'], 10);
	lastID = (!Number.isNaN(lastID)) ? lastID : nextID-2;
	lastID = (lastID > nextID) ? nextID : lastID
	
	let body = ""
	messages.filter( m => (m.id > lastID) && (m.id < nextID)).forEach(m => {
			body += m.output
			client.lastMessageID = m.id
		});
	
	client.res.write(body);
	clients.push(client);

	setTimeout(() => {
		if (!client.res.finished) {
			unsubscribe(client);
		}
	}, options.maxStreamDuration);
	client.res.on('close', () => {
		unsubscribe(client)
	});
	
	if( clients.length > options.maxClientCount) {
		clients = _.sortBy(clients,"lastMessageID")
		while ( clients.length > options.maxClientCount) {
			let removed = clients.pop()
			unsubscribe(removed)
		}	
	}

	return client;		
}

let unsubscribe = client => {
	client.res.end();
	let clientIndex = _.findIndex(clients, c => c.clientID == client.clientID)
	if( clientIndex < 0 ) return
	clients.splice(clientIndex,1);
}

let publish = ( eventName, data  ) => {
	const id = nextID;
	if (typeof data === "object") data = JSON.stringify(data);
	data = data ? data.split(/[\r\n]+/).map(str => 'data: '+str).join('\n') : '';

	const output = (
		(data ? "id: " + id + "\n" : "") +
		(eventName ? "event: " + eventName + "\n" : "") +
		(data || "data: ") + '\n\n'
	);
	
	[...clients].forEach(c => c.res.write(output));

	messages.push({ id, eventName, output });
	while (messages.length > options.historySize) {
		messages.shift();
	}
	nextID++;
	return id;
}

let state = () => {
	console.log(`Channel SSE: ${clients.map(c => c.clientID)}`)
} 



module.exports = {
	publish,
	subscribe,
	state,
	setOptions
}