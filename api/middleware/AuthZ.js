// authZ middleware
import {AuthorizationError} from "../utils/errors"

export default class AuthZ {

  // validate user added via JWT
  static *isAdmin(next) {
    //console.log(this.state.user);
    if (!this.state.user.roles.includes('admin')) {
      throw new AuthorizationError(AuthorizationError.code.FORBIDDEN, { message: 'you are not authorized for this API (admin only)'});
    }
    yield next;
  }

  static *isUser(next) {
    //console.log(this.state.user);
    if (!this.state.user.roles.includes('user')) {
      throw new AuthorizationError(AuthorizationError.code.FORBIDDEN, { message: 'you are not authorized for this API (user only)'});
    }
    yield next;
  }

}
