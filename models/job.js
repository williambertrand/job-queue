var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;

/*
    The schema for a Job Object

    A job has:
      _id
      status: pending / processing / complete / error occured,
      url: the url to download the html of,
      data: the downloaded html
*/

var JobSchema = Schema({
  status: {type: String, required: true, default: 'pending'},
  url: {type: String},
  data: {type:String}
});

var JobModel = mongoose.model('Job', JobSchema);
module.exports = JobModel;
