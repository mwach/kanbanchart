var restify = require('restify');
var assert = require('assert');
var uuid = require('node-uuid');
var Config = require('../core/config');
config = new Config();

var client = restify.createJsonClient({
  url : 'http://127.0.0.1:' + config.server_port
});

describe('service: sprint', function() {

  var product;

  beforeEach(function(done) {

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

  describe('create a sprint without stories', function() {
    it('should create a sprint and then retrieve it using ID or sprint dates',
        function(done) {

          var sprintData = {
            startDate : "2012-03-01",
            endDate : "2012-03-31",
          };
          product.sprints.push(sprintData);

          client.put('/products/' + product.code, product, function(err, req,
              res, data) {

            if (res.statusCode != 200) {
              throw new Error('invalid response from /sprints');
            }

            client.get('/products/' + product.code, function(err, req, res,
                projectData) {

              if (res.statusCode != 200) {
                throw new Error('invalid response from /sprints');
              }
              if (projectData.data.sprints.length != 1) {
                throw new Error('invalid response from /sprints');
              }
              var sprintResponse = projectData.data.sprints[0];
              if (new Date(sprintData.startDate).getTime() != new Date(
                  sprintResponse.startDate).getTime()) {
                throw new Error('invalid response from /sprints');
              }
              if (new Date(sprintData.endDate).getTime() != new Date(
                  sprintResponse.endDate).getTime()) {
                throw new Error('invalid response from /sprints');
              }

              done();
            });
          });
        });
  });

  describe('create a sprint with stories', function() {
    it('should create a sprint and then retrieve it using ID or sprint dates',
        function(done) {

          var sprintData = {
            startDate : "2012-03-01",
            endDate : "2012-03-31",
          };
          product.sprints.push(sprintData);

          client.put('/products/' + product.code, product, function(err, req,
              res, data) {

            client.get('/products/' + product.code, function(err, req, res,
                projectData) {

              var sprintResponse = projectData.data.sprints[0];
              // now, create a story
              var storyOne = {
                sprint : sprintResponse._id,
                title : 'Some sample title',
                product: product.id,
                tasks : []
              };
              var storyTwo = {
                sprint : sprintResponse._id,
                product: product.id,
                title : 'Some sample title2',
                tasks : []
              };

              client.post('/stories', storyOne, function(err, req, res,
                  storyData) {

                if (res.statusCode != 201) {
                  throw new Error('invalid response from /sprints');
                }

                client.post('/stories', storyTwo, function(err, req, res,
                    storyData) {

                  if (res.statusCode != 201) {
                    throw new Error('invalid response from /sprints');
                  }


                  client.get('/sprints/' + storyOne.sprint, function(err, req,
                      res, sprintData) {


                    if (res.statusCode != 200) {
                      throw new Error('invalid response from /sprints');
                    }
                    if (sprintData.data.length != 2) {
                      throw new Error('invalid response from /sprints');
                    }
                    if (sprintData.data[0].title != storyOne.title) {
                      throw new Error('invalid response from /sprints');
                    }
                    done();
                  });
                });
              });
            });
          });
        });
  });

  // describe(
  // 'cannot have two sprint with overlaping times',
  // function() {
  // it(
  // 'Should try to create two sprints with some overlap. Creation of the second
  // one should fail',
  // function(done) {
  //
  // var today = new Date();
  //
  // var tomorrow = new Date(today);
  // tomorrow.setDate(today.getDate() + 1);
  //
  // var nextWeek = new Date(today);
  // nextWeek.setDate(today.getDate() + 7);
  //
  // var sprintOne = {
  // startDate : today,
  // endDate : nextWeek,
  // };
  // var sprintTwo = {
  // startDate : tomorrow,
  // endDate : nextWeek,
  // };
  //
  // product.sprints.push(sprintOne)
  // product.sprints.push(sprintTwo)
  // client.put('/products/' + product.code, product, function(
  // err, req, res, data) {
  //
  // if (res.statusCode != 401) {
  // throw new Error('invalid response from /sprints');
  // }
  // done();
  // });
  // });
  // });

});