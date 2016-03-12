var assert = require('assert');
var wagner = require('wagner-core');
require('../core/di-test');

var client;
wagner.invoke(function(testclient){
	client = testclient;
});

describe('service: hello', function() {

    // Test #1
    describe('200 response check', function() {
        it('should get a 200 response', function(done) {

        	client.get('/', function(err, req, res, data) {
            	
                if (err) {
                    throw new Error(err);
                }
                else {
                    if (res.statusCode != 200) {
                        throw new Error('invalid response from / ');
                    }
                    if (data.data != 'Hello world') {
                        throw new Error('invalid response from / ');
                    }
                    done();
                }
            });
        });
    });

});