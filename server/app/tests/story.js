var assert = require('assert');
var uuid = require('node-uuid');
var wagner = require('wagner-core');
require('../core/di-test');

var client;
wagner.invoke(function(testclient){
	client = testclient;
});

describe('service: story', function() {

	  var product;

	  before(function(done) {

	    var request = {
	      code : uuid.v4(),
	      name : 'Sprint product',
	      description : 'Sprint product'
	    }
	    client.post('/products', request, function(err, req, res, resData) {
	      product = resData;
	      done();
	    });
	  });

	// Test #1
	describe('get a story using incorrect id', function() {
		it('should get a 400 response', function(done) {
			client.get('/stories/1', function(err, req, res, data) {

				if (res.statusCode != 400) {
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
				
				if(data.title != "test title"){
					throw new Error('invalid response from /stories');					
				}
				
				client.get('/stories/' + data.id, function(err, req, res, data) {

					if (res.statusCode != 200) {
						throw new Error('invalid response from /stories');
					}
					if(data.title != "test title"){
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
				if(taskData.taskId == undefined){
					throw new Error('invalid response from /stories');					
				}

				var storyData = { 
						product: product.id,
						title: "test title",
						tasks: [taskData.id ]
			        };

				client.post('/stories', storyData, function(err, req, res, data) {

					if (res.statusCode != 201) {
						throw new Error('invalid response from /stories');
					}

					if (data.tasks.length != 1) {
						throw new Error('invalid response from /stories');
					}

					if (data.tasks[0] != taskData.id) {
						throw new Error('invalid response from /stories');
					}

					done();

				});					
			});
		});
	});
});