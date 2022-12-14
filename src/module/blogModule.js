const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;
const blogModules = mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    authorId: { type: objectId, ref:"Author",required: true },
    tags: [{ type: String }] ,
    category: { type: String, required: true },
    subcategory: [{ type: String }],
    deletedAt: { type: String },
    isDeleted: { type: Boolean, default: false },
    publishedAt: { type: Date },
    isPublished: { type: Boolean, default: false }
},{timestamps:true});
module.exports = mongoose.model("blogs", blogModules);
