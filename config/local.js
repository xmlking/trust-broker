var fs = require('fs');
var defer = require('config/defer').deferConfig;

module.exports = {

  server: {
    ssl: {
      options: {
        key: defer(function (cfg) {
          return fs.readFileSync(cfg.server.ssl.files.key).toString()
        }),
        cert: defer(function (cfg) {
          return fs.readFileSync(cfg.server.ssl.files.cert).toString()
        }),
        ca: defer(function (cfg) {
          if (cfg.server.ssl.files.ca) {
            return fs.readFileSync(cfg.server.ssl.files.ca).toString()
          }
        })
      }
    }
  },

  jwt : {
    publicKey : defer(function (cfg) {
      return fs.readFileSync(cfg.jwt.publicKeyFile).toString()
    }),
    privateKey : defer(function (cfg) {
      return fs.readFileSync(cfg.jwt.privateKeyFile).toString()
    })
  }

};
