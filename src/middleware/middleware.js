const jwt = require('jsonwebtoken');
const middleware = async function (req, res, next) {
    let token = req.headers["x-api-key"];
    if (!token) {
        return res
            .status(404)
            .send({ status: false, message: "token not generated" });
    }
    jwt.verify(token, "deepaklumia98", function (err, decoded) {
        if (err) {
            return res
                .status(500)
                .send({ status: false, message: "token is not valid" });
        }
        if (decoded) {
            req.authorId = decoded.authorId;
            return next();
        }
    });
};

module.exports.middleware = middleware;