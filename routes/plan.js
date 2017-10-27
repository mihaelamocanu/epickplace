/**
 * Created by mihaela on 8/22/16.
 */

var express = require('express');
var router = express.Router();
var fs = require('fs');
var multipart = require('connect-multiparty');
var db = require('../Schemas/user_schema').db;
var multipartMiddleware = multipart();

var email,lat,longi,ok=0,albums,planned_albums;
/* GET home page. */
router.get('/', function(req, res, next){
    var sess = req.session;

    res.render('planatrip.ejs');

});
router.get('/planned_hotels',function (req,res,next){
    res.render('planned_hotel.ejs');
} )
router.get('/getplannedalbum',function(req,res,next){
    res.send({
        albums:planned_albums,
        lat:lat,
        longi:longi
    })
})
router.get('/friends',function(req,res,next){
    var person;
    db.collection('users').aggregate({$project:{newField:{$concat:["$firstname"," ","$lastname"]},email:'$email',
    image:'$img_profile.url'}},
        {$match:{newField:req.query.name}},
        (function(err,result){
            console.log(result);
            person = result;
            wtf();
        }))
        function wtf(){
            res.send(person);
        }

})

router.post('/planatrip',function(req,res,next){
    console.log(req.body);
    
    lat = req.body.coordinates.coordinates.latitude;
    longi = req.body.coordinates.coordinates.longitude;
    albums = req.body.coordinates;
    return res.status(200).send('welcome');
})
router.post('/gotohost',function(req,res,next){
    console.log(req.body);
    
    planned_albums = req.body.album;
    return res.status(200).send('welcome');
})

router.get('/hotels',function(req,res,next){
    var r_earth = 6378;
    var pi = 3.1415926535;
    var lt = {};
    var lon = {};
    var con = [],pro = [],i = 0;
   /* console.log(lat);
    console.log(longi);
*/
    var lat1 = lat *pi/180;
    var lon1 = longi *pi/180;
    var dist = 5;
    var brng = 90;
    brng = brng*pi/180;
    dist = dist / 6371;

    var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
        Math.cos(lat1) * Math.sin(dist) * Math.cos(0));

    var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
            Math.cos(lat1),
            Math.cos(dist) - Math.sin(lat1) *
            Math.sin(lat2));
    var lat3 = Math.asin(Math.sin(lat1) * Math.cos(dist) -
        Math.cos(lat1) * Math.sin(dist) * Math.cos(0));

    var lon3 = lon1 - Math.atan2(Math.sin(brng) * Math.sin(dist) *
            Math.cos(lat1),
            Math.cos(dist) - Math.sin(lat1) *
            Math.sin(lat2));

    lat2 = lat2 * 180 / Math.PI;
    lon2 = lon2 * 180 / Math.PI;
    lat3 = lat3 * 180 / Math.PI;
    lon3 = lon3 * 180 / Math.PI;


   /* console.log(lat2+""+lon2);
    console.log(lat3+""+lon3);*/


    lt['$lt'] = lat2.toString();
    lt['$gt'] = lat3.toString();
    lon['$lt'] = lon2.toString();
    lon['$gt'] = lon3.toString();




    db.collection('host').find({'contact.coordinates.latitude':lt,'contact.coordinates.longitude':lon},function(err,result){
        var cou=0;
        db.collection('host').count({'contact.coordinates.latitude':lt,'contact.coordinates.longitude':lon},function(err,count) {
         cou = count;
            console.log('COunt'+cou);

        });

        result.forEach(function(res){
            console.log(res);
            con[i++]=res;
            if(i==cou){
                wtf();

            }
        })



    })
    function wtf(){
        res.send({
            con:con,
            lat:lat,
            longi:longi,
            album:albums

        });
    }


})
router.get('/properties',function(req,res,next){

    var pi = 3.1415926535;
    var lt = {};
    var lon = {};
    var con = [],pro = [],i = 0;
    console.log(lat);
    console.log(longi);

    var lat1 = lat *pi/180;
    var lon1 = longi *pi/180;
    var dist = 5;
    var brng = 90*pi/180;
    var heig = 0*pi/180;

    dist = dist / 6371;

    var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
        Math.cos(lat1) * Math.sin(dist) * Math.cos(heig));

    var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
            Math.cos(lat1),
            Math.cos(dist) - Math.sin(lat1) *
            Math.sin(lat2));
    var lat3 = Math.asin(Math.sin(lat1) * Math.cos(dist) -
        Math.cos(lat1) * Math.sin(dist) * Math.cos(heig));

    var lon3 = lon1 - Math.atan2(Math.sin(brng) * Math.sin(dist) *
            Math.cos(lat1),
            Math.cos(dist) - Math.sin(lat1) *
            Math.sin(lat2));

    lat2 = lat2 * 180 / Math.PI;
    lon2 = lon2 * 180 / Math.PI;
    lat3 = lat3 * 180 / Math.PI;
    lon3 = lon3 * 180 / Math.PI;


    console.log(lat2+""+lon2);
    console.log(lat3+""+lon3);


    lt['$lt'] = lat2.toString();
    lt['$gt'] = lat3.toString();
    lon['$lt'] = lon2.toString();
    lon['$gt'] = lon3.toString();

    console.log(lt);
    console.log(lon);


    db.collection('host').find({'property.coordinates.latitude':lt,'property.coordinates.longitude':lon},function(err,result){
        var co=0;
        db.collection('host').count({'property.coordinates.latitude':lt,'property.coordinates.longitude':lon},function(err,count) {
            co = count;
            console.log(co);

        });

        result.forEach(function(res){
            console.log(res);
            pro[i++]=res;
            if(i==co){
                wtf();

            }
        })



    })
    function wtf(){
        res.send({
            pro:pro,
            lat:lat,
            longi:longi
        });
    }


})
router.post('/planned',function(req,res,next){
    //console.log(req.body.planification);
    var randomString = function (len, bits)
    {
        bits = bits || 36;
        var outStr = "", newStr;
        while (outStr.length < len)
        {
            newStr = Math.random().toString(bits).slice(2);
            outStr += newStr.slice(0, Math.min(newStr.length, (len - outStr.length)));
        }
        return outStr.toUpperCase();
    };
    
    var planification = req.body.planification;
    var name = req.session.firstname +" "+ req.session.lastname;
    planification.id = randomString(12, 16);
    planification.email_planner = req.session.email;
    for(var i=0;i<planification.added_friends.length;i++){
        console.log()
        db.collection('users').update({email:planification.added_friends[i].email},{$push:{'notification':
        {read:false,email_planner:req.session.email,name_planner:name,
            title:planification.title,date:new Date(),id:planification.id}}},function(err,result){

        });
    }


    db.collection('planned').insert({'planification':planification},function(err,result){
        
    })
})
module.exports = router;