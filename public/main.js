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


//      var content = this.template({data:data});
//      console.log(content);
//      this.$el.html(content);





      var graph = new Graph(), term, dest_name, dest_node, dest_term, orig_node;
      var nodes = {};

      for (var i=0; i<data.terms_array.length; i++) {
        var term_name = data.terms_array[i];
        console.log("Creating node "+term_name);
        nodes[term_name] = graph.newNode({label: term_name});
      }

      for (var term_name in data.terms) {

        term = data.terms[term_name];

        console.log("Creating arcs for "+term_name + " : "+term.length);

          orig_node = nodes[term_name];

          for (var k=0; k<term.length; k++) {

            dest_name = term[k];
            console.log("... to "+dest_name);

            dest_node = nodes[dest_name];
            if (dest_node && orig_node) {
              console.log("... to "+dest_name);
              graph.newEdge(orig_node, dest_node, {color: '#6A4A3C'});
            }
          }

      }
//
//      var dennis = graph.newNode({label:'Dennis'});
//      var michael = graph.newNode({label:'Michael'});
//      var jessica = graph.newNode({label:'Jessica'});
//      var timothy = graph.newNode({label:'Timothy'});
//      var barbara = graph.newNode({label:'Barbara'});
//      var franklin = graph.newNode({label:'Franklin'});
//      var monty = graph.newNode({label:'Monty'});
//      var james = graph.newNode({label:'James'});
//      var bianca = graph.newNode({label:'Bianca'});
//
//      graph.newEdge(dennis, michael, {color:'#00A0B0'});
//      graph.newEdge(michael, dennis, {color:'#6A4A3C'});
//      graph.newEdge(michael, jessica, {color:'#CC333F'});
//      graph.newEdge(jessica, barbara, {color:'#EB6841'});
//      graph.newEdge(michael, timothy, {color:'#EDC951'});
//      graph.newEdge(franklin, monty, {color:'#7DBE3C'});
//      graph.newEdge(dennis, monty, {color:'#000000'});
//      graph.newEdge(monty, james, {color:'#00A0B0'});
//      graph.newEdge(barbara, timothy, {color:'#6A4A3C'});
//      graph.newEdge(dennis, bianca, {color:'#CC333F'});
//      graph.newEdge(bianca, monty, {color:'#EB6841'});


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
