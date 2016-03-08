exports.notFound = function(req, res) {
    res.status(404)
    res.json({
        error: 'not found',
        url: req.originalUrl
    })
}

exports.hello = function(req, res, next) {

    res.status(200);
    res.json({
        data: "Hello world"
    })

}
