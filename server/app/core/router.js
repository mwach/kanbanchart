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
server.use(restify.queryParser());

server.use(restify.fullResponse()).use(restify.bodyParser())

server.get("/rest/users/:name", controllers.user.viewUser )

server.post("/rest/products", controllers.product.createProduct )
server.get("/rest/products/:id", controllers.product.viewProduct )
server.get("/rest/products?code=:code", controllers.product.viewProductByCode )
server.del("/rest/products/:id", controllers.product.deleteProduct )
server.put("/rest/products/:id", controllers.product.updateProduct )

server.post("/rest/sprints", controllers.sprint.createSprint)
server.get("/rest/sprints/:id", controllers.sprint.viewSprint)
server.put("/rest/sprints/:id", controllers.sprint.updateSprint)
server.get("/rest/sprints/current/:productId", controllers.sprint.viewCurrentSprintForProduct )

server.post("/rest/stories", controllers.story.createStory )
server.get({path: "/rest/stories/:id"}, controllers.story.viewStory)
server.put({path: "/rest/stories/:id"}, controllers.story.updateStory)
server.del({path: "/rest/stories/:id"}, controllers.story.deleteStory)

server.post("/rest/tasks", controllers.task.createTask )
server.put({path: "/rest/tasks/:id"}, controllers.task.updateTask)

server.get('/', function (req, res, next) {
    res.redirect('index.html', next);
});

server.get('/.*', restify.serveStatic({
  directory: './static'
}));


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