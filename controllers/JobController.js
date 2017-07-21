var http = require('follow-redirects').http;
var queue = require('queue');
var Job = require('../models/job');

/*
  The job queue handles the creation and processing of jobs
*/

var jobQueue = queue();

/*
    processJob:
    Download the html at the url given by job's url property.
*/
var processJob = function(job){
  job.status = 'processing';
  job.save();
  var params = {
    host: job.url
  }
  job.data = "";
  http.get(params, function(res) {
    res.on("data", function(chunk) {
      if(chunk != 'undefined') {
        job.data += chunk;
        job.save();
      }
    });

    res.on('end', function() {
      job.status = 'completed';
      job.save();
    });

  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}


/*
    Create a new Job
    Save the job in the database with status 'pending'
    Push the processing of the job to the job queue
*/
var createJob = function(req, res) {
  var job = new Job(req.body);
  console.log("Creating job for " + job.url)
  job.save(function(err, job){
    if(err) {
      res.json({success: false, error: "Error saving new job."});
      return;
    }
    res.json({success: true, message: "Job Created!", jobId: String(job._id)});
  });

  //Add processing of job to the jobQueue
  jobQueue.push(processJob(job));
}

/*
  Find the job by id in the mongoDb database
*/
var getJob = function(req, res) {
  Job.findById(req.params.id, function (err, job) {
    if(err != null) {
      res.json({success: false, message: "Job Not Found!"})
      return;
    }
    res.json({success: true, message: "Job Found!", job: job});
  });
}

//Log a message when a job on the queue completes
jobQueue.on('success', function(result, job) {
  console.log('job finished processing:', job.toString().replace(/\n/g, ''));
});

//Begin the queue
jobQueue.start(function(err) {
  console.log('Awaiting jobs...');
});

module.exports = {
  createJob: (req, res) => {
    createJob(req, res);
  },
  getJob: (req, res) => {
    getJob(req, res);
  },

};
