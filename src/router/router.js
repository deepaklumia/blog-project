const express = require('express');
const router = express.Router();
const authorModule = require('../collection/authorCollection')
const blogModule = require('../collection/blogCollection');
router.get('/', function (req, res){
      res.send('server is running on port 3000');
})
router.post('/create-authors', authorModule.createAuthor);
router.post('/create-blogs', blogModule.createBlog);
router.get('/get-blogs', blogModule.getBlog);
router.put('/update-blog', blogModule.putBolgId);
router.get('/delete-blogs', blogModule.deleteBlog);
router.delete('/deletedBy-QueryParam', blogModule.deletedByQueryParam);
router.post('/login', authorModule.logIn);

module.exports = router;