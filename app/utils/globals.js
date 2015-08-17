export const CONFIG = require('js-yaml').safeLoad(require('fs').readFileSync('config.yml', 'utf8'));

// Get environment, for environment-specific activities
global.env  = process.env.NODE_ENV || 'PROD';
global.optimize = (env === 'PROD');
console.log('Using Env:', env);
console.log('Optimized:', optimize);

export function config(type) {
  if(CONFIG[type]) {
    let typeConfig = CONFIG[type];
    let mergedConfig = Object.assign({}, typeConfig, typeConfig[optimize ? 'release' : 'debug']);
    delete mergedConfig.release;
    delete mergedConfig.debug;
    return mergedConfig;
  } else {
    return {};
  }
}
