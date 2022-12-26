const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const router = require('./router/router');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.set('strictQuery', true);

const mongooseUrl =
    "mongodb+srv://deepak98:deepaklumia@book.4bu11tl.mongodb.net/All-Blog";

mongoose
    .connect(mongooseUrl, { useNewUrlParser: true })
    .then(() => {
        console.log("mongodb is  connected");
    })
    .catch((err) => {
        console.log(err);
    });

app.use('/', router);

app.listen(process.env.PORT || 3000, () => {
    console.log('listening on port ' + 3000);
});