var mongoose = require('mongoose');

Task = mongoose.model("Task");  
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

exports.createTask = function(req, res, next) {

	var taskModel = new Task(req.body);

	taskModel.save(function(err, task) {
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
				data : task
			})
		}
	})
}

exports.updateTask = function(req, res, next) {

	if(!validateObjectId(req, res, next)){
        return;
	}

	var updatedTaskModel = new Task(req.body);
	Task.findByIdAndUpdate(new ObjectId(req.params.id), updatedTaskModel, function(err, task) {
        if (err) {
            res.status(500);
            res.json({
                type: false,
                data: "Error occured: " + err
            })
        } else {
            if (task) {
                res.json({
                    type: true,
                    data: task
                })
            } else {
                res.json({
                    type: false,
                    data: "Task: " + req.params.id + " not found"
                })
            }
        }
    })
}
