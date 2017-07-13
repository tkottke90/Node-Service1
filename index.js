"use strict";

// Variables
    var express = require("express");
    var url = require("url");
    var filesys = require("fs");

    var jsonModule = require("./modules/json.module.js");
    var jsonUsers = './database/json/users.json';

    var app = express();

    var root = "";

    var newUser = {
        "name" : "charlie",
        "id" : -1,
        "user_data" : "",
        "active" : true
    }

// Methods

    // GET root
    app.get(`${root}/`, function(req, res){
        var now = new Date().toUTCString();
        console.log(`${now} - [Server] [GET] - Root Request`);
        res.send( "Hello Out There!" );
    });

    // GET list of users
    app.get(`${root}/userslist`, function(req, res){
        var now = new Date().toUTCString();
        console.log(`${now} - [Server] [GET] - Get Users Request Submitted`);

        filesys.readFile(jsonUsers, 'utf8', function(err, data){
            console.log( data );
            res.send( data );
            now = new Date().toUTCString();
            console.log(`${now} - [Server] [GET] - Get Request Completed`);
        });
    });

    // GET details of user based on id
    app.get(`${root}/userslist/:id`, function(req, res){
        var now = new Date().toUTCString();
        
        filesys.readFile(jsonUsers, "utf8" , function(err, data){
            var users = JSON.parse( data );
            var user = users[ 'user' + req.params.id ];
            
            if(user != null){ 
                console.log(`${now} - [Server] [GET] - user${req.params.id}`);
                console.log( user );
                res.status(200).send( JSON.stringify(user) );
            }
            else
            {
                console.log(`${now} - [Server] [GET] - user${req.params.id} - No User Found`);
                res.status(400).send(`No User with id ${req.params.id} found`);
            }
        });
    });

    // GET users who are active

    // POST new user
    app.post('/userlist/addUser', function(req,res){
        filesys.readFile(jsonUsers, 'utf8', function(err, data){
            var j = JSON.parse(data);

            var userCount = 1;
            var user = j[`user${userCount}`];
            // Look for last user
            while(user != null){
                userCount++;
                user = j[`user${userCount}`];
            }
            // Update New User ID 
            newUser.id = userCount;
            j[`user${userCount}`] = newUser;
            console.log( j );
            res.status(200).send( JSON.stringify( j ));
        });
    });
    
    // PUT user status to opposite of current status (Active - Inactive) - used in production to deactivate user account on delete rather than just delete
    app.put('/userlist/deactUser/:id', function(req, res){
        filesys.readFile(jsonUsers, 'utf8', function(err, data){
            data = JSON.parse( data );
            data[`user${req.params.id}`].active = !data[`user${req.params.id}`].active;

            console.log( data )
            data[`user${req.params.id}`].active ? res.send(`User${req.params.id} Activated`) : res.send(`User${req.params.id} Deactivated`);
        })
    });

    // DELETE remove existing user
    app.delete('/userlist/deleteUser/:id', function(req, res){
        filesys.readFile(jsonUsers, 'utf8', function(err, data){
            data = JSON.parse( data );
            delete data[`user${req.params.id}`];

            console.log( data )
            res.send(`User${req.params.id} Deleted`);
        });
    });


var server = app.listen(8080, function () {  
    var port = server.address().port;
    var time = new Date().toUTCString();



    console.log(`${time} - [Server] - Server Started `);
    console.log(`${time} - [Server] - Server listening on port: ${port}`);
})


/*
 * Connect from Angular2 App Using HTTP Module: 
 * 
 * import { Http, Response } from '@angular/http';
 * import 'rxjs/add/operator/toPromise';
 * 
 * this.http.post('/api/userList/addUser', myJSON).toPromise().then((response) => {
            console.log(response);
        });
 * 
 * -------------------------------------------
 * If working locally using Angular2 app and local Node.js Server create proxy reference in Angular 2 app: 
 * 
 * {
 *      "/api" : {
 *          "target" : <local server location>,
 *          "secure" : false,
 *          "changeOrigin" : true,
 *          "pathRewrite" : {
 *              "^/api" : ""
 *          }
 *      }
 * }
 */