'use strict'
const express = require('express');
const router = express.Router();
var JobController = require('../controllers/JobController');
var JobModel = require('../models/job');


/*
  POST /
  Create a new job, given a url
  Required: The url to be processed.
*/
router.post('/', function(req, res, next) {
  //TODO: check request for required parameters
  if(!req.body.url){
    handleError(res, "Invalid request", "Must provide Job Url", 400);
  }
  else {
    JobController.createJob(req, res);
  }
});

/*
    GET /:id
    Required: the id of the job to be returned
*/
router.get('/:id', function(req, res, next) {
  console.log('Received get request for job:');
  if(!req.params.id) {
    handleError(res, "Invalid request", "Must provide Id parameter", 400);
  }
  JobController.getJob(req, res);

});

function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}

module.exports = router;
