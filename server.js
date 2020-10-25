require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
const PORT = process.env.PORT || 80

const db = require('./db.config.js')
const persons = require('./routes.js')

app.get('/persons/:id', persons.getById)
app.get('/persons', persons.getAll)
app.post('/persons', persons.create)
app.patch('/persons/:id', persons.updateById)
app.delete('/persons/:id', persons.deleteById)

const server = app.listen(PORT, function() {
	db.sequelize.sync({ force: true })
		.then(() => { 
			console.log('DB synced and ready!')
			let host = server.address().address
			let port = server.address().port
			console.log("App is listening at http://%s:%s", host, port)
			app.emit('appStarted')
		})	
})

module.exports = { app, server }