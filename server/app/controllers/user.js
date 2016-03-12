var wagner = require('wagner-core');
var errors = require('restify-errors');

var User;
wagner.invoke(function(user) {
  User = user;
});

// https://github.com/restify/errors
exports.viewUser = function(req, res, next) {

  User.find({
    name : req.params.name
  }, '-__v').populate('products').exec(
      function(err, userData) {
        if (err) {
          res.send(new errors.InternalServerError(err));
        } else {
          if (userData && userData.length > 0) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.send(userData[0]);
          } else {
            res.send(new errors.NotFoundError('user with name \''
                + req.params.name + '\' not found'));
          }
        }
      })
}
