const mongoose = require('mongoose');
const BlogModule = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        require:true
    }
},{timestamps:true});


module.exports = mongoose.model('Blog',BlogModule);