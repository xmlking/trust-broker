import Router from 'koa-router'
import jwt from 'koa-jwt';
import {route, HttpMethod} from 'koa-router-decorators';

import Util from '../utils/Util'
import User from '../models/User'
import AuthZ from '../middleware/AuthZ'
import {NotFoundError, AuthorizationError, MongoError} from "../utils/errors"
import config from 'config';

const secret = config.get('jwt.publicKey');
const { audience, issuer } = config.get('jwt.options');

@route('/users')
export default class UserController {

  router:Router;

  constructor() {

    this.router.use(
      // add middleware
      jwt({secret, audience, issuer}),
      AuthZ.isAdmin
    );

    this.router
      .get('/:id', UserController.findById, UserController.get)
      .put('/:id', UserController.findById, UserController.update)
      .delete('/:id', UserController.findById, UserController.delete);

    return this.router.routes();
  }

  static *findById(next) {
    this.user = yield User.findById(this.params.id);
    if (!this.user) throw new NotFoundError(NotFoundError.code.ENTITY_NOT_FOUND, { message: 'User not found'});
    yield next;
  }

  @route('/', HttpMethod.GET)
  static *index(next) {
    let query = User.find().skip(0).limit(20);
    let users = yield query.exec();
    let count = yield User.count(); //query.count()
    this.body = {users, count};
  }

  static *get() {
    this.body = this.user;
  }

  @route('/', HttpMethod.POST)
  static *create(next) {
    let newUser =  new User(this.request.body);
    let result;
    try {
      result = yield newUser.save();
    } catch (err) {
      throw new MongoError(err);
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
      throw new MongoError(err);
    }
    this.body = result
  }

  static *delete(next) {
    let result;
    try {
      result = yield this.user.remove();
    } catch (err) {
      throw new MongoError(err);
    }
    //this.status = 204;
    this.body = result
  }

}

