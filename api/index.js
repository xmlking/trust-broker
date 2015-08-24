import fs from 'fs';
import https from 'https';

import koa from 'koa';
import Router from 'koa-router';
import bodyParser from'koa-bodyparser';
import mongoose from  'mongoose';

import config from 'config';
import ErrorHandler from  './utils/ErrorHandler';
import UserController from  './controllers/UserController';
import AuthController from  './controllers/AuthController';


const { uri, options } = config.get('mongo');

export default class AuthServer {

  constructor() {

    this.rootRouter = new Router({
      prefix: '/api'
    });

    mongoose.connect(uri, options);
    require('./utils/seed');

    this.server = koa();
    this.server.use(ErrorHandler.catchAll);
    this.server.use(bodyParser());

    this.server.use(new AuthController());
    this.rootRouter.use('/v1', new UserController());

    this.server
      .use(this.rootRouter.routes())
      .use(this.rootRouter.allowedMethods());
    //console.log(this.rootRouter.routes());
    https.createServer(config.get('server.ssl.options'), this.server.callback()).listen(config.get('server.options'));

  }

  close() {
    return Promise.resolve(mongoose.disconnect());
  }

}

