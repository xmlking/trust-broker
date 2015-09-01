import Router from 'koa-router'
import jwt from 'koa-jwt';
import passport from 'koa-passport';
import {route, HttpMethod} from 'koa-router-decorators';
import config from 'config';

import User from '../models/User';
import {NotFoundError, NotImplementedError, AuthorizationError} from "../utils/errors"

@route('/auth')
export default class AuthController {

  router:Router;

  constructor() {

    this.router
      .post('/login', AuthController.localAuth, AuthController.signToken)
      .get('/facebook/callback',AuthController.facebookAuthCallback, AuthController.signToken)
      .get('/google/callback',AuthController.googleAuthCallback, AuthController.signToken)
      .get('/forgot_password/:username', AuthController.findByUsername, AuthController.forgotPassword);

    return this.router.routes();
  }

  static *localAuth(next) {
    var ctx = this;

    yield passport.authenticate('local', {session: false}, function*(err, user, info) {
        if (err) throw err;
        //NOTE: user was a generator.
        user = yield user;
        ctx.user = user; //FIXME: without this line, `user` is not set to `this` context
        yield ctx.login(user,{session: false})
      }
    ).call(this, next);

    yield next;
  }

  @route('/facebook', HttpMethod.GET)
  static *facebookAuth(next) {
    yield passport.authenticate('facebook', {scope: ['email']}).call(this, next);
  }

  static *facebookAuthCallback(next) {
    var ctx = this;

    yield passport.authenticate('facebook',{session: false}, function*(err, user, info) {
      if (err) throw err;
      user = yield user;
      ctx.user = user; //FIXME: without this line, `user` is not set to `this` context
      yield ctx.login(user,{session: false})
    }).call(this, next);

    yield next;
  }

  @route('/google', HttpMethod.GET)
  static *googleAuth(next) {
    yield passport.authenticate('google-openidconnect', {scope: ['email', 'profile']}).call(this, next);
  }

  static *googleAuthCallback(next) {
    var ctx = this;

    yield passport.authenticate('google-openidconnect',{session: false}, function*(err, user, info) {
      if (err) throw err;
      user = yield user;
      ctx.user = user; //FIXME: without this line, `user` is not set to `this` context
      yield ctx.login(user,{session: false})
    }).call(this, next);

    yield next;
  }

  static *signToken(next) {
    console.log('in signToken isAuthenticated, user',this.isAuthenticated() , this.user);
    let token = jwt.sign( {
        name: this.user.name,
        sub: this.user.email,
        roles: this.user.roles
      },
      config.get('jwt.privateKey'),
      config.get('jwt.options')
    );
    this.status = 200;
    this.body = {token};
  }

  //Force token expire?
  @route('/logout', HttpMethod.GET)
  static *logout(next) {
    this.logout();
    this.body = {
      success: true
    };
  }

  static *findByUsername(next) {
    this.user = yield User.byUsername(this.params.username);
    if (!this.user) throw new NotFoundError(NotFoundError.code.ENTITY_NOT_FOUND, { message: 'User not found'});
    yield next;
  }

  static *forgotPassword(next) {
    throw new NotImplementedError(0, { message: 'forgot password not implemented yet'});
    //this.body = this.user;
  }

}
