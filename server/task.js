var mongoose = require('mongoose');

var schema = mongoose.Schema({
	id: {type: Number, required: true, unique: true},
	title: {type: String, required: true},
	status: {type: String, required: true},
	type: {type: String, required: true},
	estimate: {type: Number, required: true},
	created: Date,
	priority: String,
	creator: String,
	assignee: String
});

module.exports=schema;