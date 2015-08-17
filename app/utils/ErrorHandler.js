export default class ErrorHandler {

  static *catchAll(next) {
    try {
      yield next;
    } catch (err) {
      this.status = err.status || 500;
      this.body = err.message;
      this.app.emit('error', err, this);
    }
  }

  static *catch401(next) {
    try {
      yield next; //Attempt to go through the JWT Validator
    } catch (err) {
      if (err.status == 401) {
        // Prepare response to user.
        this.status = err.status;
        this.body = 'You don\'t have a signed token dude :('
      } else {
        throw e; // Pass the error to the next handler since it wasn't a JWT error.
      }
    }
  }

}
