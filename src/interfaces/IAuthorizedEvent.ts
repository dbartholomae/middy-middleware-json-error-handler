/** An event that can be checked for authorization with middly-middleware-jwt-auth */
export type IAuthorizedEvent<TokenPayload = any> =
  | ILowerCaseAuthorizedEvent<TokenPayload>
  | IUpperCaseAuthorizedEvent<TokenPayload>

export interface IAuthorizedEventBase<TokenPayload = any> {
  /** Authorization information added by this middleware from a JWT. Has to be undefined before hitting the middleware. */
  auth?: {
    payload: TokenPayload
    token: string
  }
  /** An object containing event headers */
  headers: any
  /** The http request method of this event */
  httpMethod: string
}

/** An event with a lower case authorization header */
export interface ILowerCaseAuthorizedEvent<TokenPayload = any>
  extends IAuthorizedEventBase<TokenPayload> {
  headers: {
    /**
     * The authorization token to check. Can be a string or an array with exactly one string.
     * @example "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
     */
    authorization: string | string[]
  }
}

/** An event with an upper case authorization header */
export interface IUpperCaseAuthorizedEvent<TokenPayload = any>
  extends IAuthorizedEventBase<TokenPayload> {
  headers: {
    /**
     * The authorization token to check. Can be a string or an array with exactly one string.
     * @example "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
     */
    Authorization: string | string[]
  }
}

export function isAuthorizedEvent<P> (
  event: any,
  isTokenPayload?: (payload: any) => payload is P
): event is IAuthorizedEvent<P> {
  return (
    isUpperCaseAuthorizedEvent<P>(event, isTokenPayload) ||
    isLowerCaseAuthorizedEvent<P>(event, isTokenPayload)
  )
}

export function isAuthorizedEventBase<P> (
  event: any,
  isTokenPayload?: (payload: any) => payload is P
): event is IAuthorizedEventBase {
  return (
    event != null &&
    typeof event.httpMethod === 'string' &&
    event.headers != null &&
    (event.auth === undefined ||
      isTokenPayload == null ||
      (event.auth &&
        isTokenPayload(event.auth.payload) &&
        typeof event.auth.token === 'string'))
  )
}

export function isUpperCaseAuthorizedEvent<P> (
  event: any,
  isTokenPayload?: (payload: any) => payload is P
): event is IUpperCaseAuthorizedEvent<P> {
  return (
    isAuthorizedEventBase<P>(event, isTokenPayload) &&
    (typeof event.headers.Authorization === 'string' ||
      (Array.isArray(event.headers.Authorization) &&
        event.headers.Authorization.length === 1 &&
        event.headers.Authorization.every(
          (entry: any) => typeof entry === 'string'
        )))
  )
}

export function isLowerCaseAuthorizedEvent<P> (
  event: any,
  isTokenPayload?: (payload: any) => payload is P
): event is ILowerCaseAuthorizedEvent<P> {
  return (
    isAuthorizedEventBase<P>(event, isTokenPayload) &&
    (typeof event.headers.authorization === 'string' ||
      (Array.isArray(event.headers.authorization) &&
        event.headers.authorization.length === 1 &&
        event.headers.authorization.every(
          (entry: any) => typeof entry === 'string'
        )))
  )
}
