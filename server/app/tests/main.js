var restify = require('restify');
var assert = require('assert');
var Config = require('../core/config');
config = new Config();

var client = restify.createJsonClient({
    url: 'http://127.0.0.1:' + config.server_port
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