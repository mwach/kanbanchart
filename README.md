db.counters.insert({"_id": "taskid", "seq": 0})

Examples

GET:

curl http://localhost:8081/stories

POST

curl -d '{"id": "2", "title": "Some task #4", "status": "todo", "type" : "enhancement", "estimate" : "5", "created": "2015-04-04", "priority": "LOW", "creator": "Marcin Wachowiak", "assignee": "Wachowiak Marcin"}' -H 'content-type:application/json'  http://localhost:8081/tasks

curl -d '{"title":"some title"}' -H 'content-type:application/json'  http://localhost:8081/stories

curl -d '{"title":"some title3", "tasks":["56d3542f75b4928b576d2462", "56d208c2133a1f8d356aaa93"]}' -H 'content-type:application/json'  http://localhost:8081/stories


How to run:

continous integration:

npm run start



How to debug:

npm install -g node-inspector

in one terminal:

/opt/nodejs/node-v4.2.4-linux-x64/bin/node-inspector

in another one:

node --debug server.js 

open browser window:

http://127.0.0.1:8080/debug?port=5858

run client:

http://127.0.0.1:3000/



In case of problems:

http://stackoverflow.com/questions/34399445/angular-2-quickstart-live-server-error
