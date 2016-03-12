var errors = require('restify-errors');


exports.postResponse = function(res, err, data, next) {

  if (err) {
    serverError(err, next);
  } else {
    created(res, data, next);
  }
}

exports.putResponse = function(param, res, err, data, next) {

  if (err) {
    serverError(err, next);
  } else if (data) {
    single(res, data, next);
  } else {
    notFound(param, next);
  }
}


function serverError(err, next) {

  if (err.name == 'ValidationError' || err.name == 'CastError') {
    next(new errors.BadRequestError(err.message));
  } else {
    next(new errors.InternalServerError(err.message));
  }
}

function notFound(itemId, next) {

    next(new errors.NotFoundError());
}

function created(res, data, next) {
  res.send(201, data);
  next();
}

function single(res, data, next) {
  res.send(200, data);
  next();
}
