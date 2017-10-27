/**
 * Created by mihaela on 5/9/16.
 */
//var User = require()
var fs = require('fs-extra');
var path = require('path');

module.exports.updatePhoto = function(req,res){
    var file = req.files.file;
    var userId = req.body.userId;
    console.log("user ");
}