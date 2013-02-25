/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , https = require('https')
  , http = require('http')
  , path = require('path')
  , versus = require('./modules/versus').versus;


var app = express();

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

app.get('/', routes.index);
app.get('/users', user.list);

var bing = {
  acctKey : "W49bx6nMO94OwmrAIgxSOPjXI/JcN6jZlM1NFaTFYt0=",
  baseUrl : "https://api.datamarket.azure.com/Bing/Search/Web&Query=",
  host: 'api.datamarket.azure.com',
  path: '/Bing/Search/Web&Query='
};



app.get('/search', function(req,res,next) {
  var query = req.param('query').trim();

  versus.analyze(query, function(data) {
    res.send(data);
  });
});



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


//https://api.datamarket.azure.com/Bing/SearchWeb/Web?Query=%27leo%20fender%27&Market=%27en-US%27&$top=50&$format=JSON"

//C4/m6Z3o4lAOK3oKCyMwVlrQY2SvWA6S5v7uE99xbmY=
//W49bx6nMO94OwmrAIgxSOPjXI/JcN6jZlM1NFaTFYt0=

//C4%2Fm6Z3o4lAOK3oKCyMwVlrQY2SvWA6S5v7uE99xbmY%3D

//https://user:C4%2Fm6Z3o4lAOK3oKCyMwVlrQY2SvWA6S5v7uE99xbmY%3D@api.datamarket.azure.com/Bing/SearchWeb/Web?Query=%27leo%20fender%27&Market=%27en-US%27&$top=50&$format=JSON

//https://user:C4%2Fm6Z3o4lAOK3oKCyMwVlrQY2SvWA6S5v7uE99xbmY%3D@api.datamarket.azure.com/Bing/Search/Web?Query=%27leo%20fender%27&Market=%27en-US%27&$top=50&$format=JSON