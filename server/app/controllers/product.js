var mongoose = require('mongoose');

Product = mongoose.model("Product"); 

exports.createProduct = function(req, res, next) {

	var productModel = new Product(req.body);

	productModel.save(function(err, product) {

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
				data : product
			})
		}
	})
}

exports.viewProduct = function(req, res, next) {

	Product.find({code: req.params.code}).exec( function(err, product) {
		if (err) {
            res.status(500);
            res.json({
                type: false,
                data: "Error occured: " + err
            })
        } else {
            if (product && product.length > 0) {
                res.json({
                    type: true,
                    data: product[0]
                })
            } else {
            	res.status(404);
                res.json({
                    data: null
                })
            }
        }
    })
}

exports.deleteProduct = function(req, res, next) {

	Product.find({code: req.params.code}).remove().exec( function(err, product) {

		if (err) {
            res.status(500);
            res.json({
                type: false,
                data: "Error occured: " + err
            })
        } else {
            if (product) {
                res.json({
                    type: true,
                    data: 'ok'
                })
            } else {
                res.json({
                    type: false,
                    data: "Product with code: " + req.params.code + " not found"
                })
            }
        }
    })
}

exports.updateProduct = function(req, res, next) {

	var query = {code: req.params.code};
	var updatedData = {name: req.body.name, description: req.body.description, sprints: req.body.sprints};

	Product.update(query, updatedData).exec( function(err, result) {

		if (err) {
            res.status(500);
            res.json({
                type: false,
                data: "Error occured: " + err
            })
        } else {
            if (result) {
                res.json({
                    type: true,
                    data: result
                })
            } else {
            	res.status(404);
                res.json({
                    type: false,
                    data: "Product with code: " + req.params.code + " not found"
                })
            }
        }
    })
}
