var chai = require('chai');
var mongoose = require('mongoose');
var config = require('../models/config');


var dummyCollection = 'Dummy';
var applicationCollection = 'Application';
var assert = chai.assert;
var Dummy = mongoose.model(dummyCollection, new mongoose.Schema({a:Number}));
var Application = require('../models/facebook')
var dbTest = 'sYze2zas';


describe("Database Modulus MongoDB", function() {
    beforeEach(function(done) {
        this.timeout(10000);
        if(mongoose.connection.db) return done();
        mongoose.connect(config.database + config.dbName, function() {
            Dummy.remove(function(err, removed) {
                if(err) return done(err);
            });
            Application.remove(function(err, removed) {
                if(err) return done(err);
            });
            done();
        });
    });

    describe('save', function() {
        it('save first ' + dummyCollection, function(done) {
            new Dummy({a:1}).save(done);
        });  
        it('save second ' + dummyCollection, function(done) {
           new Dummy({a:2}).save(done); 
        });
        it('save ' + applicationCollection, function(done){
           new Application({name: 'test', token: '123'}).save(done); 
        });
        it('save second' + applicationCollection, function(done){
           new Application({name: 'test2', token: '1234'}).save(done); 24
        });
    });

    describe("find", function() {
        it('find first ' + dummyCollection, function(done){
            Dummy.findOne({a:1}, function(err, appObj) {
                if(err) return done(err);
                assert.equal(appObj.a, 1);
                done();
           });
        });
        it('find all (2) ' + dummyCollection, function(done){
            Dummy.find({}, function(err, docs){
               if(err) return done(err);
               assert.equal(docs.length, 2);
               done();
            });
        });
        it('find test '+ applicationCollection, function(done){
            Application.findOne({name: 'test'}, function(err, appObj){
               if(err)  return done(err);
               assert.equal(appObj.token, '123');
               done();
            });
        });
        it('find Application test', function(done){
            Application.findOne({name: 'test'}, function(err, appObj){
                if(err)  return done(err);
                assert.equal(appObj.token, '123');
                done();
            });
        });
        it('find test ' + applicationCollection, function(done){
            Application.find({}, function(err, docs){
                if(err)  return done(err);
                assert.equal(docs.length, 2);
                done();
            });
        });
    });
});

//describe('GET /webhook', function(){
//   it('check if webhook token id', function(done){
       // routes.webhook()
//   });
//});

