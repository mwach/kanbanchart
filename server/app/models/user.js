var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
  name : {
    type : String,
    required : true,
  },
  surname : {
    type : String,
    required : true
  },

  products : [ {
    type : Schema.ObjectId,
    ref : 'Product'
  } ]
});

UserSchema.set('toJSON', {
  virtuals : true
});

mongoose.model('User', UserSchema);
