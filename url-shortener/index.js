const express = require('express')
const app = express()

const port = 59350;

var newId = 1
var array = [];

function getEntry(id) {
	for (let i = 0; array[i]; i++) {
		if (array[i].id == id)
			return array[i]
	}
	return undefined
}

function setEntry(host) {
	let id = newId;
	let entry = {
		id: id,
		host: host
	}
	array.push(entry)
	newId++;
	return entry.id
}

app.post('/generate', (req, res) => {
	id = 0
	body = ''

	req.on('data', function (chunk) {
			body += chunk
	});

	req.on('end', function () {
		let ret
		ret = setEntry(body)
		res.status(200).send(ret.toString())
		res.end()
	})
})

app.get('/follow/:routeId', (req, res) => {
	let entry
	entry = getEntry(req.params.routeId)
	if (entry != undefined)
		res.writeHead(302, {'Location':entry.host, 'Content-Type':' text/plain; charset=utf-8'})
	else
		res.writeHead(404)
	res.end()
})

app.listen(port, () => {
		console.info(`Server started at http://localhost:${port}`);
})