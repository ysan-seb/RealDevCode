const express = require('express')
const app = express()
const db = require('./db.json')
const data = []

app.get('/logs', (req, res) => {
    let response = {}
    let currentCursor

    if (!req.query.cursor) {
        response.next = `http://localhost:${port}/logs/?cursor=2`
        response.previous = null
        response.results = data[0]
        res.status(200).end(JSON.stringify(response))
    } else {
        currentCursor = parseInt(req.query.cursor)
        if (currentCursor >= 1 && currentCursor <= data.length) {
            if (currentCursor + 1 <= data.length)
                response.next = `http://localhost:${port}/logs/?cursor=${(currentCursor + 1)}`
            else
                response.next = null
            if (currentCursor - 1 >= 1)
                response.previous = `http://localhost:${port}/logs/?cursor=${(currentCursor - 1)}`
            else
                response.previous = null
            response.results = data[currentCursor - 1]
            res.status(200).end(JSON.stringify(response))
        } else {
            res.status(400).end()
        }
    }
})

const port = process.env.PORT
const pageSize = process.env.PAGE_SIZE

app.listen(port, () => {
    let page = []
    let index = 0
    
    for (value of db.reverse()) {
        if ((index + 1) % (parseInt(pageSize)) != 0) {
            page.push(value.fields)
        } else {
            page.push(value.fields)
            data.push(page)
            page = []
        }
        index++
    }
    if (page)
        data.push(page)
	console.info(`Server started at http://localhost:${port}`)
})