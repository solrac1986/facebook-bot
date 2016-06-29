/**
 * Created by solrac on 31/05/16.
 */

var express = require('express');
var mongoose = require('mongoose');

var Application = require('./models/facebook');
var router = express.Router();


router.get('/', function(req, res) {
    var tokenId = '';
    Application.findOne({name: 'messenger'}, function(err, appObj) {
        if(err) {
            console.log('Error finding: ', err);
        } else if (appObj) {
            tokenId = appObj.token;
            console.log('Found: ', appObj);
        }
    });
    if(req.query['hub.verify_token'] === tokenId) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong validation token');
    }
});

module.exports = router;