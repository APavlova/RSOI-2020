const db = require('./db.config.js')
const Person = db.Person

exports.create = (req, res) => {
    let person = {}

    try {
        person.name = req.body.name
        person.age = req.body.age
        person.address = req.body.address
        person.work = req.body.work

        Person.create(person).then(() => {
            // res.header('Location', 'https://rsoi-person-service.herokuapp.com/persons/' + result.ops[0]._id);
            res.sendStatus(201)
        })
    } catch (error) {
        res.status(500).json({
            message: "Fail!",
            error: error.message
        })
    }
}