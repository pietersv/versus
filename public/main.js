require.config({
  baseUrl:"/",
  paths:{
    jquery:'javascripts/jquery',
    jquerymobile: 'javascripts/jquery.mobile-1.3.0.min'
  },
  shim:{
    underscore:{
      exports:"_"
    }
  }
});

require(['jquery', 'jquerymobile'], function ($, view) {

  $.mobile.ajaxEnabled = false;
  $(function() {onPageLoad(); });

//  $('[data-role=page]').live('pageshow', function (event, ui) {
//        onPageLoad();
//  });

  function onPageLoad() {

    var w = 600,
        h = 400;

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


    var svg = d3.select("#map").append("svg:svg")
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

    $("#query").bind("change", function(evt, ui) {

      var query = $("#query").val();

      //$.mobile.changePage( "/?query="+encodeURIComponent(query), { transition: "slideup"} );
      window.location.href="/?query="+encodeURIComponent(query);

    });
    return false;
  };


});
