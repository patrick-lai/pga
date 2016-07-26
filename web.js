var express = require('express');
var app = express();
var http = require('http').Server(app);

var bodyParser = require("body-parser");
// Load the full build.
var lodash = require('lodash');
var path = require('path');
var pokegoScan = require('pokego-scan');

app.use(express.static(__dirname + "/dist"));

app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(function(req, res, next) {
  var allowedOrigins = ['http://127.0.0.1:5000', 'http://localhost:5000', 'https://whereispokemon.com','https://www.whereispokemon.com','https://whereispokemon.herokuapp.com/', 'http://localhost:9000'];

  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  // Set custom headers for CORS
  res.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Custom-Header");

  if (req.method === "OPTIONS") {
      return res.status(200).end();
  }

  next();
});

app.use(express.static(__dirname));

app.post('/fetch', function(req, res) {
  res.setHeader('Content-Type', 'application/json');

  var coords = {
      latitude: req.body.lat,
      longitude: req.body.lng
  };

  var distance = req.body.distance ? req.body.distance : 1000;

  pokegoScan(coords, {distance: distance}, function(pokemon) {
    res.send(JSON.stringify(pokemon));
  });
});

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.listen(process.env.PORT || 5000);
