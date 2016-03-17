var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StorySchema = Schema({
  product: {type: Schema.ObjectId, required: true, ref: 'Product'},
  title: {type: String, required: true},
});

StorySchema.set('toJSON', {
    virtuals: true
});

mongoose.model('Story', StorySchema);