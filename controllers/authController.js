const passport = require('passport');
// var auth = require('./auth');


//OLD-------------CHECK AGAIN IF THIS CAN WORk-------------------------
// exports.login = passport.authenticate('local-login', function(err, user, info) {
//     if (err) { return next(err); }

//     if (!user) { return res.redirect('/login'); }

//     else
// 		res.send('aaa');

//     // req.logIn(user, function(err) {
//     //   if (err) { return next(err); }
//     //   return res.redirect('/users/' + user.username);
//     // });
//   })(req, res, next);

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
}

exports.isLoggedIn =  (req, res, next) => {
    if (req.isAuthenticated()) {
		next();
		return;
	}
    res.redirect('/');
}

exports.redirectOnLoggedIn =  (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard');
        return;
    }
    next();
}

exports.authenticate = passport.authenticate("local-login");