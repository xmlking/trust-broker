import koa from 'koa';
import Router from 'koa-router';
import bodyParser from'koa-bodyparser';
import  Mongorito from  'mongorito';
import jwt from 'koa-jwt';

import ErrorHandler from  './utils/ErrorHandler';
import  UserController from  './controllers/UserController';
import  AuthController from  './controllers/AuthController';


const SHARED_SECRET = 'shared-secret';
const ALGORITHM = 'RS256';

export default class OauthServer {

  constructor(port = 8080, publicKey = SHARED_SECRET, privateKey = SHARED_SECRET) {

    this.rootRouter = new Router({
      prefix: '/api'
    });

    Mongorito.connect('localhost/mydb');

    console.log(`Starting up new API Server on port: ${port}`);
    this.server = koa();
    this.server.use(ErrorHandler.catchAll);
    this.server.use(bodyParser());
    this.server.use(new AuthController(privateKey));

    // Everything behind this will be protected.
    this.server.use(jwt({ secret: publicKey, algorithm: ALGORITHM}));
    this.rootRouter.use('/v1', new UserController());
    this.server
      .use(this.rootRouter.routes())
      .use(this.rootRouter.allowedMethods());
    //console.log(this.rootRouter.routes());
    this.server.listen(port);

  }

  close() {
    return Promise.resolve(Mongorito.disconnect());
  }

}

