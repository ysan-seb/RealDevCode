const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const names = require('./names.json')
const port = process.env.PORT
const suggestionNumber = process.env.SUGGESTION_NUMBER

function getDataBase() {
    let db = new Array()

    for (key in names) {
        let obj = {}
        obj.name = key
        obj.times = names[key]
        db.push(obj)
    }
    return db
}

function sortData(array) {
    let output = array

    output.sort((a, b) => {
        if (a.times - b.times > 0) {
            return -1
        } else if (a.times - b.times == 0) {
            if (a.name.localeCompare(b.name) == 1)
            return 1
            else if (a.name.localeCompare(b.name) == 0)
            return 0
            else
            return -1
        } else {
            return 1
        }
    })
    return output
}

function findData(name) {
    let data = new Array()
    let db = getDataBase()
    let len = name.length

    for (elem of db) {
        let noCaseName = elem.name.toLowerCase().slice(0, len)
        if (noCaseName == name.toLowerCase())
            data.push(elem)
    }
    return data
}

function findName(name) {
    let data = new Array()
    let db = getDataBase()

    for (elem of db) {
        if (elem.name.toLowerCase() == name.toLowerCase()) {
            elem.times++
            data.push(elem)
        }
    }
    return data
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/typeahead/set', (req, res) => {
    let data
    data = findName(req.body.name)
    res.header("Content-Type",'application/json');
    if (data.length == 1)
        res.send(JSON.stringify(data[0]))
    else
        res.status(400).end()
})


app.get('/typeahead/', (req, res) => {
    let db = getDataBase()
    let output = sortData(db)
    output.splice(suggestionNumber)
    res.send(JSON.stringify(output))
})

app.get('/typeahead/:prefix', (req, res) => {
    let entry = {}
    let data = findData(req.params.prefix)

    if (data.length > 1) {
        entry = data.shift()
        data = sortData(data)
        data.splice(parseInt(suggestionNumber) - 1)
        data.unshift(entry)
        res.end(JSON.stringify(data))
    } else {
        res.end(JSON.stringify(data))
    }
})

app.listen(port, () => {
	console.info(`Server started at http://localhost:${port}`)
})