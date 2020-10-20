const db = require('./db.config.js')
const Person = db.Person

exports.getById = (req, res) => {
    const id = req.params.id

    Person.findByPk(id)
        .then(person => {
            if (person)
                res.status(200).json(person)
            else
                res.sendStatus(404)
        })
        .catch(() => res.sendStatus(500))
}

exports.getAll = (req, res) => {
    Person.findAll({ order: db.sequelize.col('id') })
        .then(persons => res.status(200).json(persons))
        .catch(() => res.sendStatus(500))
}

exports.create = (req, res) => {
    let person = {}

    person.name = req.body.name
    person.age = req.body.age
    person.address = req.body.address
    person.work = req.body.work

    Person.create(person)
        .then(result => {
            res.header('Location', 'https://persons-pavlova.herokuapp.com/persons/' + result.id)
            res.sendStatus(201)
        })
        .catch(error => {
            res.status(500).json({
                message: "Fields validation error!",
                error: error.message
            })
        })
}

exports.updateById = (req, res) => {
    const id = req.params.id
    Person.findByPk(id)
        .then(person => {
            if (!person)
                res.sendStatus(404)
            else {
                const updatedPerson = {
                    name: req.body.name,
                    age: req.body.age,
                    work: req.body.work,
                    address: req.body.address
                }

                Person.update(updatedPerson, { where: { id: id }})
                    .then(() => res.sendStatus(200))
                    .catch(() => res.sendStatus(500))
            }
        })
        .catch(() => res.sendStatus(500))
}

exports.deleteById = (req, res) => {
    const id = req.params.id
    Person.findByPk(id)
        .then(person => {
            if (!person)
                res.sendStatus(404)
            else {
                person.destroy()
                    .then(() => res.sendStatus(200))
                    .catch(() => res.sendStatus(500))
            }
        })
        .catch(() => res.sendStatus(500))
}