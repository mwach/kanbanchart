var wagner = require('wagner-core');

var Product;
var sender;
wagner.invoke(function(product) {
  Product = product;
});
wagner.invoke(function(responseHelper) {
  sender = responseHelper;
});

exports.createProduct = function(req, res, next) {

  var productModel = new Product(req.body);
  productModel.save(function(err, result) {

    sender.postResponse(res, err, result, next);
  });
}

exports.viewProduct = function(req, res, next) {

  Product.findById(req.params.id).exec( function(err, result) {
    sender.putResponse(req.params.id, res, err, result, next);
    })
}

exports.viewProductByCode = function(req, res, next) {

  Product.findOne({
    code : req.params.code
  }).exec(function(err, result) {
    sender.putResponse(req.params.code, res, err, result, next);
  })
}

exports.deleteProduct = function(req, res, next) {

  Product.findByIdAndRemove(req.params.id, function(err, result) {
    sender.putResponse(req.params.id, res, err, result, next);
   })
}

exports.updateProduct = function(req, res, next) {

  var query = {
    _id : req.params.id
  };
  var updatedData = {
    name : req.body.name,
    description : req.body.description,
    sprints : req.body.sprints
  };

  Product.update(query, updatedData).exec(function(err, result) {
    sender.putResponse(req.params.code, res, err, result, next);
  })
}
