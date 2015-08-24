import User from '../models/User'
import Router from 'koa-router'
import jwt from 'koa-jwt';
import config from 'config';

export default class AuthController {

  router:Router;

  constructor() {
    this.router = new Router({
      prefix: '/auth'
    });

    this.router
      .post('/login', AuthController.findUser, AuthController.signToken)
      .get('/logout', AuthController.logout)
      .get('/:id', AuthController.findById, AuthController.user);
    return this.router.routes();
  }

  static *findUser(next) {
    let username = this.request.body.username;
    let password = this.request.body.password;
    this.user = yield User.matchUser(username,password);
    yield next;
  }

  static *findById(next) {
    this.user = yield User.findById(this.params.id);
    if (!this.user) this.throw('User not found', 404);
    yield next;
  }

  static *user(next) {
    this.body = this.user;
  }

  static *signToken(next) {
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

  static *logout(next) {
    this.body = {
      success: true
    };
  }

}
