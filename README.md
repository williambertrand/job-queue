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

#### Test
npm test