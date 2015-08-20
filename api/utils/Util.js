export default class Util {

  static objectEntries(obj) {
    let index = 0;
    let propKeys = Reflect.ownKeys(obj);

    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        if (index < propKeys.length) {
          let key = propKeys[index];
          index++;
          return { value: [key, obj[key]] };
        } else {
          return { done: true };
        }
      }
    };
  }
}
