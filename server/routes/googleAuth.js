const express = require('express');
const app = express();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const mongoose = require('mongoose');
const { userSchema } = require('../model/user');
const User = mongoose.model('user', userSchema);
const keys = require('../config/keys');

exports.googleAuth = app => {

    
    //pull out the user id from encypted cookie
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });


    // turn this user id to user
    passport.deserializeUser((id, done) => {
        User.findById(id).then(user => done(null, user));
    });



 // Google strategy auth

    passport.use(new GoogleStrategy(
            {
                clientID: keys.GoogleClientID,
                clientSecret: keys.GoogleClientSecret,
                callbackURL: '/auth/google/callback'
            },

            async (accessToken, refreshToken, profile, done) => {

               const existUser = await User.findOne({ googleId: profile.id });

                    if (existUser) { return done(null, existUser)}

                 let user = await new User({ googleId: profile.id }).save();
                                done(null, user);
                    
                    }
                ));
            
        
   

    //routes


    // authentication routes
    app.get(
        '/auth/google',
        passport.authenticate('google', { scope: ['profile', 'email'] })
    );

    app.get('/auth/google/callback', passport.authenticate('google'));

    //logout rout
    app.get('/api/logout',(req,res)=>{
        req.logout();
        res.send('You have logged out');
    })
    
    //user route after auth
    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });
};
