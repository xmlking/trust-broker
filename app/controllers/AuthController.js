import User from '../models/User'
import Router from 'koa-router'
import jwt from 'koa-jwt';

import {CONFIG, config} from '../utils/globals';

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
    let matchingUsers = yield User.and({username}, {password}).find();
    if (matchingUsers.length != 1) {
      this.throw('User not found', 404);
    }
    this.user = matchingUsers[0];
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
                            name: this.user.get('firstName') +' '+ this.user.get('lastName'),
                            sub: this.user.get('email'),
                            role: this.user.get('role')
                          },
                          CONFIG.secret.privateKey,
                          config('jwt')
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

