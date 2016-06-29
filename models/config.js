/**
 * Created by solrac on 31/05/16.
 */
var mongoose = require('mongoose');

var mongoUser = 'solrac1986';
var mongoPwd = '0SUz3vvHSlgBKs47Pelz';
var dbDevelopment = 'hIduqa4t';

mongoose.connection.on('open', function (ref) {
  console.log('Connected to mongo server.');
});
mongoose.connection.on('error', function (err) {
  console.log('Could not connect to mongo server!');
  console.log(err);
});

module.exports = {
    'secret' : '',
    'database' : 'mongodb://' + mongoUser + ':' + mongoPwd + '@jello.modulusmongo.net:27017/',
    'dbName' : dbDevelopment
}
