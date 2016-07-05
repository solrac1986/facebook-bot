var chai = require('chai');
var mongoose = require('mongoose');
var config = require('../models/config');
var routes = require('../routes');

var request = require('supertest');
var app = require('../app');

var connection;

var options = {server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } }};

var dummyCollection = 'Dummy';
var applicationCollection = 'Application';
var assert = chai.assert;
var Application = require('../models/facebook');

var userTest = 'test1234';
var pwdTest = 'GWXNRXTxmEUZV74Sl6Lo';
var databaseTest = 'mongodb://' + userTest + ':' + pwdTest + ':@jello.modulusmongo.net:27017/';
var dbTest = 'sYze2zas';

var verifyToken = "testbot_verify_token_F0bdxnfSFcNFQ7HWYviq";


var response = {
    viewName: ""
    , data : {}
    , render: function(view, viewData) {
        this.viewName = view;
        this.data = viewData;
    }
};

function buildResponse() {
    return http_mocks.createResponse({eventEmitter: require('events').EventEmitter})
}

describe("Database Test Modulus MongoDB", function() {
    this.timeout(7000);
    before(function(done) {
        connection = mongoose.createConnection(databaseTest + dbTest);
        connection.on('error', function(err) {
            console.error("Test DB error: " + err);
        });
        connection.on('open', function() {
            console.log("Test DB connected");
            Dummy = connection.model(dummyCollection, new mongoose.Schema({a:Number}));
            done();
        });
    });

    after(function(done) {
        connection.close(done);
    });

    describe('save', function() {
        this.timeout(5000);
        it('save first ' + dummyCollection, function(done) {
            new Dummy({a:1}).save(done);
        });  
        it('save second ' + dummyCollection, function(done) {
           new Dummy({a:2}).save(done); 
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
        it('remove tests' + dummyCollection, function(done) {
            Dummy.remove({}, function (err) {
                if (err) throw err;
                console.log('Document: ' + 'all' + ' removed');
                done();
            });
        });
    });
});



describe("Database Facebook Modulus MongoDB", function() {
    before(function(done) {
        if(mongoose.connection.db) return done();
        mongoose.connect(config.database + config.dbName, options, done);
        if(mongoose.connection.db) {
            console.log("Mongoose Facebook is connected");
        }        
    });

//    after(function(done) {
        
//        mongoose.disconnect(done);
//    });

    describe('save', function() {
        this.timeout(5000);
        it('save ' + applicationCollection, function(done){
            Application.update({name: 'test'}, {name: 'test', token: '123'}, {upsert : true}, function(err) {
                if(err) throw err;
                done();
            });
        });
        it('save second' + applicationCollection, function(done){
           // new Application({name: 'test2', token: '1234'}).(done); 
            Application.update({name: 'test2'}, {name: 'test2', token: '1234'}, {upsert : true}, function(err) {
                if(err) throw err;
                done();
            });
        });
    });

    describe("find", function() {

        this.timeout(5000);
        it('find test '+ applicationCollection, function(done){
            Application.findOne({name: 'test'}, function(err, appObj){
                if(err)  return done(err);
                assert.equal(appObj.token, '123');
                done();
            });
        });
        it('find test' + applicationCollection, function(done){
            Application.findOne({name: 'test2'}, function(err, appObj){
                if(err)  return done(err);
                assert.equal(appObj.token, '1234');
                done();
            });
        });
        it('find test ' + applicationCollection, function(done){
            Application.find({}, function(err, docs){
                if(err)  return done(err);
//                console.log(JSON.stringify(docs));
                assert.equal(docs.length, 2);
                done();
            });
        });
        it('remove tests' + applicationCollection, function(done) {
            Application.remove({name: 'test'}, function(err) {
                if(err) throw err;
//                console.log('Document: ' + 'test' + ' removed');
            });
            Application.remove({name: 'test2'}, function(err) {
                if(err) throw err;
//                console.log('Document: ' + 'test2' + ' removed');
            });
            Application.find({}, function(err, docs){
                if(err)  return done(err);
//                console.log(JSON.stringify(docs));
                assert.equal(docs.length, 0);
                done();
            });
        })
    });
    
    describe("check controller (routes)", function() {
        
        it('save fb webhook token', function(done) {
            var query = {name: 'messenger', token: 'testbot_verify_token_F0bdxnfSFcNFQ7HWYviq'};
            Application.update({name: 'messenger'}, query, {upsert : true}, function(err) {
                if(err) throw err;
            });
            Application.findOne({name: 'messenger'}, function(err, appObj){
                if(err)  return done(err);
                assert.equal(appObj.token, 'testbot_verify_token_F0bdxnfSFcNFQ7HWYviq');
                done();
            });
        })
       
        it('webhook', function(done){
            var token = 'testbot_verify_token_F0bdxnfSFcNFQ7HWYviq';
            var challengeTest = 'test';
           //noinspection JSUnresolvedFunction
           request(app)
               .get('/webhook')
               .set('Accept', 'application/json')
//               .expect('Content-Type', 'text/html')
               .query({'hub.verify_token': token, 'hub.challenge': challengeTest})
               .expect(200)
               .end(function(err, res) {
                   if(err) return done(err);
                   var response = JSON.parse(JSON.stringify(res));
                   assert.equal(response.text, challengeTest);
                   done();
               });
        })
        
        it('remove webhook test token', function(done){
            var objectName = 'messenger';
            Application.remove({name: objectName}, function(err) {
                if(err) throw err;
            });
            Application.findOne({name: objectName}, function(err, appObj){
                if(err)  return done(err);
                assert.equal(appObj, null);
                done();
            });
        })
    });
});






