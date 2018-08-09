// Importing Libraires form node_modules.
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const fileUpload = require('express-fileupload');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const notificationConfig = require("./configs/notification_config");

// Built-in Promises. Mongoose async operations, like .save() and queries, return ES6 promises.
mongoose.Promise = global.Promise;
// Connecting to monogo database.
mongoose.connect('mongodb://localhost:27017/primechainkycmember', { useNewUrlParser: true }, (err, is_connected) => {
    if (err) {
        console.log("Unable to establish connection to the database.");
    }
    else if (is_connected) {
        console.log("Connected to database");
    }
    else {
        console.log("Unable to establish connection with the database.");
    }
});

// Include Routes
const routes = require('./routes/index');
const users = require('./routes/user');

// Initialize App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');

// BodyParser is the middleware, Parse incoming request bodies in a middleware before your handlers.
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'ssssshhhhh',
    resave: false,
    saveUninitialized: false
}));

// Passport Intialize, passport is the middleware software we can used for checking login credentials.
app.use(passport.initialize());
app.use(passport.session());

// Express Validator, for validating the input fields.
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam == '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Connect Flash is used for flashing messages.
app.use(flash());

// Global Variables, we can use across the application.
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Declaring routes for urls.
app.use('/', routes);
app.use('/user', users);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error("Page not found");
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        status: err.status || err.code,
        error: {}
    });
});

// Setting the port number 
app.set('port', process.env.PORT || 2309);

// listen to the port number
app.listen(app.get('port'), (err, result) => {
 console.log('Server up on port ' + app.get('port')); 
});