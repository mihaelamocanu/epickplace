/**
 * Created by mihaela on 4/19/16.
 */
var mongoose = require('mongoose');
    
var Schema = mongoose.Schema;
var imgSchema = new Schema({url:String,filename:String,size:Number});
 imgSchema = new Schema([imgSchema]);
var notification =new Schema({read:Boolean,email_planner:String,title:String,date:Date});
var userSchema = new Schema({
    firstname:{ type: String},
    lastname:{ type: String, required: true},
    email:{ type: String, required: true, unique: true },
    password:{ type: String, required: true},
    continent:{ type: String, required: true},
    img_profile:{url:String, data: Buffer, contentType: String },
    img:[imgSchema],
    notification:[notification]

});

module.exports = mongoose.model('users',userSchema);

