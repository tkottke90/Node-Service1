# Node-Service1
My first attempt at creating a RESTful Node.js Web Servcice

## Current Features:

### GET Root:
Navigating to this url will return a response that you have successfully accessed this Node.js application

http://localhost:8080 => Returns: "Connected to Node.js Server at: http://localhost:8080"

### GET Users:
Returns a list of users from database/json/users.json

http://localhost:8080/userslist => Returns: { users.json }

### GET User by ID: 
Returns information about a particular user based on the ID entered in the uri parameters

http://localhost:8080/userslist/getid/:id => Returns: { user information based on id }

### GET Active Users
Returns information about which users are currently listed as active.  Created to test the use of active/inactive accounts vs. deleting accounts

http://localhost:8080/userslist/active => Returns: { Active Users }

### POST new user from server (not users.json)
Pulls in users.json, then adds new user to list.  User is currently defined in service

http://localhost:8080/userslist/addUser => Returns: { updated users list }

### POST new user from http request
Gets JSON object from POST request,  pulls in the users.json and adds the new user to a runtime copy of the users.json

http://localhost8080/userslist/addUser/json => Returns: { updated users list }

### PUT users active status to active or inactive
Switches the active status on a user to true or false based on if the user is active or inactive

http://localhost:8080/userslist/deactUser/:id => Returns: { updated users list }

### DELETE
Pulls in users.json, then deletes user based on id parameter.  Change is not currently saved to users.json.

http://localhost:8080/userslist/deleteUser/:id => Returns: "Notification of Deleted User"

### Error Handling
Created error messenger using Expressjs's error function.  Initially created to handle Syntax Errors with JSON Send tin POST Request.  left the feature open to allow for additional error reporting in the future.  The function creates a unqiue error id and sends a JSON response to user with more details about the error as well as that id if they needed to contact the server admin

## References:

[Node.js RESTful API](https://www.tutorialspoint.com/nodejs/nodejs_restful_api.htm) - Tutorials Point Tutorial used as guide
