## Job Queue
### Massdrop Coding Challenge
Submission by William Bertrand.

Job queue whose workers fetch data from a URL and store the results in a database. The job queue should expose a REST API for adding jobs and checking their status / results.

### Setup
Install the dependencies:
```
npm install
```

Install and run MongoDb:
```
brew install mongodb
```

In terminal run: 
```
mongod 
```

The local mongodb should now be running, and the job queue will use that for saving jobs. If you'd like to change this, edit the config.json file to contain your mongodb uri in the mongoUrl field. 

 
Start the server:
```
npm start
```

#### Submit a job: 
POST to the /jobs endpoint with a url.

Example:
```
curl -H "Content-Type: application/json" -X POST -d '{"url":"google.com"}' http://localhost:3000/jobs
```
This request will return json containing the fields: `success` and `jobId`

#### Retreive a job
Submit a get request to `/jobs/:id`

If the job is not complete, a message will be returned describing the job's status. If the job is complete, job will be returned as a json object. 

To retreive just the html of a completed job, use the `/jobs/html` endpoint.

So entering `http://localhost:3000/jobs/html/:id` in a browser will give the html page of the job's url.

### Testing
run the tester.sh script to submit a few jobs to the server, you can add urls to the urlArray in the bash script to submit even more jobs.

```
bash tester.sh
```

To run the mocha tests:

```
npm test
```
