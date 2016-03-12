var wagner = require('wagner-core');
var mongoose = require('mongoose');
var restify = require('restify');

var Config = require('./config');
cfg = new Config();

wagner.factory('config', function() {
      return cfg;
    });

wagner.factory('product', function() {
	return mongoose.model("Product");
});

wagner.factory('sprint', function() {
  return mongoose.model("Sprint");
});

wagner.factory('task', function() {
	return mongoose.model("Task");
});

wagner.factory('story', function() {
	return mongoose.model("Story");
});

wagner.factory('user', function() {
  return mongoose.model("User");
});

wagner.factory('responseHelper', function() {
  return responseHelper;
});

wagner.factory('testclient', function() {

  return restify.createJsonClient({
		url : 'http://127.0.0.1:' + cfg.server_port
	});
});