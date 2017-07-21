var express = require('express');
var router = express.Router();

/* GET / . */
router.get('/', function(req, res, next) {
  res.json("Welcome to Job Queue. Please Submit a job to the /jobs/ endpoint");
});

module.exports = router;
