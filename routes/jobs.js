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
  if(!req.params.id) {
    handleError(res, "Invalid request", "Must provide Id parameter", 400);
  }
  JobController.getJob(req, res);

});

/*
    GET /html/:id
    Required: the id of the job to be returned
    This endpoint allows a user to easily see the HTML of the completed job as
    a page in the browser.
*/
router.get('/html/:id', function(req, res, next) {
  if(!req.params.id) {
    handleError(res, "Invalid request", "Must provide Id parameter", 400);
  }
  JobController.getJobHTML(req, res);
});


/*
  Util function for sending error response.
*/

function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}

module.exports = router;
