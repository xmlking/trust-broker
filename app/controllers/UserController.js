import User from '../models/User'
import Router from 'koa-router'
import Util from '../utils/Util'

export default class UserController {

  router:Router;

  constructor() {
    this.router = new Router({
      prefix: '/users'
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

  static *index(next) {
    let users = yield User.limit(20).skip(0).find();
    let count = yield User.count();
    this.body = {users, count};
  }

  static *get() {
    console.log('requesting user', this.state.user);
    this.body = this.user;
  }

  static *create(next) {
    let newUser =  new User(this.request.body);
    let result;
    try {
      result = yield newUser.save();
    } catch (err) {
      this.throw('Unable to create User', 500);
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
    } catch (e) {
      this.throw('Unable to update User', 500);
    }
    this.body = result
  }

  static *delete(next) {
    let result;
    try {
      result = yield this.user.remove();
    } catch (e) {
      this.throw('Unable to delete User', 500);
    }
    this.body = result
  }

}

