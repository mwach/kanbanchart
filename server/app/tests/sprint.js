var assert = require('assert');
var uuid = require('node-uuid');
var wagner = require('wagner-core');
require('../core/di-test');

var client;
wagner.invoke(function(testclient) {
  client = testclient;
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

          client.post('/sprints', sprintData, function(err, req, res, data) {

            if (res.statusCode != 201) {
              throw new Error('invalid response from /sprints');
            }

            client.get('/sprints/' + data.id, function(err, req, res,
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

  describe('create a sprint with stories', function() {
    it('should create a sprint and then retrieve it using ID or sprint dates',
        function(done) {

          var sprintData = {
            product : product.id,
            startDate : "2012-03-01",
            endDate : "2012-03-31",
          };

          client.post('/sprints', sprintData, function(err, req, res,
              sprintDataResponse) {

            client.get('/sprints/' + sprintDataResponse.id, function(err, req,
                res, sprintResponse) {

              // now, create a story
              var storyOne = {
                title : 'Some sample title',
                product : product.id,
                tasks : []
              };
              var storyTwo = {
                product : product.id,
                title : 'Some sample title2',
                tasks : []
              };

              client.post('/stories', storyOne, function(err, req, res,
                  storyOneResponse) {

                if (res.statusCode != 201) {
                  throw new Error('invalid response from /sprints');
                }

                client.post('/stories', storyTwo, function(err, req, res,
                    storyTwoResponse) {

                  if (res.statusCode != 201) {
                    throw new Error('invalid response from /sprints');
                  }

                  sprintDataResponse.stories.push(storyOneResponse.id);
                  sprintDataResponse.stories.push(storyTwoResponse.id);

                  client.put('/sprints/' + sprintResponse.id, sprintDataResponse,
                      function(err, req, res, sprintDataUpd) {

                        client.get('/sprints/' + sprintResponse.id, function(err,
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
  });

  describe('create a sprint with stories and then remove stories', function() {
    it('should create a sprint and then remove assigned stories',
        function(done) {

          // now, create a story
          var storyOne = {
            title : 'Some sample title',
            product : product.id,
          };

          client.post('/stories', storyOne, function(err, req, res,
              storyOneResponse) {

            var sprintData = {
              product : product.id,
              startDate : "2012-03-01",
              endDate : "2012-03-31",
              stories : [ storyOneResponse.id ]
            };

            client.post('/sprints', sprintData, function(err, req, res,
                sprintDataResponse) {

              sprintDataResponse.stories.shift();
              // delete
              client.put('/sprints/' + sprintDataResponse.id, sprintDataResponse,
                  function(err, req, res, sprintDataUpd) {

                    client.get('/sprints/' + sprintDataResponse.id, function(err,
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