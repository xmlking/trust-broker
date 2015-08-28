import Router from 'koa-router'
import jwt from 'koa-jwt';

import Util from '../utils/Util'
import User from '../models/User'
import ErrorHandler from  '../utils/ErrorHandler';
import {AuthorizationError} from "../utils/errors"
import {route} from '../utils/koa-router-decorators';
import config from 'config';

const secret = config.get('jwt.publicKey');
const { audience, issuer } = config.get('jwt.options');

//noinspection ES6Validation
@route('/users')
export default class UserController {

  router:Router;

  constructor() {

    this.router.use(
      jwt({secret, audience, issuer}),
      function *(next) {
        //console.log(this.state.user);
        if (!this.state.user.roles.includes('admin')) {
          throw new AuthorizationError(AuthorizationError.code.FORBIDDEN, { message: 'you are not authorized for this API'});
        }
      yield next;
    });

    this.router
      .get('/', UserController.index)
      .get('/:id', UserController.findById, UserController.get)
      .post('/', UserController.create)
      .put('/:id', UserController.findById, UserController.update)
      .delete('/:id', UserController.findById, UserController.delete);
    return this.router.routes();
  }

  static *findById(next) {
    this.user = yield User.findById(this.params.id);
    if (!this.user) this.throw('User not found', 404);
    yield next;
  }

  //noinspection ES6Validation
  @route('/', 'GET')
  static *index(next) {
    let query = User.find().skip(0).limit(20);
    let users = yield query.exec();
    let count = yield User.count(); //query.count()
    this.body = {users, count};
  }

  static *get() {
    this.body = this.user;
  }

  static *create(next) {
    let newUser =  new User(this.request.body);
    let result;
    try {
      result = yield newUser.save();
    } catch (err) {
      this.throw( JSON.stringify(ErrorHandler.extractMongoErrors(err)), 500);
    }

    this.status = 201;
    this.body = result
  }

  static *update(next) {
    for (let [key,value] of Util.objectEntries(this.request.body)) {
      this.user.set(key, value);
    }
    let result;
    try {
      result = yield this.user.save();
    } catch (err) {
      this.throw( JSON.stringify(ErrorHandler.extractMongoErrors(err)), 500);
    }
    this.body = result
  }

  static *delete(next) {
    let result;
    try {
      result = yield this.user.remove();
    } catch (err) {
      this.throw( JSON.stringify(ErrorHandler.extractMongoErrors(err)), 500);
    }
    this.body = result
  }

}

