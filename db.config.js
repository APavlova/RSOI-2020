const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.Person = require('./person.model.js')(sequelize, Sequelize)

module.exports = db