var mongoose = require('mongoose');

var schema = mongoose.Schema({
	title: {type: String, required: true},
	tasks: [{type: String, ref: 'Task'}]
});

module.exports = schema;