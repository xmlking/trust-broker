// @route("/ex/foos/{id}")
// @route({path: "/ex/foos", method: "GET", roles: ['admin']})
// @route({path: "/ex/foos", method: "GET", headers: "Accept=application/json"})
import Router from 'koa-router'


export function route(path, method, roles) {
  return (target,key,descriptor)  => {
    // apply only for constructor
    if(!key && path) {
      target.prototype.router = new Router({
        prefix: path
      });

      // TODO : use Decorator's Metadata Reflection API
      //target.prototype.router
      //  .get('/', target.index)
    }

  }
}
