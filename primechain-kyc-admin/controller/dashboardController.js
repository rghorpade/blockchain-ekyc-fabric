const loginModel = require("../model/login");
const whiteListModel = require('../model/whitelist');
const formModel = require('../model/form');
const notificationEngine = require('../sendgrid/notification_grid');

module.exports = {

    get_dashbaord_page: (req, res, next) => {
        try {
            res.render('dashboard');
            // let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            // ip_arr = ip.split(':');
            // ip = ip_arr[ip_arr.length - 1];

            // let browser = req.headers["user-agent"];

            // let newLogin = new loginModel({
            //     email: req.user.email,
            //     ip: ip,
            //     browser: browser
            // });

            // loginModel.recordLoginInDB(newLogin, (err, is_logged) => {
            //     if (err) { return next(err); }

            //     notificationEngine.sendLoginNotification(req.user.username, req.user.email, ip, browser, (err, email_sent) => {
            //         if (err) { return next(err); }
            //         res.redirect('/user/dashboard');
            //     });
            // });
        }
        catch (e) {
            res.render('dashboard');
        }
    }
}