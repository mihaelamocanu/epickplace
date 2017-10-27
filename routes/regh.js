var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var router = express.Router();
var db = require('../Schemas/user_schema').db;

router.get('/hotel',function(req,res){
    res.render('hotel.ejs');
})
router.get('/fasthotel',function(req,res){
    res.render('fasthotel.ejs');
})
router.get('/menu',function(req,res){
    res.render('menu.ejs');
})
router.get('/contact',function(req,res){
    res.render('contact.ejs');
})
router.post('/reg',function(req,res,next) {
    console.log(req.body.email);
    db.collection('host').findOne({email:req.body.email},function(err,doc) {

        if(doc){
            console.log('User exists');
            return res.status(500).send('welcome');
        }
        else{
            req.session.email = req.body.email;
            db.collection('host').save({email:req.body.email,password:req.body.password});
        }
    })

})
router.post('/log',function(req,res,next) {
    console.log(req.body.email);
    db.collection('host').findOne({email:req.body.email,password:req.body.password},function(err,user) {
        console.log("after");
        if(user){
            req.session.email = user.email;
            req.session.firstname = user.firstname;
            req.session.lastname = user.lastname;
            return res.redirect('/host/hotel');
        }
        else{
            return res.status(500).send('welcome');
        }
    })

})
router.post('/',function(req,res,next) {
    var sess = req.session;
    console.log(req.body);

    var albums = req.body;

    db.collection('host').update({email:sess.email},{$set:{property:albums}},
        function (req,records) {
        });
});
router.post('/contact',function(req,res,next) {
    var sess = req.session;
    console.log(req.body);

    var albums = req.body;

    db.collection('host').update({email:sess.email},{$set:{contact:albums}},
        function (req,records) {
        });
});
router.post('/rooms',function(req,res,next){
    var sess = req.session;
    console.log(req.body);
    db.collection('host').update({email:sess.email},{$set:{rooms:req.body}},
        function (req,records) {
        });
})
router.post('/amenities',function(req,res,next){
    var sess = req.session;
    console.log(req.body);
    db.collection('host').update({email:sess.email},{$set:{amenities:req.body}},
        function (req,records) {
        });
})
router.post('/pictures',function(req,res,next) {
    var sess = req.session;
       var albums = req.body;

    db.collection('host').update({email:sess.email},{$set:{pictures:albums}},
        function (req,records) {
        });
});
router.post('/upload',function(req,res){

    fs.readFile(req.files.file.path, function(err, data){
        var uploadToPath = './public/uploads/' + req.files.file.originalFilename;

        fs.writeFile(uploadToPath, data, function(err){
            if(err) {
                res.send(err);
                return;
            }
        });
    });
})
module.exports = router;