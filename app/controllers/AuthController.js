import User from '../models/User'
import Router from 'koa-router'
import jwt from 'koa-jwt';

export default class AuthController {

  router:Router;

  constructor(privateKey) {
    this.router = new Router({
      prefix: '/auth'
    });

    this.router
      .post('/login', AuthController.findUser, function *(next) {
        var token = jwt.sign(this.user, privateKey, {algorithm: 'RS256'});
        this.status = 200;
        this.body = {token: token};
      })
      .get('/logout', AuthController.logout)
      .get('/:id', AuthController.findById, AuthController.user);
    return this.router.routes();
  }

  static *findUser(next) {
    let username = this.request.body.username;
    let password = this.request.body.password;
    let matchingUsers = yield User.and({username} ,{password}).find();
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

  static *login(next) {
    this.user = [
      { username: 'dgrove'
        , jwt: 'dkaflkjakldjfd;lkajfd;klajf'
      }
    ]
  }

  static *logout(next) {
    this.body = {
      success: true
    };
  }

}

