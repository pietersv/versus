require.config({
  baseUrl:"/",
  paths:{
    jquery:'javascripts/jquery',
    underscore:'javascripts/lodash',
    backbone:'javascripts/backbone'
  },
  shim:{
    underscore:{
      exports:"_"
    },
    backbone:{
      deps:['underscore', 'jquery'],
      exports:'Backbone'
    }
  }
});

require(['jquery', 'backbone', 'javascripts/text!views/basic.html'], function ($, Backbone, view) {


  $(function() {

    var w = 960,
        h = 500;

    var query_data = JSON.parse($("#query-data").html() );
    console.log(query_data);
    var links = [];
    var nodes = {};

    for (var n=0; n<query_data.nodes.length; n++) {
       var term = query_data.nodes[n];
       nodes[term.toLocaleLowerCase()] = {name: term,id: term};
     }

     for (var i=0;  i<query_data.links.length; i++) {
       var link = query_data.links[i];
       var source = nodes[link.source.toLowerCase()];
       var target = nodes[link.target.toLowerCase()];
       if (source && target) {
         links.push({
           source: source,
           target: target,
           type: 'suit',
           weight: 1,
           value: i
         });
       }
     }


    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([w, h])
        .linkDistance(60)
        .charge(-400)
        .on("tick", tick)
      .linkStrength(function(link) { return 1 / Math.sqrt((link.value+1)) * 3; })
        .start();


    var svg = d3.select("body").append("svg:svg")
        .attr("width", w)
        .attr("height", h);

    // Per-type markers, as they don't inherit styles.
    svg.append("svg:defs").selectAll("marker")
        .data(["suit", "licensing", "resolved"])
      .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");



    var path = svg.append("svg:g").selectAll("path")
        .data(force.links())
      .enter().append("svg:path")
        .attr("class", function(d) { return "link " + d.type; })
        .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

    var circle = svg.append("svg:g").selectAll("circle")
        .data(force.nodes())
      .enter().append("svg:circle")
        .attr("r", 6)
        .call(force.drag);

    var text = svg.append("svg:g").selectAll("g")
        .data(force.nodes())
      .enter().append("svg:g");

    // A copy of the text with a thick white stroke for legibility.
    text.append("svg:text")
        .attr("x", 8)
        .attr("y", ".31em")
        .attr("class", "shadow")
        .text(function(d) { return d.name; });

    text.append("svg:text")
        .attr("x", 8)
        .attr("y", ".31em")
        .text(function(d) { return d.name; });


    // Use elliptical arc path segments to doubly-encode directionality.
    function tick() {
      path.attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
      });

      circle.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

      text.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    }

    $("#form").submit(function(evt) {

      var query = $("#query").value();

      d3.json('/api/graph?query='+encodeURIComponent(query), function(error, json) {

      });
      return false;
    });

  });
});

//require(['jquery', 'backbone', 'javascripts/text!views/basic.html'], function ($, Backbone, view) {
//
//
////  console.log(view);
//  var BasicView = Backbone.View.extend({
//
//    template:_.template(view),
//
//    initialize:function (args) {
//
//      var self = this;
//
//      $("#form").on('submit', function (evt) {
//        var query = $("#query").val(),
//          url = '/search?query=' + encodeURIComponent(query),
//          str = "<UL>",
//          matches, term, substr;
//
//        var basicView = new BasicView({el:'#basic-view'});
//
//        $.get(url, function (data, textStatus, jqXhr) {
//
//          self.render(data);
//
//        });
//        return false;
//      });
//
//
//      var width = 600;
//      var height  = 400;
//
//
//      this.nodes = {};
//      this.links = [];
//
//
//      this.force = d3.layout.force()
//          .size([width, height])
//          .nodes(this.nodes)
//          .links(this.links)
//          .linkDistance(30)
//          .charge(-60)
//        .start();
//
//      this.svg = d3.select("body").append("svg")
//          .attr("width", width)
//          .attr("height", height)
//          .on("mousemove", this.mousemove)
//          .on("mousedown", this.mousedown);
//
//
//
//    },
//
//
//    render:function (data) {
//
//
//      console.log(data);
//
//      var term, dest_name, dest_node, dest_term, orig_node;
//
//      for (var i=0; i<data.terms_array.length; i++) {
//        var term_name = data.terms_array[i];
//
//        this.nodes[term_name] = {
//          name: term_name,
//          id: term_name
//        };
//      }
//
//      for (var term_name in data.terms) {
//        term = data.terms[term_name]  ;
//
//        for (var k=0; k<term.length; k++) {
//
//          dest_name = term[k];
//
//          if (dest_node && orig_node) {
//            this.links.push({
//              source: term_name,
//              target: dest_name
//            });
//          }
//        }
//
//      }
//      var link = this.svg.selectAll(".link")
//           .data(this.links)
//         .enter().append("line")
//           .attr("class", "link")
//           .style("stroke-width", function(d) { return Math.sqrt(d.value); });
//
//       var node = this.svg.selectAll(".node")
//           .data(graph.nodes)
//         .enter().append("circle")
//           .attr("class", "node")
//           .attr("r", 5)
//           .style("fill", function(d) { return color(d.group); })
//           .call(force.drag);
//
//       node.append("title")
//           .text(function(d) { return d.name; });
//
//       force.on("tick", function() {
//         link.attr("x1", function(d) { return d.source.x; })
//             .attr("y1", function(d) { return d.source.y; })
//             .attr("x2", function(d) { return d.target.x; })
//             .attr("y2", function(d) { return d.target.y; });
//
//         node.attr("cx", function(d) { return d.x; })
//             .attr("cy", function(d) { return d.y; });
//       });
//      console.log(this.nodes);
//      console.log(this.links);
//      this.force.nodes(this.nodes).links(this.links).start();
//
//    },
//
//    mousemove: function() { console.log("mousemove")},
//    mousedown: function() { console.log("mousedown")},
//
//  });
//
//  var basicView = new BasicView({el:'#basic-view'});

//});
