import koa from 'koa';
import Router from 'koa-router';
import bodyParser from'koa-bodyparser';
import  mongoose from  'mongoose';
import jwt from 'koa-jwt';

import {CONFIG, config} from './utils/globals';
import ErrorHandler from  './utils/ErrorHandler';
import  UserController from  './controllers/UserController';
import  AuthController from  './controllers/AuthController';

export default class AuthServer {

  constructor(port = 8080) {

    this.rootRouter = new Router({
      prefix: '/api'
    });

    mongoose.connect('localhost/authDB');

    console.log(`Starting up new API Server on port: ${port}`);
    this.server = koa();
    this.server.use(ErrorHandler.catchAll);
    this.server.use(bodyParser());
    this.server.use(new AuthController());

     //Everything behind this will be protected.
    this.server.use(jwt({ secret: CONFIG.secret.publicKey
                          , audience: config('jwt').audience
                          , issuer: config('jwt').issuer
                        }));
    this.rootRouter.use('/v1', new UserController());
    this.server
      .use(this.rootRouter.routes())
      .use(this.rootRouter.allowedMethods());
    //console.log(this.rootRouter.routes());
    this.server.listen(port);

  }

  close() {
    return Promise.resolve(mongoose.disconnect());
  }

}
