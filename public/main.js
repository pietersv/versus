require.config({
  baseUrl: "/",
  paths: {
    jquery: 'javascripts/jquery',
    underscore: 'javascripts/lodash',
    backbone: 'javascripts/backbone'
  },
  shim: {
    underscore: {
      exports: "_"
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  }
});


require(['jquery', 'backbone', 'javascripts/text!views/basic.html'], function($, Backbone, view) {


//  console.log(view);
  var BasicView = Backbone.View.extend({

    template: _.template(view),

    initialize: function(args) {

      var self = this;

      $("#form").on('submit',function(evt) {
        var query = $("#query").val(),
          url = '/search?query='+encodeURIComponent(query),
          str = "<UL>",
          matches, term, substr;

        var basicView = new BasicView({el: '#basic-view'});

        $.get(url, function(data, textStatus, jqXhr ){

          self.render(data);

        });
        return false;
      });
    },

    render: function(data) {

      var content = this.template({data: data});
      console.log(content);
      this.$el.html(content);
    }
  });

  var basicView = new BasicView({el: '#basic-view'});

});
