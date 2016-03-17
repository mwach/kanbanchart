var assert = require('assert');
var uuid = require('node-uuid');
var wagner = require('wagner-core');
require('../core/di-test');

var client;
wagner.invoke(function(testclient) {
  client = testclient;
});

URL_PRODUCT = '/rest/products';
URL_TASKS = '/rest/tasks';
URL_STORIES = '/rest/stories';

describe('service: story', function() {

  var product;

  before(function(done) {

    var request = {
      code : uuid.v4(),
      name : 'Sprint product',
      description : 'Sprint product'
    }
    client.post(URL_PRODUCT, request, function(err, req, res, resData) {
      product = resData;
      done();
    });
  });

  // Test #1
  describe('get a story using incorrect id', function() {
    it('should get a 400 response', function(done) {
      client.get(URL_STORIES + '/1', function(err, req, res, data) {

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
        product : product.id,
        title : "test title"
      };

      client.post(URL_STORIES, data, function(err, req, res, data) {

        if (res.statusCode != 201) {
          throw new Error('invalid response from /stories');
        }

        if (data.title != "test title") {
          throw new Error('invalid response from /stories');
        }

        client.get(URL_STORIES + '/' + data.id, function(err, req, res, data) {

          if (res.statusCode != 200) {
            throw new Error('invalid response from /stories');
          }
          if (data.title != "test title") {
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

      var storyData = {
        product : product.id,
        title : "test title",
      };

      client.post(URL_STORIES, storyData, function(err, req, res, story) {

        if (res.statusCode != 201) {
          throw new Error('invalid response from /stories');
        }
        var task = {
          story : story.id,
          title : "Something does not work",
          status : "inprogress",
          type : "Bug",
          estimate : "5",
          created : "2015-04-04",
          priority : "Low",
          creator : "Marcin Wachowiak",
          assignee : "Wachowiak Marcin"
        };

        client.post(URL_TASKS, task, function(err, req, res, taskData) {

          if (res.statusCode != 201) {
            throw new Error('invalid response from /tasks');
          }
          if (taskData.story != story.id) {
            throw new Error('invalid response from /stories');
          }
          done();
        });
      });
    });
  });
});