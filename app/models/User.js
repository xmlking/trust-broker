import  Mongorito from  'mongorito';

export default class User extends Mongorito.Model {

  configure() {
    this.before('save', 'validate');
    this.after('save', 'myHook');
    this.around('save', 'myHook');

    this.before('create', 'checkIfExists');
    this.after('create', 'myHook');
    this.around('create', 'myHook');

    this.before('update', 'myHook');
    this.after('update', 'myHook');
    this.around('update', 'myHook');
  }

  // Save hooks
  *myHook (next) {
    console.log('in hook');
    yield next;
  }

  *checkIfExists(next) {
    console.log('in checkIfExists hook');
    yield next;
  }

  *validate(next) {
    console.log('in validate hook');
    let isValid = true;
    if (!isValid) {
      throw new Error('Post title is missing');
    }
    yield next;
  }
}
