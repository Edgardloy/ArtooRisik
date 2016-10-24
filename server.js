require('dotenv').config();

const fs = require('fs');
const join = require('path').join;
const express = require('express');
const mongoose = require('mongoose');
const CONFIG = require('./config');
const bodyParser = require('body-parser');

const models = join(__dirname, 'app/models');
const PORT = process.env.PORT || 3000;
const APP = express();


//CONNESSION DATABASE MONGOLAB
// MONGOOSE.connect(process.env.MONGOHQ_URL, function(err){
//   if(err){
//     throw err;
//   }
//   console.info("database connesso");
// });

//MIDDLEWARE BODY PARSER
APP.use(bodyParser.urlencoded({extended:false}));
APP.use(bodyParser.json());


//FAVICON
APP.use(require('serve-favicon')(join(__dirname, "public","favicon.ico")));

//SERVE I FILE STATICI
APP.use('/', express.static(join(__dirname,  'public')));

//SERVE GLI SCRIPT DENTRO NODE MODULES, PER IL CLIENT
APP.use('/scripts', express.static(join(__dirname,  'node_modules')));
APP.use('/bundle', express.static(join(__dirname,  'build', 'App')));
APP.use('/vendor', express.static(join(__dirname,  'build', 'vendors')));


module.exports = APP;

// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(join(models, file)));

// Bootstrap routes
// require('./config/passport')(passport);
// require('./config/express')(app, passport);
require('./config/routes')(APP);

connect()
  .on('error', console.log)
  .on('disconnected', connect)
  .once('open', listen);

function listen () {
  APP.listen(PORT);
  console.log('Express app started on port ' + PORT);
}

function connect () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  return mongoose.connect(CONFIG.db, options).connection;
}
