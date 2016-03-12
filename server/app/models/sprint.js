var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SprintSchema = Schema({
  product: {type: Schema.ObjectId, required: true, ref: 'Product'},
    startDate : Date,
    endDate : Date,
    stories: [{type: Schema.ObjectId, ref: 'Story'}]
});

SprintSchema.set('toJSON', {
  virtuals : true
});

mongoose.model('Sprint', SprintSchema);