const express = require('express');
//const bodyParser = require('body-parser');
const createSchema = require('json-gate').createSchema;
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;

const app = express();
const jsonParser = express.json();

//Порт
const port = 8000;

const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
let dbClient;

//Проверка формата отправляемых данных
checkData = function(jsondata){
	var schema = createSchema({
		type: 'object',
		properties: {
			name: {
				type: 'string',
				required: true
			},
			age: {
				type: 'integer',
				maximum: 150,
				required: true
			},
			address: {
				type: 'string',
				required: true
			},
			work: {
				type: 'string',
				required: true
			}
		},
	    additionalProperties: false
	});

	try {
    	schema.validate(jsondata);
	} catch(err) {
    	return true //ошибки есть
	}	
	return false //ошибок нет
};

//числовой _id в монго
/* init в shell 
db.counters.insert(
   {
      _id: "personid",
      seq: 0
   }
)*/
function getNextSequence(name) {
   var ret = app.locals.counter.findAndModify(
          {
            query: { _id: name },
            update: { $inc: { seq: 1 } },
            new: true
          }
   );
   return ret.seq;
}


//Сервер и БД
mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db("personsdb").collection("persons");
    app.locals.counter = client.db("personsdb").collection("counter");
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
app.get("/persons/:id", function(req, res){
    const IdPerson = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOne({_id: IdPerson}, function(err, person){
        console.log('GET person by ID ', Number(IdPerson));

        console.log(person);
        
        //Запись для обновления не найдена
        if(!person)	return res.sendStatus(404);
        
        //Ошибка выполнения
        if(err) return res.sendStatus(500);
        
        //Найдена
        res.send(person);
    });        
});

//Cоздание новой записи о человеке
app.post("/persons", jsonParser, function(req, res){

	//Проверка на наличие данных
	if(Object.keys(req.body).length == 0) return res.status(400).json({"message":"No data"});

	//Проверка на соответствие формату данных которые пытаются добавить
	if(checkData(req.body))	return res.status(400).json({"message": "Data format error"});

    const collection = req.app.locals.collection;
	const person = {
		_id: getNextSequence("personid"),
		name: req.body.name, 
		age: req.body.age, 
		address: req.body.address, 
		work: req.body.work
	};
   	console.log('POST person ', person._id);

   	collection.insertOne(person, function(err, result){
       	//Ошибка выполнения
       	if(err) return res.sendStatus(500);

       	//Данные добавлены
       	res.header('Location', 'https://rsoi-person-service.herokuapp.com/persons/' + result.ops[0]._id);
       	res.sendStatus(201);
    });
});

//Обновление существующей записи о человеке
app.patch("/persons/:id", function(req, res){

	//Проверка на наличие данных
	if(!req.body) return res.status(400).json({"message":"No data"});

	//Проверка на соответствие формату данных которые пытаются добавить
	if(checkData(req.body))	return res.status(400).json({"message": "Data format error"});        

	const collection = req.app.locals.collection;
	const IdPerson = new objectId(req.params.id);

    collection.findOneAndUpdate({_id: IdPerson}, { $set: {
    	name: req.body.name,
    	age: req.body.age, 
		address: req.body.address, 
		work: req.body.work
		}}, {returnOriginal: false }, function(err, result){
        
        //Запись для обновления не найдена
        if(!result.value)
        	res.sendStatus(404);

        //Ошибка выполнения
       	if(err) return res.sendStatus(500);

        //Запись обновлена успешно
        res.sendStatus(200);
    });

});


//Удаление записи о человеке
app.delete("/persons/:id", function(req, res){
       
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOneAndDelete({_id: id}, function(err, result){
        
        //Запись не найдена
        if(!result.value)
        	res.sendStatus(404);
		
		//Ошибка БД
        if(err) return res.sendStatus(500);    
        
        //Запись удалена успешно
        res.sendStatus(200);
    });
});


//Завершение работы сервера
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});