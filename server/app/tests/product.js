var assert = require('assert');
var uuid = require('node-uuid');
var wagner = require('wagner-core');
require('../core/di-test');

var client;
wagner.invoke(function(testclient){
	client = testclient;
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
        if (data.code != request.code && data.name != request.name
            && data.description != request.description) {
          throw new Error('invalid response from /products ');
        }
        done();
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

          if (data.code != request.code && data.name != request.name
              && data.description != request.description) {
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
            if (getData.code != requestUpdate.code
                && getData.name != requestUpdate.name
                && getData.description != requestUpdate.description) {
              throw new Error('invalid response from /products/:code ');
            }
            done();
          });
        });
      });
    });
  });
});