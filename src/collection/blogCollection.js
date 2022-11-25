const blogModules = require("../module/blogModule");
const mongoose = require("mongoose");
const { result } = require("lodash");
const objectId = mongoose.Types.ObjectId;
const createBlog = async function (req, res) {
    try {
        const data = req.body;
        if (!Object.keys(data).length === 0) {
            return res.status(404).send("please fill the all details");
        }
        if (!data.title || data.title === "") {
            return res.status(404).send("please fill the title");
        }
        data.title = data.title.trim();

        if (!data.body || data.body === "") {
            return res.status(404).send("please fill the body");
        }
        data.body = data.body.trim();

        if (!data.authorId || !data.authorId === "") {
            return res.status(404).send("please fill the authorId");
        }
        if (!objectId.isValid(data.authorId)) {
            return res.status(404).send("please fill the valid authorId");
        }
        if (!data.category || !data.category === "") {
            return res.status(404).send("please fill the category");
        }
        data.category = data.category.trim();
        if (data.isDeleted === true) {
            data.deletedAt = Date.now();
            console.log(data.isDeleted);
        }
        if (data.isPublished === true) {
            data.publishedAt = Date.now();
            console.log(data.publishedAt);
        }
        const blog = await blogModules.create(data);
        return res.status(201).send({ status: true, data: blog });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ status: true, error: err.massage });
    }
};

const getBlog = async (req, res) => {
    try {
        let search = req.query.search;
        if (Object.keys(req.query).length == 0) {
            let blog = await blogModules.find({
                isDeleted: false,
                isPublished: true,
            });
            return res.status(200).send({ status: true, data: blog });
        }
        let blog = await blogModules.find();
        if (blog.isPublished == true && blog.isDeleted == false) {
            let data = blog.filter((value) => {
                if (value.authorId == search || value.category == search) {
                    return true;
                }
                if (
                    value.tags.includes(search) ||
                    value.subcategory.includes(search)
                ) {
                    return true;
                }
                return false;
            });
            return res.status(200).send({ status: true, data: data });
        } else {
            return res
                .status(404)
                .send({ status: false, msg: "blog not found" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ status: false, msg: err.massage });
    }
};

const putBolgId = async function (req, res) {
    try {
        const data = req.body;
        const id = req.params.blogId;
        if (!objectId.isValid(id)) {
            res.status(404).send({
                status: false,
                message: "please fill valid blog id",
            });
        }
        const blogData = await blogModules.findOne({ _id: id });
        if (!blogData) {
            return res.status(404).send({
                status: false,
                message: "not available data of this id",
            });
        }
        if (blogData.isDeleted === true) {
            return res
                .status(404)
                .send({ status: false, message: "this blog already deleted" });
        }
        if (blogData.isDeleted === false) {
            let blog = await blogModules.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        title: data.title,
                        body: data.body,
                        category: data.category,
                        publishedAt: Date.now(),
                        isPublished: true,
                    },
                    $push: { tags: data.tags, subcategory: data.subcategory },
                },
                { new: true, upsert: true }
            );
            return res.status(200).send({ status: true, data: blog });
        }
    } catch (erro) {
        console.log(erro);
        return res.status(500).send({ status: true, message: erro.message });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const blogid = req.params.blogId;
        if (!objectId.isValid(blogid)) {
            return res.status(404).send({
                status: true,
                message: "this is not validator.validate",
            });
        }
        const blogData = await blogModules.findOne({ _id: blogid });
        if (!blogData) {
            return res
                .status(404)
                .send({ status: true, message: "this is not exist" });
        }
        if (blogData.isDeleted === true) {
            return res
                .status(404)
                .send({ status: true, message: "this blog allready deleted" });
        } else {
            const data = await blogModules.findOneAndUpdate(
                {
                    _id: blogData,
                    $set: { isDeleted: true, deletedAt: Date.now() },
                },
                { new: true }
            );
            return res.status(200).send({ status: true, data: data });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ status: false, message: err.message });
    }
};

const deletedByQueryParam = async function (req, res) {
    try {
        let filterData = { isDeleted: false, isPublished: true };
        let { category, authorId, tags, subcategory } = req.query;
        if (!objectId.isValid(authorId)) {
            return res
                .status(404)
                .send({ status: false, message: "authorid is not valid" });
        } else {
            filterData._id = authorId;
        }
        if (category) {
            filterData.category = category;
        }
        if (subcategory) {
            filterData.subcategory.push(subcategory);
        }
        if (tags) {
            filterData.tags.push(tags);
        }
        let blogData = await blogModules.findOne(filterData);
        if (!blogData) {
            return res
                .status(404)
                .send({ status: false, message: "no record found" });
        }
        let updateBlogData = await blogModules.updateOne(
            filterData,
            { isDeleted: true, deletedAt: Date.now() },
            { new: true }
        );
        return res
            .status(200)
            .send({ status: true, message: "blog deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ status: false, message: err.message });
    }
};

module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog;
module.exports.putBolgId = putBolgId;
module.exports.deleteBlog = deleteBlog;
module.exports.deletedByQueryParam = deletedByQueryParam;
