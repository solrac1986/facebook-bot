/**
 * Created by solrac on 31/05/16.
 */

var express = require('express');
var mongoose = require('mongoose');

var Application = require('../models/facebook');
var router = express.Router();


router.get('/', function(req, res) {
    var tokenId = '';
    Application.findOne({name: 'messenger'}, function(err, appObj) {
        if(err) {
            console.error('Error finding: ', err);
        } else if (appObj) {
            console.log('Found: ', JSON.stringify(appObj));
            tokenId = appObj.token;
            if(req.query['hub.verify_token'] === tokenId) {
                res.send(req.query['hub.challenge']);
            } else {
                res.send('Error, wrong validation token');
            }
        } else if(!appObj) {
            console.error('Object not found');
        }
    });
    
});

module.exports = router;