import Router from 'koa-router'
import jwt from 'koa-jwt';
import passport from 'koa-passport';
import config from 'config';

import User from '../models/User';

export default class AuthController {

  router:Router;

  constructor() {
    this.router = new Router({
      prefix: '/auth'
    });

    this.router
      .post('/login', AuthController.localAuth, AuthController.signToken)
      .get('/facebook',AuthController.facebookAuth)
      .get('/facebook/callback',AuthController.facebookAuthCallback, AuthController.signToken)
      .get('/google',AuthController.googleAuth)
      .get('/google/callback',AuthController.googleAuthCallback, AuthController.signToken)
      .get('/logout', AuthController.logout)
      .get('/:id', AuthController.findById, AuthController.user);
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
    this.body = token;
  }

  //Force token expire?
  static *logout(next) {
    this.logout();
    this.body = {
      success: true
    };
  }

  static *findById(next) {
    this.user = yield User.findById(this.params.id);
    if (!this.user) this.throw('User not found', 404);
    yield next;
  }

  static *user(next) {
    this.body = this.user;
  }

}
