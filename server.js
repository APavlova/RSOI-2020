const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
const PORT = process.env.PORT || 80;

const persons = require('./routes.js')

app.post('/persons', persons.create)

const server = app.listen(PORT, function() {
	let host = server.address().address
	let port = server.address().port
	console.log("App listening at http://%s:%s", host, port)
})

/*
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
*/