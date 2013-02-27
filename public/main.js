require.config({
  baseUrl:"/",
  paths:{
    jquery:'javascripts/jquery',
    underscore:'javascripts/lodash',
    backbone:'javascripts/backbone',
    springy:'javascripts/springy',
    springyui:'javascripts/springyui'
  },
  shim:{
    underscore:{
      exports:"_"
    },
    backbone:{
      deps:['underscore', 'jquery'],
      exports:'Backbone'
    },
    springy: {
      deps:['jquery']
    },
    springyui: {
      deps:['jquery','springy']
    }
  }
});


require(['jquery', 'backbone', 'javascripts/text!views/basic.html', 'springy', 'springyui'], function ($, Backbone, view) {


//  console.log(view);
  var BasicView = Backbone.View.extend({

    template:_.template(view),

    initialize:function (args) {

      var self = this;

      $("#form").on('submit', function (evt) {
        var query = $("#query").val(),
          url = '/search?query=' + encodeURIComponent(query),
          str = "<UL>",
          matches, term, substr;

        var basicView = new BasicView({el:'#basic-view'});

        $.get(url, function (data, textStatus, jqXhr) {

          self.render(data);

        });
        return false;
      });


    },

    render:function (data) {

      var graph = new Graph(), term, dest_name, dest_node, dest_term, orig_node;
      var nodes = {};

      for (var i=0; i<data.terms_array.length; i++) {
        var term_name = data.terms_array[i];
        console.log("Creating node "+term_name);
        nodes[term_name] = graph.newNode({label: term_name});
      }

      for (var term_name in data.terms) {

        term = data.terms[term_name]  ;

        console.log("Creating arcs for "+term_name + " : "+term.length);

          orig_node = nodes[term_name];

          for (var k=0; k<term.length; k++) {

            dest_name = term[k];
            console.log("... to "+dest_name);

            dest_node = nodes[dest_name];
            if (dest_node && orig_node) {
              console.log("... to "+dest_name);
              graph.newEdge(orig_node, dest_node, {color: '#22A', rank: k});
            }
          }

      }

      var springy = $('#springy-demo').springy({
        graph:graph,
        nodeSelected:function (node) {
          console.log('Node selected: ' + JSON.stringify(node.data));
        }
      });
    }


  });

  var basicView = new BasicView({el:'#basic-view'});

});
