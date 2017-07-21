var http = require('follow-redirects').http;
var queue = require('queue');
var Job = require('../models/job');

/*
  The job queue handles the creation and processing of jobs
*/

var jobQueue = queue();


var processJob = function(job){
  console.log("Processing job for " + job.url);
  job.status = 'processing';
  job.save();
  var params = {
    host: job.url
  }
  job.data = "";
  http.get(params, function(res) {
    console.log("Got response: " + res.statusCode);

    res.on("data", function(chunk) {
      if(chunk != 'undefined') {
        job.data += chunk;
        job.save();
      }
    });

    res.on('end', function() {
      console.log("HTML Download ENDED!");
      job.status = 'completed';
      job.save();
    });

  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });


}

var downloadUrl = function(url) {
  console.log("Downloading..." + url);
  var params = {
    host: url
  }
  http.get(params, function(res) {
    console.log("Got response: " + res.statusCode);
    if(res.statusCode == 200) {
      console.log("Saving html in mongodb document...");

    }

  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}

var createJob = function(req, res) {
  var job = new Job(req.body);
  console.log("Creating job for " + job.url)
  job.save(function(err, job){
    if(err) {
      res.json({success: false, error: "Something went wrong"});
      return;
    }
    res.json({success: true, message: "Job Created!", jobId: String(job._id)});
  });

  //Add processing of job to the jobQueue
  jobQueue.push(processJob(job));
}

var getJob = function(req, res) {
  console.log("Getting job ..." + req.params.id);
  Job.findById(req.params.id, function (err, job) {
    if(err != null) {
      res.json({success: false, message: "Job Not Found!"})
    }
    res.json({success: true, message: "Job Found!", job: job});
  });
}

jobQueue.on('success', function(result, job) {
  console.log('job finished processing:', job.toString().replace(/\n/g, ''));
});


jobQueue.start(function(err) {
  console.log('all jobs done...');
});

module.exports = {
  downloadUrl: (url) => {
    downloadUrl(url);
  },
  createJob: (req, res) => {
    createJob(req, res);
  },
  getJob: (req, res) => {
    getJob(req, res);
  },

};
