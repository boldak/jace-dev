sails.services.sse.setOptions({
	pingInterval: false,
	maxClientCount:3,
	maxStreamDuration: 1000,
	clientRetryInterval: 3000,
	startId: 1,
	historySize: 100,
	rewind: 0
})

// setInterval( () => {
// 	sails.services.sse.state()
// }, 5000)


module.exports = {
  
  subscribe: function (req, res) {
  	let clientID = req.param('clientID')
  	// console.log("subscribe", clientID)
	let client = sails.services.sse.subscribe({
  		req,
  		res,
  		clientID
  	})
  },

  publish: function (req, res) {
  	let event = req.param('event')
  	console.log("publish ", event)
  	let data = req.body
  	sails.services.sse.publish(event, data)
  	res.ok()
  }

}  




