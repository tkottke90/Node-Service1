"use strict";

// Variables
    var express = require("express");
    var bodyParser = require('body-parser');
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

// Use Methods

    app.use(bodyParser.json());

// Error Handling
    app.use(function(err, req, res, next){

        var stackStr = err.stack;
        var stackArr = stackStr.split('\n');
        var stackJSON = {};

        for(var i = 0; i < stackArr.length; i++){
            stackJSON[ `stack${i}`] = stackArr[i];
        }
        // var stackJSON = {}, counter = 0;

        // stackStr.forEach(function(str) {
        //     stackJSON[`stack${counter}`] = stackStr[counter];
        // }, this);
        
        // Create New Error Entry
        var errorMessage = {
            "timeStamp" : new Date().toUTCString(),
            "request" : {
                "header" : req.header,
                "ip" : req.ip
            },
            "name" : err.name,
            "message" : err,
            "stack" : stackJSON,
        } 

        filesys.readFile('errors.json', 'utf8', function(err, data){
            if(err){ console.log("Error Reading File: errors.json"); }

            data = JSON.parse(data);
            // Update Error Stats
            var errorStat = errorMessage.name;
            if(data.stats[errorStat] == null){
                data.stats[errorStat] = {
                    "lastOccurance" : new Date().toUTCString(),
                    "errorCount" : 1
                }
            }else{
                var eCount = data.stats[errorStat].errorCount + 1;
                data.stats[errorStat] = {
                    "lastOccurance" : new Date().toUTCString(),
                    "errorCount" : eCount
                }
            }

            // Add Error Log
            var errorName = new Date().valueOf();

            data.log[errorName] = errorMessage;
            

            filesys.writeFile('errors.json', JSON.stringify(data), 'utf8', function(err, data){
                if(err){ console.log(`Error Writing File: errors.json`); }
            });
            
        });

        var userMessage = {};
        var messageDate = new Date();
        switch(errorMessage.name){
            case "SyntaxError":
                userMessage = {
                    "Time_Stamp" : errorMessage.timeStamp,
                    "Error_Name" : errorMessage.name,
                    "Error_Description" :  `An Syntax Error Occured, please review sent data`,
                    "Reference Code" : messageDate.valueOf()
                }
                break;
            default:
                userMessage = {
                    "Time_Stamp" : errorMessage.timeStamp,
                    "Error_Name" : errorMessage.name,
                    "Error_Description" :  `An unknown error occured, please contact the server admin`,
                    "Reference Code" : messageDate.valueOf()
                }
        }

        console.log(`${messageDate.toUTCString()} - [Error] - Error Logged: ${messageDate.valueOf()}`)
        res.status(500).jsonp(userMessage);
    });

    
// Methods

    // GET root
    app.get(`${root}/`, function(req, res){
        var now = new Date().toUTCString();
        console.log(`${now} - [Server] [GET] - Root Request`);
        res.send( `Connected to Node.js Server at: http://localhost:${server.address().port}` );
    });

    // GET list of users
    app.get(`${root}/userslist`, function(req, res){
        var now = new Date().toUTCString();

        console.log(req.ip);

        console.log(`${now} - [Server] [GET] - Get Users Request Submitted`);

        filesys.readFile(jsonUsers, 'utf8', function(err, data){
            console.log( data );
            res.send( data );
            now = new Date().toUTCString();
            console.log(`${now} - [Server] [GET] - Get Request Completed`);
        });
    });

    // GET details of user based on id
    app.get(`${root}/userslist/getid/:id`, function(req, res){
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
    app.get(`${root}/userslist/active`, function(req, res){
        var now = new Date().toUTCString();
        console.log(`${now} - [Server] [GET] - Get Active Users Request`);

        filesys.readFile(jsonUsers, 'utf8', function(err, data){
            data = JSON.parse(data);
            var activeU = [];

            var counter = 0;
            var user = data[`user${counter}`];
            while(user != null){
                if(user.active){
                    activeU.push(user)
                }
                counter++
                var user = data[`user${counter}`];
            }

            console.log(activeU);
            res.send(activeU);
        });
    });


    // POST new user from newUser variable
    app.post(`${root}/userslist/addUser`, function(req,res){
        filesys.readFile(jsonUsers, 'utf8', function(err, data){
            var j = JSON.parse(data);

            var userCount = 0;
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

    // POST new user from request
    app.post(`${root}/userslist/addUser/json`, function(req,res){
        try{
            if(!req.is('json')) {
                res.jsonp(400, {error: 'Bad request'});
                return;
            }

            res.setHeader('Content-Type', 'application/json');

            
            var body = req.body;
        }catch(e){ 
            res.status(500).jsonp({ error : `JSON Parse Error - ${e}`});
            return;
         }
        var nUser = {
            "name" : body.name,
            "id" : -1,
            "user_data" : "",
            "active" : true
        }

        filesys.readFile(jsonUsers, 'utf8', function(err, data){
            var j = JSON.parse(data);

            var userCount = 0;
            var user = j[`user${userCount}`];
            // Look for last user
            while(user != null){
                userCount++;
                user = j[`user${userCount}`];
            }
            // Update New User ID 
            nUser.id = userCount;
            j[`user${userCount}`] = nUser;
            
            console.log(`${new Date().toUTCString()} - [Server] - User Added ${ JSON.stringify(nUser) }`)
            res.status(200).send( JSON.stringify( j ));
        });
    });
    
    // PUT user status to opposite of current status (Active - Inactive) - used in production to deactivate user account on delete rather than just delete
    app.put(`${root}/userslist/deactUser/:id`, function(req, res){
        filesys.readFile(jsonUsers, 'utf8', function(err, data){
            data = JSON.parse( data );
            data[`user${req.params.id}`].active = !data[`user${req.params.id}`].active;

            console.log( data )
            data[`user${req.params.id}`].active ? res.send(`User${req.params.id} Activated`) : res.send(`User${req.params.id} Deactivated`);
        })
    });

    // DELETE remove existing user
    app.delete(`${root}/userslist/deleteUser/:id`, function(req, res){
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

    filesys.exists('errors.json', function(exists){
        if(!exists){ 
            var jsonTemplate = {
                "stats" : {},
                "log" : {}
            }
            filesys.writeFile('errors.json', JSON.stringify(jsonTemplate), (err, data) => { 
                if(err){
                    console.log(err);
                } else { console.log("Errors.json file created"); }
             }); 
        }
    });

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