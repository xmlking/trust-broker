import fs from 'fs';
import AuthServer from './api/index';

import {CONFIG, config} from './api/utils/globals';

//const USER_HOME = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
const USER_HOME = process.env.HOME || process.env.USERPROFILE;

CONFIG.secret.publicKey =  fs.readFileSync(config('secret').publicKeyFile || USER_HOME +'/.ssh/auth.rsa.pub');
CONFIG.secret.privateKey = fs.readFileSync(config('secret').privateKeyFile || USER_HOME +'/.ssh/auth.rsa');

CONFIG.server.ssl.key =  fs.readFileSync(config('server').ssl.keyFile || USER_HOME +'/.ssh/server.pem');
CONFIG.server.ssl.cert = fs.readFileSync(config('server').ssl.certFile || USER_HOME +'/.ssh/server.crt');
//CONFIG.server.ssl.ca = fs.readFileSync(config('server').ssl.caFile || USER_HOME +'/.ssh/ca.crt');

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
