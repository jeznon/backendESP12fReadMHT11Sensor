const express = require('express');
const axios = require('axios');
const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;

const app = express();
const db = new JsonDB(new Config('./data', true, false, '/'));
try {
  db.load();
  console.log('Base de datos cargada correctamente.');
} catch(error) {
  console.log('Error al cargar la base de datos:', error);
}

app.get('/getLastData', function(req, res) {
  const lastData = db.getData('/datos');
  lastData.then((data) => {
  const onlyLastData = data[data.length - 1];
    res.send(onlyLastData);
  });
});

app.get('/getAllData', function(req, res) {
  const lastData = db.getData('/datos');
  lastData.then((data) => {
  const onlyLastTenData = data.slice(-10);
    res.send(onlyLastTenData);
  });
});

setInterval(function() {
  axios.get('http://192.168.0.36:8081') // this is my local ip address, you will need to change it according
    .then(function(response) {
      const datos = response.data;
      console.log(datos);
      db.push('/datos[]', datos, true);
    })
    .catch(function(error) {
      console.log(error);
    });
}, 15000);//define the interval in milliseconds to get the data

setInterval(function() {
  db.save();
  console.log('Los datos se han guardado en el archivo.');
}, 20000); //define the interval in milliseconds you want to save the data

app.listen(3000, function() {
  console.log('Servidor iniciado en el puerto 3000.');
});

