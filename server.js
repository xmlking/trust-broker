import OauthServer from './app/index';
import fs from 'fs';

//const USER_HOME = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
const USER_HOME = process.env.HOME || process.env.USERPROFILE;

let publicKey =  fs.readFileSync(USER_HOME +'/.ssh/oauth.rsa.pub');
let privateKey = fs.readFileSync(USER_HOME +'/.ssh/oauth.rsa');

let serve = new OauthServer(process.env.PORT, publicKey, privateKey);

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
