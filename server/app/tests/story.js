var restify = require('restify');
var assert = require('assert');
var uuid = require('node-uuid');
var Config = require('../core/config');
config = new Config();


var client = restify.createJsonClient({
	url : 'http://127.0.0.1:' + config.server_port
});

describe('service: story', function() {

	  var product;

	  before(function(done) {

	    var code = uuid.v4();
	    var request = {
	      code : code,
	      name : 'Sprint product',
	      description : 'Sprint product'
	    }
	    client.post('/products', request, function(err, req, res, resData) {
	      product = resData.data;
	      done();
	    });
	  });

	// Test #1
	describe('get a story using incorrect id', function() {
		it('should get a 401 response', function(done) {
			client.get('/stories/1', function(err, req, res, data) {

				if (res.statusCode != 401) {
					throw new Error('invalid response from /stories/1');
				}
				done();
			});
		});
	});

	// Test #2
	describe('create and get a story without tasks', function() {
		it('should create a story and then retrieve it', function(done) {

			var data = {
					product: product.id,
					title: "test title"
		        };

			client.post('/stories', data, function(err, req, res, data) {

				if (res.statusCode != 201) {
					throw new Error('invalid response from /stories');
				}
				
				if(data.data.title != "test title"){
					throw new Error('invalid response from /stories');					
				}
				
				client.get('/stories/' + data.data.id, function(err, req, res, data) {

					if (res.statusCode != 200) {
						throw new Error('invalid response from /stories');
					}
					if(data.data.title != "test title"){
						throw new Error('invalid response from /stories');					
					}
					
					done();
				});					
			});
		});
	});

	// Test #3
	describe('create and get a story with tasks', function() {
		it('should create a story with tasks and then retrieve it', function(done) {

			var task = {
				title: "Something does not work",
				status: "inprogress",
				type: "bug",
				estimate: "5",
				created: "2015-04-04",
				priority: "LOW",
				creator: "Marcin Wachowiak",
				assignee: "Wachowiak Marcin"
			};

			client.post('/tasks', task, function(err, req, res, taskData) {

				if (res.statusCode != 201) {
					throw new Error('invalid response from /tasks');
				}
				if(taskData.data.taskId == undefined){
					throw new Error('invalid response from /stories');					
				}

				var storyData = { 
						product: product.id,
						title: "test title",
						tasks: [taskData.data.id ]
			        };

				client.post('/stories', storyData, function(err, req, res, data) {

					if (res.statusCode != 201) {
						throw new Error('invalid response from /stories');
					}

					if (data.data.tasks.length != 1) {
						throw new Error('invalid response from /stories');
					}

					if (data.data.tasks[0] != taskData.data.id) {
						throw new Error('invalid response from /stories');
					}

					done();

				});					
			});
		});
	});
});