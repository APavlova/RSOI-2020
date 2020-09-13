const express = require('express');
const bodyParser = require('body-parser');

const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;

const app = express();
const jsonParser = express.json();

//Порт
const port = 8000;

const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
let dbClient;

mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db("personsdb").collection("persons");
    app.listen(port, function(){
        console.log('Server is listening on ' + port);
    });
});

//Информация по всем людям
app.get("/persons", function(req, res){

	const collection = req.app.locals.collection;
    collection.find({}).toArray(function(err, persons){
        console.log('GET persons ', persons);
        if(err) return console.log(err);
        res.json(persons);
    });          
});  

//Информация о человеке
app.get("/persons:id", function(req, res){
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOne({_id: id}, function(err, person){
               console.log('GET person by ID ');
        if(err) return console.log(err);
        res.send(person);
    });        
});

//Cоздание новой записи о человеке
app.post("/persons", jsonParser, function(req, res){

	if(!req.body) return res.sendStatus(400);

    const personName = req.body.name;
    const personAge = req.body.age;
    const personAddress = req.body.address;
    const personWork = req.body.work;

    const collection = req.app.locals.collection;
    //const personId = collection.count();

    const person = {/*id:personId,*/ name: personName, age: personAge, address: personAddress, work: personWork};
       
    console.log('POST person ', person);
    collection.insertOne(person, function(err, result){
               
        if(err) return console.log(err);
        res.send(person);
    });        
});
/*
//обновление существующей записи о человеке;
app.patch("/persons:id", function(req, res){
        
});

//удаление записи о человеке.
app.delete("/persons:id", function(req, res){
        
});
*/
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});