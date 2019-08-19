const express = require('express')
const app = express()
var bodyParser = require('body-parser');

var db = []
var id = 1

function randomCode() {
	let str = process.env.INVITE_CODE_CHARS
	let number = str.length

	let code = str[Math.floor(Math.random() * number)]
	code += str[Math.floor(Math.random() * number)]
	code += str[Math.floor(Math.random() * number)]
	code += str[Math.floor(Math.random() * number)]
	code += str[Math.floor(Math.random() * number)]
	code += str[Math.floor(Math.random() * number)]
	return code
}

function setUser(username) {
	let newId = id
	let user = {
		id: 'user' + newId.toString(),
		data: {
			userName: username,
			inviteCode: randomCode(),
			invitedUsers:0
		}
	}
	db.push(user)
	id++
	return newId
}

function getUser(userId) {
	for (user of db) {
		if (user.id == userId)
			return user.data
	}
	return undefined
}

function getUserByInviteCode(inviteCode) {
	let res
	for (user of db) {
		if (user.data.inviteCode == inviteCode) {
			user.data.invitedUsers++
			return true
		}
	}
	return false
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/register', (req, res) => {
	let ret
	let retId
	if (req.body.userName) {
	    console.log('/register userName=' ,req.body.userName, '?inviteCode=', req.body.inviteCode)
		if (req.body.inviteCode && !getUserByInviteCode(req.body.inviteCode)) {
			res.writeHead(400)
			res.end()
		} else {
			ret = setUser(req.body.userName, req.body.inviteCode)
			res.writeHead(200, 'OK', {'Content-Type': 'application/json'})
			retId = 'user' + ret.toString()
			res.write(JSON.stringify(retId))
			res.end()
		}
	} else {
		res.writeHead(400)
		res.end()
	}	
})

app.get('/userProfile', (req, res) => {
	let user
	if (req.query.id) {
		console.log('/userProfile?id=', req.query.id)
		user = getUser(req.query.id)
		console.log('id=', req.query.id, 'user=', user)
		if (user != undefined) {
			res.writeHead(200, {'Content-Type': 'application/json'})
			res.write(JSON.stringify(user))
			res.end()
		} else {
			res.writeHead(404)
			res.end()
		}
	} else {
		res.writeHead(404)
		res.end()		
	}
})

const port = process.env.PORT
app.listen(port, () => {
		console.info(`Server started at http://localhost:${port}`)
})