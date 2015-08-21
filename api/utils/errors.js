class ExtendableError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.stack = (new Error()).stack;
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends ExtendableError {
  constructor(code, error) {
    super(error.message);
    this.code = typeof code === "undefined" ? "404" : code;
    this.status = 404;
    this.inner = error;
  }
}

export class AuthenticationError extends ExtendableError {
  constructor(code, error) {
    super(error.message);
    this.code = code;
    this.status = 401;
    this.inner = error;
  }
}

export class AuthorizationError extends ExtendableError {
  constructor(code, error) {
    super(error.message);
    this.code = code;
    this.status = 403;
    this.inner = error;
  }
}


