var mongoose = require('mongoose');

Story = mongoose.model("Story"); 
ObjectId = mongoose.Types.ObjectId;

function isObjectId(n) {
	  return mongoose.Types.ObjectId.isValid(n);
	}


function validateObjectId(req, res, next){

	objId = req.params.id;

	if(!isObjectId(objId)){
        res.status(401);
        res.json({
            type: false,
            data: "Invalid ID provided: " + objId
        });
        return false;
	}
	return true;
}

exports.viewStory = function(req, res, next) {

	if(!validateObjectId(req, res, next)){
        return;
	}

	Story.findById(new ObjectId(req.params.id)).populate('tasks').exec( function(err, story) {
		if (err) {
            res.status(500);
            res.json({
                type: false,
                data: "Error occured: " + err
            })
        } else {
            if (story) {
                res.json({
                    type: true,
                    data: story
                })
            } else {
                res.json({
                    type: false,
                    data: "Story: " + req.params.id + " not found"
                })
            }
        }
    })
}

exports.createStory = function(req, res, next) {

	var storyModel = new Story(req.body);

	storyModel.save(function(err, story) {
		if (err) {
			res.status(500);
			res.json({
				type : false,
				data : "Error occured: " + err
			})
		} else {
			res.status(201);
			res.json({
				type : true,
				data : story
			})
		}
	})
}

exports.updateStory = function(req, res, next) {

	if(!validateObjectId(req, res, next)){
        return;
	}

	var updatedStoryModel = new Story(req.body);
    Story.findByIdAndUpdate(new ObjectId(req.params.id), updatedStoryModel, function(err, story) {
        if (err) {
            res.status(500);
            res.json({
                type: false,
                data: "Error occured: " + err
            })
        } else {
            if (story) {
                res.json({
                    type: true,
                    data: story
                })
            } else {
                res.json({
                    type: false,
                    data: "Story: " + req.params.id + " not found"
                })
            }
        }
    })
}

exports.deleteStory = function(req, res, next) {

	if(!validateObjectId(req, res, next)){
        return; 
	}

	Story.findByIdAndRemove(new Object(req.params.id), function(err, story) {
        if (err) {
            res.status(500);
            res.json({
                type: false,
                data: "Error occured: " + err
            })
        } else {
            res.json({
                type: true,
                data: "Story: " + req.params.id + " deleted successfully"
            })
        }
    })
}