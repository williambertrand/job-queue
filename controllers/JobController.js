var http = require('follow-redirects').http;
var queue = require('queue');
var Job = require('../models/job');

/*
  The job queue handles the creation and processing of jobs
*/

var jobQueue = queue();


//Remove https:// or http:// from url if it has it at the beginning, since
//the http .get function will not work with the protocol prefix.
var parseUrl = function(urlString) {
  var result = urlString.trim().replace(/(^\w+:|^)\/\//, '');
  return result;
}

/*
    processJob:
    Download the html at the url given by job's url property.
*/
var processJob = function(job) {
  job.status = 'processing';
  job.save();
  var parsedUrl = parseUrl(job.url);
  var params = {
    host: parsedUrl
  }
  job.data = "";
  http.get(params, function(res) {

    //Save html data within the job object's data field.
    res.on("data", function(chunk) {
      job.data += chunk;
      job.save();
    });

    //Change the status of the job to completed once the html has been saved.
    res.on('end', function() {
      job.status = 'completed';
      job.save();
      console.log("Job completed for: " + job.url);
    });

  }).on('error', function(e) {
    console.log("Error retreiving html: " + e.message);
    job.status = "Error Occured";
    job.save();
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
    res.json({success: true, jobId: String(job._id)});
  });

  //Add processing of job to the jobQueue
  jobQueue.push(processJob(job));
}

/*
  Find the job by id in the mongoDb database
  If the job is completed, send the job as a json response.
  If not completed, send a message of the job status.
*/
var getJob = function(req, res) {
  Job.findById(req.params.id, function (err, job) {
    if(err != null) {
      res.json({success: false, error: "Job Not Found!"});
      return;
    }
    if(job.status == 'completed') {
      res.json({job});
    }
    else {
      var statusString = "Job status: " + job.status;
      res.json({success: true, message: statusString});
    }
  });
}


/*
  Find the job by id in the mongoDb database, and return the html if the job
  has been completed. 
*/
var getJobHTML = function(req, res) {
  Job.findById(req.params.id, function (err, job) {
    if(err != null) {
      res.json({success: false, error: "Job Not Found!"});
      return;
    }
    if(job.status == 'completed') {
      res.send(job.data);
    }
    else {
      var statusString = "Job status: " + job.status;
      res.json({success: true, message: statusString});
    }
  });
}

//Start the queue so it is ready to have jobs pushed to it.
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
  getJobHTML: (req, res) => {
    getJobHTML(req, res);
  },
};
