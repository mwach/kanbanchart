var wagner = require('wagner-core');

var Task;
var sender;
wagner.invoke(function(task){
	Task = task;
});
wagner.invoke(function(responseHelper) {
  sender = responseHelper;
});

exports.createTask = function(req, res, next) {

	var taskModel = new Task(req.body);

	taskModel.save(function(err, result) {
    sender.postResponse(res, err, result, next);
	})
}

exports.updateTask = function(req, res, next) {

	var updatedTaskModel = new Task(req.body);
	Task.findByIdAndUpdate(req.params.id, updatedTaskModel, function(err, result) {
    sender.putResponse(req.params.id, res, err, result, next);
    })
}
