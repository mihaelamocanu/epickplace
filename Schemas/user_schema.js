/**
 * Created by mihaela on 4/21/16.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/users');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

userSchema = mongoose.Schema({
    email: String,
    password: String,
    continent:String
});
module.exports={
    db:db,
    userSchema:userSchema
}