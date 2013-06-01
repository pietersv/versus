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


var config = {
  development: {
    uid: '1ac4255e-c655-4b1f-9220-189d49d2eb56',
    secret: 'and miles to go before we sleep',
    db: {
      "uri" : "mongodb://localhost/versus",
      "db": 'versus',
      "host": "localhost",
      "port": 27017
    }
  },
  production: {
    uid: '1ac4255e-c655-4b1f-9220-189d49d2eb56',
    secret: 'he shook his bells to ask if there was some mistake',
    db: {
      //mongodb://<dbuser>:<dbpassword>@ds053877.mongolab.com:53877/heroku_app11944434
      "uri": "mongodb://heroku_app12482736:i7vnkje9b8h8inaan4st1nh4fu@ds049467.mongolab.com:49467/heroku_app12482736",
      "db":"heroku_app12482736",
      "host":"ds049467.mongolab.com",
      "port":49467,
      "username":"heroku_app12482736",
      "password":"i7vnkje9b8h8inaan4st1nh4fu@ds049467",
      "shell": "mongo ds049467.mongolab.com:49467/heroku_app12482736 -u heroku_app12482736 -p i7vnkje9b8h8inaan4st1nh4fu@ds049467"
    }
  }
} [app.settings.env];



var db = mongoose.connect(config.db.uri);



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

