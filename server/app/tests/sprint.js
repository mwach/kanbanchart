var assert = require('assert');
var uuid = require('node-uuid');
var wagner = require('wagner-core');
require('../core/di-test');

var client;
wagner.invoke(function(testclient) {
  client = testclient;
});

URL_PRODUCTS = '/rest/products';
URL_SPRINTS = '/rest/sprints';
URL_STORIES = '/rest/stories';

describe('service: sprint', function() {

  var product;

  beforeEach(function(done) {

    var request = {
      code : uuid.v4(),
      name : 'Sprint product',
      description : 'Sprint product'
    }
    client.post(URL_PRODUCTS, request, function(err, req, res, resData) {
      product = resData;
      done();
    });
  });

  describe('create a sprint without stories', function() {
    it('should create a sprint and then retrieve it using ID or sprint dates',
        function(done) {

          var sprintData = {
            product : product.id,
            startDate : "2012-03-01",
            endDate : "2012-03-31"
          };

          client.post(URL_SPRINTS, sprintData, function(err, req, res, data) {

            if (res.statusCode != 201) {
              throw new Error('invalid response from /sprints');
            }

            client.get(URL_SPRINTS + '/' + data.id, function(err, req, res,
                sprintResponse) {

              if (res.statusCode != 200) {
                throw new Error('invalid response from /sprints');
              }
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

  describe('create two sprint with different dates and return the current one', function() {
    it('should create two sprints and then retrieve current one',
        function(done) {

       var today = new Date();
      
       var yesterday = new Date(today);
       yesterday.setDate(today.getDate() - 1);
      
       var weekAgo = new Date(today);
       weekAgo.setDate(today.getDate() - 7);

          var currentSprintData = {
            product : product.id,
            startDate : yesterday,
            endDate : today
          };
          var previousSprintData = {
              product : product.id,
              startDate : weekAgo,
              endDate : yesterday
            };

          client.post(URL_SPRINTS, currentSprintData, function(err, req, res, currentResponse) {

            client.post(URL_SPRINTS, previousSprintData, function(err, req, res, previousResponse) {

            client.get(URL_SPRINTS + '/current/' + product.id, function(err, req, res,
                sprintResponse) {

              if (res.statusCode != 200) {
                throw new Error('invalid response from /sprints/current');
              }
              if (sprintResponse.id != currentResponse.id) {
                throw new Error('invalid response from /sprints');
              }
              done();
            });
          });
        });
    });
  });

  describe('create a sprint with stories', function() {
    it('should create a sprint and then add some stories to it',
        function(done) {

          var sprintData = {
            product : product.id,
            startDate : "2012-03-01",
            endDate : "2012-03-31",
          };

          client.post(URL_SPRINTS, sprintData, function(err, req, res,
              sprintDataResponse) {

              // now, create a story
              var storyOne = {
                title : 'Some sample title',
                product : product.id,
              };
              var storyTwo = {
                product : product.id,
                title : 'Some sample title2',
              };

              client.post(URL_STORIES, storyOne, function(err, req, res,
                  storyOneResponse) {
            	  
                if (res.statusCode != 201) {
                  throw new Error('invalid response from /sprints');
                }

                client.post(URL_STORIES, storyTwo, function(err, req, res,
                    storyTwoResponse) {

                  if (res.statusCode != 201) {
                    throw new Error('invalid response from /sprints');
                  }

                  sprintDataResponse.stories.push(storyOneResponse.id);
                  sprintDataResponse.stories.push(storyTwoResponse.id);

                  client.put(URL_SPRINTS + '/' + sprintDataResponse.id, sprintDataResponse,
                      function(err, req, res, sprintDataUpd) {

                        client.get(URL_SPRINTS + '/' + sprintDataResponse.id, function(err,
                            req, res, sprintData) {

                        	if (res.statusCode != 200) {
                            throw new Error('invalid response from /sprints');
                          }
                          if (sprintData.stories.length != 2) {
                            throw new Error('invalid response from /sprints');
                          }
                          if (sprintData.stories[0].title != storyOne.title) {
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

  describe('create a sprint with stories and then remove stories', function() {
    it('should create a sprint and then remove assigned stories',
        function(done) {

          // now, create a story
          var storyOne = {
            title : 'Some sample title',
            product : product.id,
          };

          client.post(URL_SPRINTS, storyOne, function(err, req, res,
              storyOneResponse) {

            var sprintData = {
              product : product.id,
              startDate : "2012-03-01",
              endDate : "2012-03-31",
              stories : [ storyOneResponse.id ]
            };

            client.post(URL_SPRINTS, sprintData, function(err, req, res,
                sprintDataResponse) {

              sprintDataResponse.stories.shift();
              // delete
              client.put(URL_SPRINTS + '/' + sprintDataResponse.id, sprintDataResponse,
                  function(err, req, res, sprintDataUpd) {

                    client.get(URL_SPRINTS + '/' + sprintDataResponse.id, function(err,
                        req, res, sprintData) {
                      
                      if (res.statusCode != 200) {
                        throw new Error('invalid response from /sprints');
                      }
                      if (sprintData.stories.length != 0) {
                        throw new Error('invalid response from /sprints');
                      }
                      done();
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