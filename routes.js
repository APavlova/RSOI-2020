const db = require('./db.config.js')
const Person = db.Person

exports.create = (req, res) => {
    let person = {}

    //Проверка на наличие данных
    if (Object.keys(req.body).length == 0)
        return res.status(400).json({ message: "No data" })

    person.name = req.body.name
    person.age = req.body.age
    person.address = req.body.address
    person.work = req.body.work

    Person.create(person)
        .then(result => {
            res.header('Location', 'https://persons-pavlova.herokuapp.com/persons/' + result.id);
            res.sendStatus(201)
        })
        .catch(error => {
            res.status(500).json({
                message: "Fields validation error!",
                error: error.message
            })
        })
}