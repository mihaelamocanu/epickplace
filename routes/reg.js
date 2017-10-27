var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var router = express.Router();
var db = require('../Schemas/user_schema').db;

var User = require('../public/datasets/users');
var from_reg_or_log;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'mmmm' });
    
});


router.get('/log', function(req, res, next) {
       res.render('log.ejs');
});

router.get('/source',function(req,res,next){
    res.send(from_reg_or_log);

});

router.get('/albums',function(req,res,next){
    
    db.collection('users').findOne({
            email: req.session.email
        },
        function(err, user){

        
            res.send({
                albums:user.albums

            });
        });


});

router.post('/reg',function(req,res,next) {

    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;
    var continent = req.body.continent;
    var imgPath = "../public/images/pick1.jpg";

    var img= fs.readFileSync(imgPath);


        var user = new User({firstname:firstname,lastname:lastname,
            email: email, password: password, continent: continent,img_profile:img});
    user.img_profile.contentType = 'image/jpg';
    user.img_profile.data = img;
    console.log("jjjjjjjjjjjjjjjjjjj"+firstname);
        User.findOne({
                email: email
            })
            .exec(function(err, userul) {
                // if (err) throw err;
                //console.log("kkkkkkkk"+userul);
                if (userul) {
                    console.log('User exists');
                    return res.status(500).send('welcome');
                }
                else {
                    req.session.email = user.email;
                    req.session.firstname = user.firstname;
                    req.session.lastname = user.lastname;
                    
                    user.save(function (err, data) {
                        console.log(data);
                        if (err) {
                            throw err;
                        }
                        else
                        {
                            from_reg_or_log = "reg";
                            return res.redirect('/home');
                        }

                        
                    });
                }
            });


});

// POST login
router.post('/log', function(req, res, next){
    
    var email = req.body.email;
    var firstname = req.body.firstname;
    var password = req.body.password;
    var session = req.session;

    User.findOne({
            email: email,
            password: password
        })
        .exec(function(err, user){
            if (err) throw err;

            // email and password does not match
            if (!user){
                console.log('Email and password does not match');
                return res.status(500).send('welcome');
            }
            else {
                console.log("NOT"+user.notification);
                req.session.email = user.email;
                req.session.firstname = user.firstname;
                req.session.lastname = user.lastname;
                req.session.continent = user.continent;
               req.session.notifications = user.notification;

                /*res.json({email:email,
                    _id:user._id});*/
                from_reg_or_log = 'log';
                return res.redirect('/home');
            }
        });

});


module.exports = router;
