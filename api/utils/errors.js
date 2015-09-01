class ExtendableError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.stack = (new Error()).stack;
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends ExtendableError {
  static code = {
    ENTITY_NOT_FOUND: 0
  };
  constructor(code, error) {

    super(error.message);
    this.code = typeof code === "undefined" ? 0 : code;
    this.status = 404;
    this.inner = error;
  }
}

export class AuthenticationError extends ExtendableError {
  static code = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
  };
  constructor(code, error) {
    super(error.message);
    this.code = code;
    this.status = 401;
    this.inner = error;
  }
}

export class AuthorizationError extends ExtendableError {
  static code = {
    FORBIDDEN: 0,
  };
  constructor(code, error) {
    super(error.message);
    this.code = code;
    this.status = 403;
    this.inner = error;
  }
}

export class BadRequestError extends ExtendableError {
  constructor(code, error) {
    super(error.message);
    this.code = code;
    this.status = 400;
    this.inner = error;
  }
}


export class NotImplementedError extends ExtendableError {
  constructor(code, error) {
    super(error.message);
    this.code = code;
    this.status = 501;
    this.inner = error;
  }
}



export class MongoError extends BadRequestError {
  constructor(error) {
    super(error.code, error);
    this.message = normalizeMongoErrors(error);
  }
}

function normalizeMongoErrors(err) {
  let errors = [];
  if (err.name == 'ValidationError') {
    for (let field in err.errors) {
      let message = err.errors[field].message;
      errors.push({field,  message});
    }
  } else if(11000 === err.code || 11001 === err.code){
    errors.push({global:'UniqueConstraintError', message:'Username/Email must be unique'});
  } else {
    errors.push({global:err.name, message:err.message});
  }
  return errors;
}
