var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var mongoose = require('mongoose');
require('sinon-mongoose');

//Importing our todo model for our unit testing.
var Job = require('../models/job');


/*
  Test the creation of a new Job
*/
describe("Post a new Job", function(){
        it("should create new job", function(done){
            var JobMock = sinon.mock(new Job({ url: 'google.com'}));
            var job = JobMock.object;
            var expectedResult = { success: true, status:'pending' };
            JobMock.expects('save').yields(null, expectedResult);
            job.save(function (err, result) {
                JobMock.verify();
                JobMock.restore();
                expect(result.success).to.be.true;
                done();
            });
        });
        // Test will pass if the todo is not saved
        it("should return error, if Job not saved", function(done){
            var JobMock = sinon.mock(new Job({ url: 'google.com'}));
            var job = JobMock.object;
            var expectedResult = { status: false };
            JobMock.expects('save').yields(expectedResult, null);
            job.save(function (err, result) {
                JobMock.verify();
                JobMock.restore();
                expect(err.status).to.not.be.true;
                done();
            });
        });
    });


describe("Get job by id", function(){
         // Test will pass if we get all todos
        it("should return job by Id", function(done){
            var JobMock = sinon.mock(Job);
            var job = new Job({ url: 'google.com'});
            var testId = job._id;
            var expectedResult = {success: true, job: {}};
            JobMock.expects('findById').withArgs({_id: testId}).yields(null, expectedResult);
            Job.findById({_id: testId}, function(err, result) {
              JobMock.verify();
              JobMock.restore();
              expect(result.success).to.be.true;
              done();
            });
        });

        // Test will pass if we fail to get a todo
        it("should return error", function(done){
            var JobMock = sinon.mock(Job);
            var expectedResult = {success: false};
            var testId = "12345";
            JobMock.expects('findById').withArgs({_id: testId}).yields(expectedResult, null);
            Job.findById({_id: testId}, function (err, result) {
                JobMock.verify();
                JobMock.restore();
                expect(err.status).to.not.be.true;
                done();
            });
        });
    });



describe("Update Job status", function(){
        it("should update from pending to processing", function(done){
            var JobMock = sinon.mock(new Job({ url: 'google.com'}));
            var job = JobMock.object;
            expect(job.status).to.equal('pending');
            var expectedResult = { success: true, job:{status:'processing'}};
            JobMock.expects('save').yields(null, expectedResult);
            job.save(function (err, result) {
                JobMock.verify();
                JobMock.restore();
                expect(result.success).to.be.true;
                expect(result.job.status).to.equal('processing');
                done();
            });
        });

        it("should update from processing to complete", function(done){
            var JobMock = sinon.mock(new Job({ url: 'google.com', status:'processing'}));
            var job = JobMock.object;
            expect(job.status).to.equal('processing');
            var expectedResult = { success: true, job:{status:'completed'}};
            JobMock.expects('save').yields(null, expectedResult);
            job.save(function (err, result) {
                JobMock.verify();
                JobMock.restore();
                expect(result.success).to.be.true;
                expect(result.job.status).to.equal('completed');
                done();
            });
        });
    });
