/**
 * Created by solrac on 01/06/16.
 */

var express = require('express');

var Messenger = new Application({
    name: 'messenger',
    token: 'testbot_verify_token_F0bdxnfSFcNFQ7HWYviq'
});

Messenger.save(function(err) {
    if(err) {
        console.log('Error saving new application to mongo db: ' + err.toString());
        throw err;
    }
    
    console.log('Application: ' + messenger + ' saved successfully');
});

Messenger.find({name: 'messenger'}, function(err, userObj) {
    if(err) {
        console.log('Error finding: ', err);
    } else if (userObj) {
        console.log('Found: ', userObj);
    }
});


