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

  console.log('create task: ' + req.body);
	if((typeof req.body) == 'string'){
		var taskModel = new Task(JSON.parse(req.body));
	}else{
		var taskModel = new Task(req.body);
	}
  console.log('task model: ' + JSON.stringify(taskModel));

	taskModel.save(function(err, result) {
	  console.log(err);
    console.log(res);
    sender.postResponse(res, err, result, next);
	})
}


exports.viewTask = function(req, res, next) {

	Task.findById(req.params.id).exec( function(err, result) {
	    sender.putResponse(req.params.id, res, err, result, next);
	})
}

exports.updateTask = function(req, res, next) {

  if((typeof req.body) == 'string'){
    var taskModel = JSON.parse(req.body);
  }else{
    var taskModel = req.body;
  }
  delete taskModel._id

	Task.findByIdAndUpdate(req.params.id, taskModel, function(err, result) {
    sender.putResponse(req.params.id, res, err, result, next);
    })
}
