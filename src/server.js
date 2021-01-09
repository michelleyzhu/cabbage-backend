// import express from "express"
// import bodyParser from "body-parser"
//import {MongoClient} from "mongodb"
import path from "path"

let express = require('express'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    dbConfig = require('./database/db');

const api = require('./routes/user.routes')


// MongoDB Configuration
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://cabbageDb:peachDb@cluster0.b6n76.mongodb.net/<dbname>?retryWrites=true&w=majority", {
    useNewUrlParser: true, useUnifiedTopology:true
}).then(() => {
    console.log('Database sucessfully connected')
},
    error => {
        console.log('Database could not be connected: ' + error)
    }
)

const app = express();
app.use(express.static(path.join(__dirname, "/build")))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());

app.use('/public', express.static('public'));

app.use('/api', api)

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port)
})
/*
app.use(express.urlencoded({ extended: true }));
initRoutes(app)

// view engine setup
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose")
mongoose.Promise = require("bluebird")
const ImageRouter = require("./Image")

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use('./uploads', express.static('uploads'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/image', ImageRouter);
*/
app.use((req, res, next) => {
    // Error goes via `next()` method
    setImmediate(() => {
        next(new Error('Something went wrong'));
    });
});

app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});

app.get("*", (req, res) => {
    rest.sendFile(path.join(__dirname + "/build/index.html"))
})