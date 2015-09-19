import fs from 'fs';
import https from 'https';

import koa from 'koa';
import Router from 'koa-router';
import bodyParser from'koa-bodyparser';
import mongoose from  'mongoose';

import config from 'config';
import  './utils/AuthenticateStrategies';
import passport from 'koa-passport';
import ErrorHandler from  './middleware/ErrorHandler';
import UserController from  './controllers/UserController';
import AuthController from  './controllers/AuthController';


const { uri, options } = config.get('mongo');

export default class AuthServer {

  constructor() {

    this.rootRouter = new Router({
      prefix: '/api'
    });

    mongoose.connect(uri, options);
    // comment this line to disable seed data
    require('./utils/seed');

    this.server = koa();
    this.server.experimental = true; // to support async / await
    this.server.use(ErrorHandler.catchAll);
    this.server.use(passport.initialize());
    this.server.use(bodyParser());

    this.server.use(new AuthController());
    this.rootRouter.use('/v1', new UserController());

    this.server
      .use(this.rootRouter.routes())
      .use(this.rootRouter.allowedMethods());
    // uncomment this line to debug routes or use `DEBUG=koa-router npm start`
    // console.log(this.rootRouter.stack);
    https.createServer(config.get('server.ssl.options'), this.server.callback()).listen(config.get('server.options'),
      () => {
        console.info(`Server started on https://${config.get('server.options.host')}:${config.get('server.options.port')}`);
      }
    );

  }

  close() {
    return Promise.resolve(mongoose.disconnect());
  }

}

