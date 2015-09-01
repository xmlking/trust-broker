import passport from 'koa-passport';
let LocalStrategy = require('passport-local').Strategy;
let FacebookStrategy = require('passport-facebook').Strategy;
let GoogleStrategy = require('passport-google-openidconnect').Strategy;

import User from '../models/User'
import config from 'config';

passport.use(new LocalStrategy({
    session: false
  },
  function(username, password, done) {
    try {
      //NOTE: user is a generator. need to yield
      let user = User.matchUser(username,password);
      done(null, user);
    } catch(err ) {
      done(err);
    }
  }
));

passport.use(new FacebookStrategy(
  config.get('passport.facebook'),
  function(token, tokenSecret, profile, done) {
    try {
      let user = User.findOrCreate(profile);
      done(null, user);
    }catch(err ) {
      done(err);
    }
  }
));


passport.use(new GoogleStrategy(
  config.get('passport.google'),
  function(iss, sub, profile, accessToken, refreshToken, done) {
    try {
      // FIXME: google-openidconnect plugin fix
      if(!profile.emails) {
        profile.emails = [{value: profile._json.email}]
      }
      if(!profile.provider) {
        profile.provider = 'google-openidconnect'
      }
      let user = User.findOrCreate(profile);
      done(null, user);
    }catch(err ) {
      done(err);
    }
  }
));
