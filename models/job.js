var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;

/*
    The schema for a job

    A job has:
      _id
      status: [],
      statusCode,
      url,
      data
*/

var JobSchema = Schema({
  status: {type: String, required: true, default: 'pending'},
  statusCode: {type: Number},
  url: {type: String},
  data: {type:String}
});

var JobModel = mongoose.model('Job', JobSchema);
module.exports = JobModel;
