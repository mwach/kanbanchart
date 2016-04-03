var wagner = require('wagner-core');
var errors = require('restify-errors');

var Sprint;
var Task;
wagner.invoke(function(sprint) {
  Sprint = sprint;
});
wagner.invoke(function(task) {
  Task = task;
});

var sender;
wagner.invoke(function(responseHelper) {
  sender = responseHelper;
});

exports.createSprint = function(req, res, next) {

  var model = new Sprint(req.body);
  model.save(function(err, result) {
    sender.postResponse(res, err, result, next);
  });
}

exports.viewSprint = function(req, res, next) {

  Sprint.findById(req.params.id).populate('stories').exec(
      function(err, sprintData) {
        sender.putResponse(req.params.id, res, err, sprintData, next);
      })
}

exports.updateSprint = function(req, res, next) {

  var model = {
    startDate : req.body.startDate,
    endDate : req.body.endDate,
    stories : req.body.stories
  };

  Sprint.findByIdAndUpdate(req.params.id, model, {new: true}, function(
      err, result) {
    sender.putResponse(req.params.id, res, err, result, next);
  })
}

exports.viewCurrentSprintForProduct = function(req, res, next) {

  currDateEnd = new Date();
  currDateEnd.setHours(0,0,0,0);
  currDateStart = new Date();
  currDateStart.setHours(23,59,59, 000);
  
  Sprint.findOne({
    'product' : req.params.productId,
    'startDate': {'$lte': currDateStart},
    'endDate': {'$gte': currDateEnd}
  }).populate('stories').lean().exec(function(err, result) {

    if(result == null){
      res.send(new errors.NotFoundError('no sprint matching criteria'));      
    }
    if(err){
      console.log(err);
      next(err);
    }
	result.id = result._id;
    var ids = result.stories.map(function(obj){ return obj._id; });

    Task.find({story: {$in: ids}}).lean().exec(function(err, tasks){

      console.log(tasks);
      if(err){
        console.log(err);
        next(err);
      }

      result.stories.forEach(function(story) {
    	story.id = story._id;
        story.tasks = [];
        var storyId = '' + story._id;
        tasks.forEach(function(task) {
            if(task.story == storyId){
            	task.id = task._id;
            	story.tasks.push(task);
            }
          });
      });
      
       sender.putResponse(req.params.productId, res, err, result, next);
     });
  });
}
