/**
 * Created by mihaela on 4/13/16.
 */
var app = angular.module("myApp", []);


var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email:{ type: String, required: true, unique: true },
    password:{ type: String, required: true},
    continent:{ type: String, required: true}
});

var User = mongoose.model('User', userSchema);





app.controller("myCtrl", function($scope,$http) {
    $scope.name = "john";
     $scope.submit = function(item,event){
        console.log("mmmm");
        var userObject={
            email:$scope.Form.email,
            password:$scope.Form.password,
            continent:$scope.Form.continent
        };

       // var responsePromise=$http.post("http://localhost:27017/User",userObject,{});


        mongoose.connect('mongodb://localhost:27017/student');
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            var user = new User({
                email: $scope.email,
                passsword: $scope.password,
                continent: $scope.continent
            });
            console.log(user);
            user.save(function (err, user) {
                if (err) return console.error(err);

            });
        });


    }
});
