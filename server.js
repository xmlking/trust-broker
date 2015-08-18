import fs from 'fs';
import AuthServer from './app/index';

import {CONFIG, config} from './app/utils/globals';

//const USER_HOME = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
const USER_HOME = process.env.HOME || process.env.USERPROFILE;

CONFIG.secret.publicKey =  fs.readFileSync(config('secret').publicKeyPath || USER_HOME +'/.ssh/auth.rsa.pub');
CONFIG.secret.privateKey = fs.readFileSync(config('secret').privateKeyPath || USER_HOME +'/.ssh/auth.rsa');

let serve = new AuthServer(process.env.PORT || config('server').port);

process.on('SIGTERM', function () {
  serve.close().then(() => {
    process.exit(0);
  });
});

process.on('SIGINT', function () {
  serve.close().then(() => {
    process.exit(0);
  });
});
