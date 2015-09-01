import {model, index, pre, post} from 'mongoose-decorators';
import Bcrypt from "../utils/Bcrypt"
import {AuthenticationError} from "../utils/errors"
import {Validations} from "../utils/ValidationHelper"
import config from 'config';

/**
 * 1. store only hashed passwords
 * 2. A user's account should be "locked" after some number of consecutive failed login attempts.
 * 3. A user's account should become unlocked once a sufficient amount of time has passed
 * 4. The User model should expose the reason for a failed login attempt to the application
 */

const SALT_WORK_FACTOR = config.get('bcrypt.saltWorkFactor')
      , MAX_LOGIN_ATTEMPTS = config.get('login.maxLoginAttempts')
      , LOCK_TIME = config.get('login.lockTime');

//noinspection ES6Validation
@model(
  {
    username: {
      type: String,
      required: Validations.general.required,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      validate: Validations.password.pattern
    },
    provider: {
      type: String,
      required:true,
      enum: {values: ['local', 'google-openidconnect', 'facebook']}
    },
    email: {
      type: String,
      unique: true,
      required: Validations.email.required,
      validate: Validations.email.pattern
    },
    name: {type: String},
    //role: {
    //  type: String,
    //  enum: {values: ['admin', 'user'], default: 'user', message: Validations.role.invalid}
    //},
    roles: [{
      type: String,
      enum: {values: ['admin', 'user'], default: 'user', message: Validations.role.invalid}
    }],
    enabled: {type: Boolean, default: false},
    accountExpired:  {type: Boolean, default: false},
    passwordExpired:  {type: Boolean, default: false},

    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Number }
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

  //noinspection ES6Validation
  @pre('save')
  hashPassword(next) {
    // Only hash the password if it has been modified (or is new)
    if (this.password && (this.isModified('password') || this.isNew)) {
      (async () =>{
        try {
          this.password = await Bcrypt.hash(this.password, SALT_WORK_FACTOR);
          next();
        } catch (err) {
          next(err);
        }
      })();
    } else {
      return next();
    }
  }
  get isLocked() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
  }

  hasPassword() {
    return (this.password  && this.password.length > 0);
  }

  *incLoginAttempts() {
    // if we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
      yield this.update({
        $set: { loginAttempts: 1 },
        $unset: { lockUntil: 1 }
      });
    }
    // otherwise we're incrementing
    let updates = { $inc: { loginAttempts: 1 } };
    // lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
      updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }
    return yield this.update(updates);
  };

  // For LocalStrategy
  static *matchUser(username, password) {

    let user = yield this.findOne({'username': username.toLowerCase(), provider: 'local'}).exec();

    // make sure the user exists
    if (!user) throw new AuthenticationError(AuthenticationError.code.NOT_FOUND, { message: 'User not found'});

    // check if the account is currently locked
    if (user.isLocked) {
      // just increment login attempts if account is already locked
      yield user.incLoginAttempts();
      throw new AuthenticationError(AuthenticationError.code.MAX_ATTEMPTS, { message: `The maximum number of failed login attempts has been reached. Wait for ${LOCK_TIME/1000} sec`});
    }

    // test for a matching password
    if (yield user.comparePassword(password)) {
      // if there's no lock or failed attempts, just return the user
      if (!user.loginAttempts && !user.lockUntil) {
        return user;
      }
      // reset attempts and lock info
      return yield user.update({
        $set: { loginAttempts: 0 },
        $unset: { lockUntil: 1 }
      });

    }

    // password is incorrect, so increment login attempts before responding
    yield user.incLoginAttempts();
    throw new AuthenticationError(AuthenticationError.code.PASSWORD_INCORRECT, { message: 'Password does not match'});
  }

  // profile: Passport profile
  static *findOrCreate(profile) {
    let user = yield this.findOne({username: profile.id, provider: profile.provider}).exec();
    if(user) return user;
    user = new User( {
      username: profile.id,
      name: profile.displayName,
      provider: profile.provider,
      email: profile.emails[0].value,
      'roles': ['user']
    });
    user = yield user.save();
    return user;
  }

  static *byEmail(email) {
    let provider = 'local';
    return yield this.findOne({email, provider}).exec();
  }

  static *byUsername(username) {
    let provider = 'local';
    return yield this.findOne({username, provider}).exec();
  }

  *comparePassword(candidatePassword) {
    // User password is not set yet
    if (!this.hasPassword()) {
      return false;
    }
    return yield Bcrypt.compare(candidatePassword, this.password);
  }

}
