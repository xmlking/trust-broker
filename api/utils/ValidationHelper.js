import  mongoose from  'mongoose';
var ValidationError = mongoose.Error.ValidationError;
var ValidatorError  = mongoose.Error.ValidatorError;

export const Validations = {
  general : {
    required: '{PATH} field is required.',
    invalid: '{PATH} field is invalid.'
  },
  password: {
    required : '{PATH} field is required.',
    pattern : [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      '{PATH} must be at least 8 characters long, with at least one lower case, at least one number and at least one uppercase letter.'
    ]
  },
  email: {
    required : '{PATH} field is required.',
    pattern : [
      /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
      '{PATH} field is invalid.'
    ]
  },
  role: {
    invalid: '{VALUE} is not valid {PATH}, should be one of [admin, user].'
  }
};

export class ValidationHelper {

  static nameValidator() {
    if (/someregex/i.test(this.name)) {
      let error = new ValidationError(this);
      error.errors.name = new ValidatorError('name', 'Name is not valid', 'notvalid', this.name);
      throw error;
    }
  }

}

