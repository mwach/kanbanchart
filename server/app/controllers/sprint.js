var mongoose = require('mongoose');

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

exports.viewSprint = function(req, res, next) {

	if(!validateObjectId(req, res, next)){
        return;
	}

	Story.find({'sprint' : req.params.id}).populate('tasks').exec( function(err, sprintData) {
		if (err) {
            res.status(500);
            res.json({
                type: false,
                data: "Error occured: " + err
            })
        } else {
            if (sprintData) {
                res.json({
                    type: true,
                    data: sprintData
                })
            } else {
                res.json({
                    type: false,
                    data: "Sprint: " + req.params.id + " not found"
                })
            }
        }
    })
}
