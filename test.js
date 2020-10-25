process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()

const app = require('./server.js').app
const server = require('./server.js').server
const persons = require('./routes.js')
const db = require('./db.config.js')

chai.use(chaiHttp)

const testData = [
    {
        id: 1,
        name: "Sasha",
        age: 20,
        address: "Moscow, Sherbakovskaya st.",
        work: "None"
    },
    {
        id: 2,
        name: "Alena",
        age: 22,
        address: "Petrozavodsk, Murmanskaya st.",
        work: "BMSTU"
    },
    {
        id: 3,
        name: "Random",
        age: 35,
        address: "Kiev",
        work: "Vasya Pupkin and Co."
    }
]

before((done) => {
    app.on('appStarted', () => {
        db.Person.bulkCreate(testData).then(() => {            
            db.sequelize.query('ALTER SEQUENCE "people_id_seq" RESTART WITH 4;')
                .then(() => done())
        })
    })
})

after(() => {
    server.close(() => process.exit(0))    
})

describe('GET /persons', () => {
    it('возвращает массив объектов persons', (done) => {
        chai.request(app)
            .get('/persons')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')
                res.body.length.should.be.eql(3)
                res.body.should.be.deep.equal(testData)
                done()
            })
    })
})

describe('GET /persons/:id', () => {
    it('возвращает объект person по id при его наличии', (done) => {
        chai.request(app)
            .get('/persons/3')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.be.deep.equal(testData[2])
                done()
            })
    })

    it('возвращает 404 при отсутствии объекта с заданным id', (done) => {
        chai.request(app)
            .get('/persons/75')
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })

    it('возвращает 500 при некорректном id (не число)', (done) => {
        chai.request(app)
            .get('/persons/hgfjk')
            .end((err, res) => {
                res.should.have.status(500)
                done()
            })
    })
})

describe('POST /persons', () => {
    it('создаёт нового person и возвращает 201 с нужным Location', (done) => {
        const person = {
            name: 'NewPerson',
            age: 99,
            address: 'Moscow, Red Square',
            work: 'Kremlin'
        }

        chai.request(app)
            .post('/persons')
            .send(person)
            .end((err, res) => {
                res.should.have.status(201)
                res.should.have.header('Location', 'https://persons-pavlova.herokuapp.com/persons/4')
                chai.request(app)
                    .get('/persons/4')
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('object')
                        res.body.should.be.deep.equal({ id: 4, ...person })
                        done()
                    })
            })
    })

    it('возвращает ошибку 500 при попытке передать неполный объект person', (done) => {
        const person = {
            name: 'NewPerson',
            age: 99,
            work: 'Kremlin'
        }

        chai.request(app)
            .post('/persons')
            .send(person)
            .end((err, res) => {
                res.should.have.status(500)
                done()
            })
    })
})

describe('PATCH /persons/:id', () => {
    const newPerson = {
        name: 'newPersonName',
        age: 1,
        address: 'New Address',
        work: 'Kremlin'
    }

    it('возвращает 200 и обновляет запись в базе', (done) => {
        chai.request(app)
            .patch('/persons/3')
            .send(newPerson)
            .end((err, res) => {
                res.should.have.status(200)
                chai.request(app)
                    .get('/persons/3')
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.a('object')
                        res.body.should.be.deep.equal({ id: 3, ...newPerson })
                        done()
                    })
            })
    })

    it('возвращает 404 при попытке обновить несуществующую запись', (done) => {
        chai.request(app)
            .patch('/persons/55')
            .send(newPerson)
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })

    it('возвращает 500 при попытке ввести неккоректный id (не число)', (done) => {
        chai.request(app)
            .patch('/persons/gfhgfh')
            .send(newPerson)
            .end((err, res) => {
                res.should.have.status(500)
                done()
            })
    })

    it('возвращает 500 при попытке обновить, передав некорректный объект', (done) => {
        const newPersonBroken = { age: 'gfdgdfg', adress: 56 }

        chai.request(app)
            .patch('/persons/gfhgfh')
            .send(newPersonBroken)
            .end((err, res) => {
                res.should.have.status(500)
                done()
            })
    })
})

describe('DELETE /persons/:id', () => {
    it('возвращает 200 и удаляет запрашиваемый объект person', (done) => {
        chai.request(app)
            .delete('/persons/3')
            .end((err, res) => {
                res.should.have.status(200)
                chai.request(app)
                    .get('/persons')
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.not.include(testData[3])
                        done()
                    })
            })
    })

    it('возвращает 404 при отсутствии объекта с заданным id', (done) => {
        chai.request(app)
            .delete('/persons/56')
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it('возвращает 500 при вводе некорректного id (не число)', (done) => {
        chai.request(app)
            .delete('/persons/fghg')
            .end((err, res) => {
                res.should.have.status(500)
                done()
            })
    })
})