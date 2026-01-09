const GoogleStrategy = require('passport-google-oauth20');
const GitHubStrategy = require('passport-github2').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User')

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        }
        try {
        let user = await User.findOne({googleId: profile.id })
        if (user) {
            done (null, user)
        } else {
            user = await User.create(newUser)
            done (null, user)
        }
        } catch (err) {
          console.error(err)
        }
    }))

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/auth/github/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        const newUser = {
            githubId: profile.id,
            displayName: profile.displayName || profile.username,
            firstName: profile.name ? profile.name.split(' ')[0] : profile.username,
            lastName: profile.name ? profile.name.split(' ').slice(1).join(' ') : '',
            image: profile.photos && profile.photos[0] ? profile.photos[0].value : profile.avatar_url
        }
        try {
        let user = await User.findOne({githubId: profile.id })
        if (user) {
            done (null, user)
        } else {
            user = await User.create(newUser)
            done (null, user)
        }
        } catch (err) {
          console.error(err)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id);
      });

      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
      });
}