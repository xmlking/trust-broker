//@RequestMapping(value = "/ex/foos/{id}")
//@RequestMapping(value = "/ex/foos", method = GET, headers = "Accept=application/json")
import Router from 'koa-router'

export function requestMapping(path, method) {
  return (target)  => {
    target.path = path;
    target.method = method;
    console.log('in requestMapping path',path);
    console.log('in requestMapping method',method);
    console.log('in requestMapping target',target);
    console.log('in requestMapping target.constructor',target.index); //target.constructor.name
    console.log('in requestMapping instanceProps',Object.getOwnPropertyNames(target.prototype));
    console.log('in requestMapping staticProps',Object.getOwnPropertyNames(target));

    //let router = new Router({
    //  prefix: path
    //});
    //
    //router.get('/', target.index);
    //return  router.routes();
  }
}
