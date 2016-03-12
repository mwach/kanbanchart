var wagner = require('wagner-core');

var cfg;
var config = wagner.invoke(function(config){
	cfg = config;
});

var restify = require('restify'), fs = require('fs')

var controllers = {}, controllers_path = process.cwd() + '/app/controllers'
fs.readdirSync(controllers_path).forEach(
		function(file) {
			if (file.indexOf('.js') != -1) {
				controllers[file.split('.')[0]] = require(controllers_path
						+ '/' + file)
			}
		})

var server = restify.createServer();

server.use(restify.fullResponse()).use(restify.bodyParser())

server.get("/", controllers.main.hello )

server.get("/users/:name", controllers.user.viewUser )

server.post("/products", controllers.product.createProduct )
server.get("/products/:code", controllers.product.viewProduct )
server.del("/products/:code", controllers.product.deleteProduct )
server.put("/products/:code", controllers.product.updateProduct )

server.post("/sprints", controllers.sprint.createSprint)
server.get("/sprints/:id", controllers.sprint.viewSprint)
server.put("/sprints/:id", controllers.sprint.updateSprint)
server.get("/sprints/current/:productId", controllers.sprint.viewCurrentSprintForProduct )

server.post("/stories", controllers.story.createStory )
server.get({path: "/stories/:id"}, controllers.story.viewStory)
server.put({path: "/stories/:id"}, controllers.story.updateStory)
server.del({path: "/stories/:id"}, controllers.story.deleteStory)

server.post("/tasks", controllers.task.createTask )
server.put({path: "/tasks/:id"}, controllers.task.updateTask)

var port = cfg.server_port || 3000;
server.listen(port, function(err) {
	if (err)
		console.error(err)
	else
		console.log('App is ready at : ' + port)
})

if (cfg.environment == 'production')
	process.on('uncaughtException', function(err) {
		console.error(JSON.parse(JSON.stringify(err, [ 'stack', 'message',
				'inner' ], 2)))
	})