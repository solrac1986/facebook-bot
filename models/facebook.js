/**
 *
 * Created by solrac on 31/05/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Messenger', new Schema({
    name: String,
    password: String
}));