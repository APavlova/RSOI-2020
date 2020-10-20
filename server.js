require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
const PORT = process.env.PORT || 80;


const db = require('./db.config.js')
db.sequelize.sync({ alter: true }).then(() => {
	console.log('DB sync!');
})

const persons = require('./routes.js')

app.get('/persons/:id', persons.getById)
app.get('/persons', persons.getAll)
app.post('/persons', persons.create)
app.patch('/persons/:id', persons.updateById)
app.delete('/persons/:id', persons.deleteById)

const server = app.listen(PORT, function() {
	let host = server.address().address
	let port = server.address().port
	console.log("App listening at http://%s:%s", host, port)
})