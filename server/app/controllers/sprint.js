var wagner = require('wagner-core');

var Sprint;
wagner.invoke(function(sprint) {
  Sprint = sprint;
});

var sender;
wagner.invoke(function(responseHelper) {
  sender = responseHelper;
});

exports.createSprint = function(req, res, next) {

  var sprintModel = new Sprint(req.body);
  sprintModel.save(function(err, result) {
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

  var updatedData = {
    startDate : req.body.startDate,
    endDate : req.body.endDate,
    stories : req.body.stories
  };
  Sprint.findByIdAndUpdate(req.params.id, updatedData, function(
      err, result) {
    sender.putResponse(req.params.id, res, err, result, next);
  })
}

exports.viewCurrentSprintForProduct = function(req, res, next) {
  Story.find({
    'product' : req.params.productId
  }).populate('tasks').exec(function(err, result) {
    sender.putResponse(req.params.productId, res, err, result, next);
  })
}
