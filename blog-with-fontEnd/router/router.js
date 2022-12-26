const express = require('express');
const router = express.Router();
const _ = require('lodash');
const BlogData =  require('../module/module');

const homeContent = `Microsoft Stories is also a prime example of how a business blog can be a major asset for an overall rebrand. In recent years, Microsoft has worked to humanize its brand, largely in response to a rivalry with Apple. The "Stories" microsite has a simple tagline — "Get an inside look at the people, places and ideas that move us." It's the softer side of Microsoft, so to speak.`

const aboutContent = `A blog (a truncation of "weblog") is a discussion or informational website published on the World Wide Web consisting of discrete, often informal diary-style text entries (posts). Posts are typically displayed in reverse chronological order so that the most recent post appears first, at the top of the web page`

const contactContent = `On some blog-hosting sites, such as Blogger, each writer has their own profile page, separate from their blog. You could try going onto their profile and checking for an email address, or an account on another site. Search for it in a sidebar from their blog, or do a Google search including their name and that of the blog hosting site.`

let posts;

router.get('/', async function (req, res) {
    posts = await BlogData.find();
    res.render('home', { content: homeContent, blogPost: posts });
});

router.get('/about', async function (req, res) {
    res.render('about', { content: aboutContent })
});

router.get('/contact', async function (req, res) {
    res.render('contact', { content: contactContent })
});

router.get('/compose', async function (req, res) {

    res.render('compose');
});
router.post('/compose', async function (req, res) {
   
    let title = req.body.title;
    let content = req.body.content;
    let blogPost = {
        title: title,
        content: content
    }
    await BlogData.create(blogPost);

    res.redirect('/');
});

router.get('/post/:title', function (req, res) {
   
    posts.filter((post) => {
        let postTitle = _.lowerCase(post.title);

        if(postTitle===_.lowerCase(req.params.title)){
           return res.render('post', {blogPost: post});
        }
    });

});
module.exports = router;