/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , https = require('https')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  ;
var app = express();

// the variable process.env.DB_URI is specified as a configuration variable
// For Heroku, this can be set as $> heroku config:set DB_URI=mongodb://...
// And locally, can be specifed in a .env file
// The confidential key is not committed to this open source project for simple reasons.

console.log("Using DB_URI="+process.env.DB_URI);
var db = mongoose.connect(process.env.DB_URI);



// see https://datamarket.azure.com/account/keys
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index.app);
app.get('/logs', routes.index.logs);


var bing = {
  acctKey : "W49bx6nMO94OwmrAIgxSOPjXI/JcN6jZlM1NFaTFYt0=",
  baseUrl : "https://api.datamarket.azure.com/Bing/Search/Web&Query=",
  host: 'api.datamarket.azure.com',
  path: '/Bing/Search/Web&Query='
};




http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

