// Authorization middleware
import {AuthorizationError} from "../utils/errors"

/**
 * Roles Authorizations
 *  usage:
 *    isAdmin
 *    hasAnyRoles(['admin', 'user'])
 *    hasAllRoles(['admin', 'user'])
 */

export function *isAdmin(next) {
  if (!this.state.user.roles.includes('admin')) {
    throw new AuthorizationError(AuthorizationError.code.FORBIDDEN, {message: 'insufficient role (admin only)'});
  }
  yield next;
}

export function hasAnyRoles(roles: Array<string>) {
  return function *(next) {
    var tokenRoles = this.state.user.roles;
    if (roles.some( role => tokenRoles.includes(role) )) return yield next;
    throw new AuthorizationError(AuthorizationError.code.FORBIDDEN, {message: 'insufficient roles'});
  }
}

export function hasAllRoles(roles: Array<string>) {
  return function *(next) {
    var tokenRoles = this.state.user.roles;
    if (roles.every( role => tokenRoles.includes(role) )) return yield next;
    throw new AuthorizationError(AuthorizationError.code.FORBIDDEN, {message: 'insufficient roles'});
  }
}

/**
 * Scopes Authorizations
 * usage:
 *  hasAnyScopes(['read:users','create:users', 'delete:users', 'update:users'])
 *  hasAllScopes(['read:users', 'update:users'])
 */

export function hasAnyScopes(scopes: Array<string>) {
  return function *(next) {
    var tokenScopes = this.state.user.scopes;
    if (scopes.some( scope => tokenScopes.includes(scope) )) return yield next;
    throw new AuthorizationError(AuthorizationError.code.FORBIDDEN, {message: 'insufficient scopes'});
  }
}

export function hasAllScopes(scopes: Array<string>) {
  return function *(next) {
    var tokenScopes = this.state.user.scopes;
    if (scopes.every( scope => tokenScopes.includes(scope) )) return yield next;
    throw new AuthorizationError(AuthorizationError.code.FORBIDDEN, {message: 'insufficient scopes'});
  }
}


/**
 * ACL Authorizations
 * usage:
 *  isAdminOrSelf
 */

export function *isAdminOrSelf(next) {
  if (  this.state.user.roles.includes('admin') ||
        (this.state.dbuser && this.state.dbuser.email == this.state.user.sub)) {
    return yield next;
  }
  throw new AuthorizationError(AuthorizationError.code.FORBIDDEN, {message: 'admin or self can only call this API'});
}

