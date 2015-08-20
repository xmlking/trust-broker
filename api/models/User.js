import {model, index, pre, post} from 'mongoose-decorators';
import co from 'co';
import Bcrypt from "../utils/Bcrypt"
import {CONFIG, config} from '../utils/globals';

const SALT_WORK_FACTOR = config('bcrypt').saltWorkFactor || 10;

@model(
  {
    username: {type: String, required: '{PATH} field is required.', unique: true, lowercase: true},
    password: {
      type: String,
      validate: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, '{PATH} must be at least 8 characters long, with at least one lower case, at least one number and at least one uppercase letter.']
    },
    provider: {type: String},
    email: {
      type: String,
      required: '{PATH} field is required.',
      validate: [/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i, '{PATH} field is invalid.']
    },
    name: {type: String},
    role: {
      type: String,
      enum: {values: ['admin', 'user'], message: '{VALUE} is not valid {PATH}, should be one of [admin, user].'}
    },
    isClosed: {type: Boolean, default: false}
  },
  {
    toJSON: {
      transform: function (doc, ret, options) {
        delete ret.password;
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v
      }
    }
  }
)
export default class User {

  @pre('save')
  hashPassword(done) {
    var self = this;

    // Only hash the password if it has been modified (or is new)
    if (!this.password || this.password.length < 1 || !this.isModified("password")) {
      return done();
    }

    co(function*() {
      try {
        self.password = yield Bcrypt.hash(self.password, SALT_WORK_FACTOR);
        done();
      } catch (err) {
        done(err);
      }
    });

  }

  hasPassword() {
    return (this.password  && this.password.length > 0);
  }

  static *matchUser(username, password) {
    let user = yield this.findOne({'username': username.toLowerCase()}).exec();
    if (!user) throw new Error('User not found');

    if (yield user.comparePassword(password)) {
      return user;
    }

    throw new Error('Password does not match');
  }

  *comparePassword(candidatePassword) {
    // User password is not set yet
    if (!this.hasPassword()) {
      return false;
    }
    return yield Bcrypt.compare(candidatePassword, this.password);
  }

}

