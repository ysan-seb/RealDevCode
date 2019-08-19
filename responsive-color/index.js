const express = require('express')
const app = express()
const fs = require('fs')
const config = require('./config.json')
const port = 8000

function createArray() {
    var Colors = new Array();

    for (let i = 0; config[i]; i++) {
            Colors.push(createObject(config[i]))
    }
    return Colors
}

function createObject(array) {
    var color = {
        x: array[0],
        y: array[1],
        color: array[2]
    };
    return color
}

function htmlPage() {
    var Colors = createArray()
    var body = `<script>
                    var colors = ` + JSON.stringify(Colors) + `
                    check();
                    function getColor(colors) {
                        for (let i = 0; colors[i]; i++) {
                            if (colors[i].x >= x && colors[i].y >= y) {
                                return colors[i]
                            }
                        }
                        return undefined
                    }
                    function check() {
                        x = $(window).width();
                        y = $(window).height();
                        color = getColor(colors)
                        if (color == undefined)
                            document.body.style.backgroundColor = 'white'
                        else
                            document.body.style.backgroundColor = color.color
                    }

                    window.onresize = check
                </script>`;
    return '<!DOCTYPE html><html><head><meta name="viewport" content="initial-scale=1, maximum-scale=1"><script language="JavaScript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.0/jquery.min.js"></script></head><body>' + body + '</body></html>'
}

app.get('/', (req, res) => {
    res.end(htmlPage())
})

app.listen(port, () => {
    console.info(`Server started at http://localhost:${port}`);
})