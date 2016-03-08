var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Task = require("./task");
var Sprint = require("./product");

var StorySchema = Schema({
  sprint: {type: Schema.ObjectId},
  product: {type: Schema.ObjectId, required: true, ref: 'Product'},
  title: {type: String, required: true},
	tasks: [{type: Schema.ObjectId, ref: 'Task'}]
});

StorySchema.set('toJSON', {
    virtuals: true
});

mongoose.model('Story', StorySchema);