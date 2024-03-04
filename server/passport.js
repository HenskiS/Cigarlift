const passport = require('passport');
require('dotenv').config()
const GoogleStrategy = require('passport-google-oauth20').Strategy

//const GOOGLE_CLIENT_ID = "347876148421-e4rlgg04urjnv0gkj8q7jhsq9q22cb9d.apps.googleusercontent.com"
//const GOOGLE_CLIENT_SECRET = "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"

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            /*User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
            });*/
            /*const user = {
                username: profile.displayName,
                avatar: profile.photos[0],
            }
            createnewusermodel*/
            done(null, profile)
        }
));

passport.serializeUser((user, done)=>{
    done(null,user)
})
passport.deserializeUser((user, done)=>{
    done(null,user)
})