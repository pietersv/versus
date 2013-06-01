var mongoose = require('mongoose');
var queryLogSchema = new mongoose.Schema(
    {
      query: {type: String, required: true}
     ,time: {type: Date, default: Date.now}
     ,result_count: {type: Number, required: false}
     ,user_agent: {type: mongoose.Schema.Types.Mixed, required: false}
     ,nodes: {type: mongoose.Schema.Types.Mixed, required: false}
     ,links: {type: mongoose.Schema.Types.Mixed, required: false}
    },
    {
      noId: true
    }
);


module.exports = mongoose.model('QueryLog', queryLogSchema);
