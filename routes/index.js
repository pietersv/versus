
/*
 * GET home page.
 */

var Versus = require('../modules/versus').Versus;

exports.index = function(req, res){
  var query = req.query['query'];

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
      res.render('index', { title: 'Express' , data: {nodes: nodes, links: links}, query: query});
    });
  }
  else {
    res.render('index', { title: 'Express' , data: null, query: null});
  };
};
