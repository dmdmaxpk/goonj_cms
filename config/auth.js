const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const axios = require('axios');
const config = require('./config');


// passport local strategy for local-login
passport.use('local-login',
    new LocalStrategy({
            usernameField: 'email', //Setting username as msisdn
            passwordField: 'password', //Setting pass as PIN
        },
        async function (email, password, done) {

            const result = await axios.get(`${config.api.url}/curator?email=${email}`);
            const user = result.data;

            if (userData.msisdn == msisdn && verification.status == true) {
                return done(null, userData);
            } else {
                return done(null, false, {
                    "message": "User not found."
                });
            }
            
        }
    )
);

// Required for storing user info into session 
passport.serializeUser(function (user, done) {
    console.log("Serializing User");
    done(null, user._id);
});

// Required for retrieving user from session
passport.deserializeUser(async function (id, done) {
    console.log("Deserializing User");
    const result = await axios.get(`${config.api.url}/curator?_id=${id}`)
    var userData = result.data;
    //IF we want to send the packages details then we can do it here:
    done(null, userData);
});

module.exports = passport;