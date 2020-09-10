const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();

//Порт
const port = 8000;


//Парсинг запросов
app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  

app.get("/", (req, res) => res.json({message: "1"}));

app.post('/person', (req, res) => {
    console.log(person)





app.listen(port, () => {
  console.log('Server is listening on ' + port);
});
