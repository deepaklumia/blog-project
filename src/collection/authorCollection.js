const authorModules = require("../module/authorModule");
const validator = require("email-validator");
const jwt = require("jsonwebtoken");
let regName = /^[a-zA-Z]+[a-zA-Z]+$/;
let passName = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
const createAuthor = async function (req, res) {
    try {
        let data = req.body;
        console.log(data);
        let { fname, lname, title, email, password } = data;
        if (!Object.keys(data).length === 0) {
            return res
                .status(404)
                .send("please fill the details it is required");
        }

        if (!fname || !fname.toString() === "") {
            return res.status(404).send("please fill the name");
        }

        fname = data.fname = fname.trim();
        if (!regName.test(fname)) {
            return res.status(404).send("please fill the valid name");
        }

        if (!lname || !lname.toString() === "") {
            return res.status(404).send("please fill the lname");
        }

        lname = data.lname = lname.trim();
        if (!regName.test(lname)) {
            return res.status(404).send("please fill the valid name");
        }

        title = data.title = title.trim();
        if (!["Mr", "Mrs", "Miss"].includes(title)) {
            return res.status(404).send("please fill the valid title");
        }

        if (!validator.validate(email)) {
            return res.status(404).send("please fill the valid email");
        }

        if (email) {
            let author = await authorModules.findOne({ email: email });
            if (author) {
                return res
                    .status(404)
                    .send(
                        "this email already exists, please fill another email"
                    );
            }
        }

        if (!passName.test(password)) {
            return res.status(404).send("password is not a valid password");
        }

        const authorData = await authorModules.create(data);
        return res.status(200).send({ status: true, data: authorData });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err.massage);
    }
};

const logIn = async (req, res) => {
    try {
        let data = req.body;
        console.log(data);
        let { email, password } = data;
        if (Object.keys(req.body).length == 0) {
            return res.status(404).send("please fill email and password");
        }
        if (!email || email == "") {
            return res
                .status(404)
                .send({ status: false, message: "email is required" });
        }
        if (!validator.validate(email)) {
            return res.status(404).send("please fill the valid email");
        }
        if (password == undefined || password == "") {
            return res
                .status(404)
                .send({ status: false, message: "password is required" });
        }
        if (!passName.test(password)) {
            return res.status(404).send("password is not a valid password");
        }

        let blog = await authorModules.findOne({
            email: email,
            password: password,
        });
        if (!blog) {
            return res.status(404).send("no record found");
        }
        console.log(blog);
        let token = await jwt.sign({ authorId: blog._id }, "deepaklumia98@");
        res.setHeader("x-api-key", token);
        return res.status(200).send({ status: true, token: token });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ status: false, massage: err.message });
    }
};
module.exports.createAuthor = createAuthor;
module.exports.logIn = logIn;

