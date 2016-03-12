var wagner = require('wagner-core');
var mongoose = require('mongoose');
var restify = require('restify');

var responseHelper = require('../helpers/response-helper');

var Config = require('./config');

wagner.factory('config', function() {
      return new Config();
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
