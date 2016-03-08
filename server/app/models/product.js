var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = Schema({
  code : {
    type : String,
    required : true,
    unique : true
  },
  name : {
    type : String,
    required : true
  },
  description : {
    type : String
  },

  sprints : [ {
    startDate : Date,
    endDate : Date
  } ]
});

//ProductSchema.pre('save', function(next) {
//  var doc = this;
//
//  if (doc.sprints.length > 0) {
//
//    Sprint.find({
//      code : doc.code,
//      $or : [ {
//        'sprints.startDate' : {
//          "$gte" : doc.sprints.startDate,
//          "$lte" : doc.sprints.endDate
//        }
//      }, {
//        'sprints.endDate' : {
//          "$gte" : doc.sprints.startDate,
//          "$lte" : doc.sprints.endDate
//        }
//      } ]
//    }, function(error, data) {
//      if (error)
//        return next(error);
//      if (data.length > 0) {
//        var err = new RangeError('Overlap with one of the existing sprints');
//        err.http_code = 401;
//        next(err);
//
//      }
//      next();
//    });
//  }
//  next();
//});

ProductSchema.set('toJSON', {
  virtuals : true
});

mongoose.model('Product', ProductSchema);