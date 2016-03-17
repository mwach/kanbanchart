var wagner = require('wagner-core');

var Story;
var sender;
wagner.invoke(function(story){
	Story = story;
});
wagner.invoke(function(responseHelper) {
  sender = responseHelper;
});

exports.viewStory = function(req, res, next) {

	Story.findById(req.params.id).populate('tasks').exec( function(err, result) {
    sender.putResponse(req.params.id, res, err, result, next);
    })
}

exports.createStory = function(req, res, next) {

	var storyModel = new Story(req.body);

	storyModel.save(function(err, result) {
    sender.postResponse(res, err, result, next);
	})
}

exports.updateStory = function(req, res, next) {

    Story.findByIdAndUpdate(req.params.id, JSON.parse(req.body), function(err, result) {
      sender.putResponse(req.params.id, res, err, result, next);
    })
}

exports.deleteStory = function(req, res, next) {

	Story.findByIdAndRemove(req.params.id, function(err, result) {
    sender.putResponse(req.params.id, res, err, result, next);
   })
}