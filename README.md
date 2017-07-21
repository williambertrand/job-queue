## Job Queue
#### Massdrop Coding Challenge
Submission by William Bertrand.

#### Setup
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

To submit a job: 
POST to the /jobs endpoint with a url.

Example:
```
curl -H "Content-Type: application/json" -X POST -d '{"url":"google.com"}' http://localhost:3000/jobs
```
This request will return json containing the following fields:

success: was it succesful? 
jobId: the id of the job that was just created.

To retreive a job, submit a get request to /jobs/:id
If the job is not complete, a message will be returned describing the job's status. If the job is complete, the html will be returned. 

So entering `http://localhost:3000/jobs/:id` in a browser will give the html page of the job's url.

#### Test
run the tester.sh script to submit a few jobs to the server, you can add urls to the urlArray in the bash script to submit even more jobs.

```
bash tester.sh
```

To run the mocha tests:

```
npm test
```
