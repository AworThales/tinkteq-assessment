const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser') 
const fileUpload = require('express-fileupload')
const dotenv = require("dotenv");
const app = express();


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(fileUpload())

//Config file setting
dotenv.config()

if(process.env.NODE_ENV !== 'PRODUCTION'){
    dotenv.config({path: 'backend/config/config.env'});
}

const auth = require("./routes/auth");
const errorsMiddleware = require("./middlewares/errors");



app.use('/api/v1/', auth);


if(process.env.NODE_ENV === 'PRODUCTION') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
    })
}


// Middleware errors handler
app.use(errorsMiddleware);




module.exports = app;