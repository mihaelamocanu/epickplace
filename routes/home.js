var express = require('express');
var router = express.Router();
var fs = require('fs');
var multipart = require('connect-multiparty');
var User = require('../public/datasets/users');
var db = require('../Schemas/user_schema').db;
var multipartMiddleware = multipart();

var url_pic,array,array_albums =[];
var array_found,continent;
/* GET home page. */
router.get('/', function(req, res, next){
    var sess = req.session;

    res.render('home.ejs');
    
});

router.get('/profile', function(req, res, next){
    var sess = req.session;

    res.render('picker.ejs');

});


/* GET albums page. */
router.get('/albums', function(req, res, next){
    var sess = req.session;

    res.render('albums.ejs');

});

/* GET albums pictures. */
router.get('/pictures', function(req, res, next){
    var sess = req.session;

    
    res.render('edit_album.ejs');

});
router.get('/notifications',function(req,res,next){
    res.send({
        notifications:req.session.notifications
    })

});
router.get('/gettrip',function(req,res,next){
    var trip;
    console.log("ggfgf"+req.query.id);
    var a = req.query.id;
    console.log("gggg"+a);
    db.collection('planned').findOne({'planification.id':a},function(err,res){
        console.log(res);
        trip = res;
        wtf();

    })
    function wtf(){
        res.send({
            trip:trip
        })
    }
})

router.get('/user_page', function(req, res, next){
    var pic,albums;
    var sess = req.session;
    db.collection('users').findOne({
            email: sess.email
        },
        function(err, userul) {
             if (userul) {

                    pic = userul.img_profile;
                    albums = userul.albums;
                 
                 var data;
                
                 if (typeof pic.data =='undefined')
                     data = pic.url;
                 else
                     data = pic.data;
              
                               
                 res.send({
                     avatar:data,
                     albums:albums,
                     url:url_pic,
                     form:userul.form,
                     firstname:req.session.firstname,
                     lastname:req.session.lastname

                 });
             }
        });
});
router.get('/edit_album',function(req,res,next){
   var sess = req.session;
    db.collection('users').findOne({
        email:sess.email
    },
        function (err,userul) {
            if(userul)
            {

                var out;
                for (var i=0;i<userul.albums.length;i++)
                {   
                    if(userul.albums[i].pictures[0].url.toString('utf-8').trim() == url_pic.toString('utf-8').trim())
                    {
                       // out.push(userul.albums[i]);
                        out = userul.albums[i];
                    }


                }

                res.send({
                   out:out
                });
            }

        });
});
router.get('/front',function(req,res,next){
   //console.log(req.query.date);
    var date = req.query.date;

    //var g = 'Australia';
    var g = req.session.continent;
    console.log('g'+g);


    db.collection('albums').find({'albums.continent':{$eq:g},'albums.date':{$lt:new Date(date)}},{"sort" : [['albums.date', 'desc']],limit:2},function (err,results){
        var i=0,c;
       db.collection('albums').count({'albums.continent':{$eq:g},'albums.date':{$lt:new Date(date)}},{limit:2},function(err,count){
         c = count;
       })


        results.forEach(function(res){
           console.log(c);
            array_albums[i] = res.albums;
           
            i+=1;

                if (i==c)
                {
                    wtf();
                }
        });
        function wtf() {
           
            res.send({
                array:array_albums,

            });
        }


      /*  //  async.forEach(doc, function (item, callback){
        //  console.log(item); // print the key
        //  callback(); // tell async that the iterator has completed
        //
          }, function(err) {
          console.log('iterating done');
         });*/



    });

});




router.post('/pictures',function(req,res){
    var sess = req.session;

    array;
    array_found;
     url_pic = req.body.url;
    db.collection('users').findOne({
            email:sess.email
        },function(err, user) {
            if (user) {
                //pic = new Buffer(userul.img_profile.data).toString('base64');
                array  = user.albums;
                
                array.forEach(function(value){

                   if(value.pictures[0].url === url_pic)
                   { 
                       
                       array_found = value;
                        }

                });
            }

        });

    res.redirect('/home/pictures');
    
});

router.post('/',function(req,res,next) {
    var sess = req.session;


    var albums = req.body;
    console.log(Math.random());
    var location = req.body.location;
    var n = location.lastIndexOf(",");
    albums.country = location.substr(n+2,location.length);
    
    albums.date = new Date();

    db.collection('users').update({email:sess.email},{$push:{albums:albums}},
    function (req,records) {
           });
    var query = {};
    var a =  albums.country;
    var b = "_id";
    var c ;
    query[a] = 1;
    query[b] = 0;
    console.log(query);

    db.collection('codes').findOne({},{a:1,_id:0},function(err,results) {
    
        for(n in results)
        {
            
             continent = results[n];
            
        }
        albums.email = sess.email;
        albums.continent = req.session.continent;
        db.collection('albums').insert({albums:albums},
            function (req,records) {
            });


    })



});
router.post('/avatar',function(req,res,next) {
    db.collection('users').update({email:req.session.email},{$set:{img_profile:req.body.avatar}}, function (err, records) {
        if (err) throw err;
        //else return res.status(200).send('welcome');
       ///else res.redirect('/');
    });
    res.render('picker.ejs');
});

router.post('/edit_picture',function (req,res) {

    db.collection('users').findOne({email:req.session.email},function(err,doc){

        for(var i=0;i<doc.albums.length;i++)
        {
            for(var j=0;j<doc.albums[i].pictures.length;j++)
            if(doc.albums[i].pictures[j].url.toString('utf-8').trim() == req.body.url.toString('utf-8').trim())
            {   var a = req.body;

                var coordinates = {
                    "lat":a.latitude,
                    "lng":a.longitude
                }
                var location = req.body.location;
                var n = location.lastIndexOf(",");
                doc.albums[i].pictures[j].description = req.body.description;
                doc.albums[i].pictures[j].title = req.body.title;
                doc.albums[i].pictures[j].coordinates = coordinates;
                doc.albums[i].pictures[j].country = location.substr(n+1,location.length);
                doc.albums[i].pictures[j].location = location;
                var album = doc.albums[i].pictures;
               
                db.collection('users').update({email:req.session.email,"albums.pictures.url":req.body.url},{$set:{"albums.$.pictures":album}}, function (err, records) {
                    if (err) throw err;

                });
            }
        }
    })

})

router.post('/editProfile',function(req,res,next){
   
    db.collection('users').update({email:req.session.email},{$set:{form:req.body}},function (err,records) {
        if(err)throw err;
    })
})

router.post('/upload',function(req,res){
    //console.log(req);
    
    
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


