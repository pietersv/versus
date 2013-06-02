
/*
 * GET home page.
 */

var Versus = require('../modules/versus.js').Versus;
var QueryLog = require('../modules/query');
var uap = require('ua-parser');

exports.index = {
  logs: function(req,res,next) {
    QueryLog.find(function(err, logs) {
      //res.send(logs);
      res.render('logs', {logs: logs});
    });
    //return res.render('logs', {query: 'not a query', data: null});
  },

  app: function(req, res){
    var query = req.query['query'];
    var r = uap.parse(req.headers['user-agent']);
    console.log(req.ip);
    console.log(r);

    console.log(req.headers['user-agent']);

    if (query) {

      console.log(query);


      var versus = new Versus();

      versus.analyze(query, function(data) {

        var links = [];
        var nodes = [];

        for (var term in data.terms) {

          nodes.push(term);

          var list = data.terms[term];

          for (var i=0; i<list.length; i++) {
            var dest = list[i];
            console.log("Adding link "+term+ " to "+dest);
            links.push({
              source: term,
              target: dest,
              rank: i
            });
          }
        }

        var queryLog = new QueryLog({
          query: query,
          result_count: nodes.length,
          user_agent: r,
          nodes: nodes,
          links: links,
          ip: req.ip
        });

        queryLog.save(function(err, log) {
          if (err) {
            console.log(err);
            next(err);
          }

        });

        res.render('index', { title: 'Express' , data: {nodes: nodes, links: links}, query: query});
      });
    }
    else {
      res.render('index', { title: 'Express' , data: null, query: null});
    };
  }
}
