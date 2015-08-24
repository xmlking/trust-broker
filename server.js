process.env.NODE_ENV = "development";

import AuthServer from './api/index';


let serve = new AuthServer();

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
