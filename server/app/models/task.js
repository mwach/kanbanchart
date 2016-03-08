var mongoose = require('mongoose');
var Schema = mongoose.Schema;

Counter = mongoose.model("Counter");

var TaskSchema = Schema({
	taskId: {type: String},
	title: {type: String, required: true},
	status: {type: String, required: true},
	type: {type: String, required: true},
	estimate: {type: Number, required: true},
	created: Date,
	priority: String,
	creator: String,
	assignee: String
});

TaskSchema.pre('save', function(next) {
    var doc = this;
    Counter.findByIdAndUpdate('taskid', {$inc: { seq: 1} }, function(error, counter){
    	if(error)
            return next(error);
        doc.taskId = counter.seq;
        next();
    });
});

TaskSchema.set('toJSON', {
    virtuals: true
});

mongoose.model('Task', TaskSchema);