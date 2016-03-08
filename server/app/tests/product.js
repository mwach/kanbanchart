var restify = require('restify');
var assert = require('assert');
var uuid = require('node-uuid');
var mongoose = require('mongoose');
var Config = require('../core/config');
config = new Config();

var client = restify.createJsonClient({
  url : 'http://127.0.0.1:' + config.server_port
});

describe('service: product', function() {

  // Test #1
  describe('product creation', function() {
    it('should create a product', function(done) {
      var code = uuid.v1();
      var request = {
        code : code,
        name : 'ABC product',
        description : 'some description'
      }
      client.post('/products', request, function(err, req, res, data) {

        if (err) {
          throw new Error(err);
        }
        if (res.statusCode != 201) {
          throw new Error('invalid response from /products ');
        }
        if (data.data.code != request.code && data.data.name != request.name
            && data.data.description != request.description) {
          throw new Error('invalid response from /products ');
        }
        done();
      });
    });
  });

  // Test #1
  describe('product creation', function() {
    it('should create a product with sprint data', function(done) {
      var code = uuid.v1();
      var request = {
        code : code,
        name : 'Product with Sprints',
        description : 'Product with Sprints',
        sprints : [ {
          startDate : "2015-03-01",
          endDate : "2015-03-31"
        }, {
          startDate : "2015-02-01",
          endDate : "2015-02-28"
        } ]
      }

      client.post('/products', request, function(err, req, res, data) {

        // try to retrieve it
        client.get('/products/' + code, function(err, req, res, resData) {

          if (resData.data.code != request.code
              && resData.data.name != request.name
              && resData.data.description != request.description) {
            throw new Error('invalid response from /products/:code ');
          }
          done();
        });
      });
    });
  });

  // Test #1
  describe('product get', function() {
    it('should retrieve a product', function(done) {

      // create a product
      var code = uuid.v1();
      var request = {
        code : code,
        name : 'GET',
        description : 'description'
      }
      client.post('/products', request, function(err, req, res, data) {

        // try to retrieve it
        client.get('/products/' + code, function(err, req, res, data) {

          if (err) {
            throw new Error(err);
          }
          if (res.statusCode != 200) {
            throw new Error('invalid response from /products/:code ');
          }

          if (data.data.code != request.code && data.data.name != request.name
              && data.data.description != request.description) {
            throw new Error('invalid response from /products/:code ');
          }
          done();
        });
      });
    });
  });

  // Test #3
  describe('product delete', function() {
    it('should create a product and then delete it', function(done) {

      // create a product
      var code = uuid.v1();
      var request = {
        code : code,
        name : 'DELETE',
        description : 'DELETE'
      }
      client.post('/products', request, function(err, req, res, data) {

        // try to delete it
        client.del('/products/' + code, function(err, req, res, data) {

          if (res.statusCode != 200) {
            throw new Error('invalid response from /products/:code ');
          }

          // finally, try to retrieve it
          client.get('/products/' + code, function(err, req, res, data) {

            if (res.statusCode != 404) {
              throw new Error('invalid response from /products/:code ');
            }
            done();
          });
        });
      });
    });
  });

  // Test #4
  describe('product update', function() {
    it('should create a product and then update it', function(done) {

      // create a product
      var code = uuid.v1();
      var request = {
        code : code,
        name : 'before update',
        description : 'before update'
      }
      client.post('/products', request, function(err, req, res, data) {

        // try to update it
        var requestUpdate = {
          code : code,
          name : 'after update',
          description : 'after update'
        }
        client.put('/products/' + code, requestUpdate, function(err, req, res,
            data) {

          if (res.statusCode != 200) {
            throw new Error('invalid response from /products/:code ');
          }

          // finally, try to retrieve it
          client.get('/products/' + code, function(err, req, res, getData) {

            if (res.statusCode != 200) {
              throw new Error('invalid response from /products/:code ');
            }
            if (getData.data.code != requestUpdate.code
                && getData.data.name != requestUpdate.name
                && getData.data.description != requestUpdate.description) {
              throw new Error('invalid response from /products/:code ');
            }
            done();
          });
        });
      });
    });
  });

  // Test #1
  describe('product update', function() {
    it('should update a product with sprint data (add/remove sprint entry)',
        function(done) {
          var code = uuid.v1();
          var request = {
            code : code,
            name : 'Product with Sprints',
            description : 'Product with Sprints',
            sprints : [ {
              startDate : "2015-03-01",
              endDate : "2015-03-31"
            } ]
          }

          client.post('/products', request, function(err, req, res, data) {

            // try to update it
            request.sprints.push({
              startDate : "2015-02-01",
              endDate : "2015-02-28"
            });
            client.put('/products/' + code, request, function(err, req, res,
                data) {

              // finally, try to retrieve it
              client.get('/products/' + code, function(err, req, res, getData) {

                if (getData.data.sprints.length != 2) {
                  throw new Error('invalid response from /products/:code ');
                }

                // update it again - remove sprint
                request.sprints.shift();

                client.put('/products/' + code, request, function(err, req,
                    res, data) {

                  // finally, try to retrieve it
                  client.get('/products/' + code,
                      function(err, req, res, getData) {

                        if (getData.data.sprints.length != 1) {
                          throw new Error(
                              'invalid response from /products/:code ');
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