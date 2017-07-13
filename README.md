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

### POST new user server (not users.json)
Pulls in users.json, then adds new user to list.  User is currently defined in service

http://localhost:8080/userslist/addUser => Returns: { updated users list }

### PUT users active status to active or inactive
Switches the active status on a user to true or false based on if the user is active or inactive

http://localhost:8080/userslist/deactUser/:id => Returns: { updated users list }

### DELETE
Pulls in users.json, then deletes user based on id parameter.  Change is not currently saved to users.json.

http://localhost:8080/userslist/deleteUser/:id => Returns: "Notification of Deleted User"

## References:

[Node.js RESTful API](https://www.tutorialspoint.com/nodejs/nodejs_restful_api.htm) - Tutorials Point Tutorial used as guide
