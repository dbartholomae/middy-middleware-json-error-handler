# middy-middleware-json-error-handler
 [![npm version](https://badge.fury.io/js/middy-middleware-json-error-handler.svg)](https://npmjs.org/package/middy-middleware-json-error-handler)  [![downloads](https://img.shields.io/npm/dw/middy-middleware-json-error-handler.svg)](https://npmjs.org/package/middy-middleware-json-error-handler)  [![open issues](https://img.shields.io/github/issues-raw/dbartholomae/middy-middleware-json-error-handler.svg)](https://github.com/dbartholomae/middy-middleware-json-error-handler/issues)  [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdbartholomae%2Fmiddy-middleware-json-error-handler.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdbartholomae%2Fmiddy-middleware-json-error-handler?ref=badge_shield) [![debug](https://img.shields.io/badge/debug-blue.svg)](https://github.com/visionmedia/debug#readme)  [![build status](https://img.shields.io/circleci/project/github/dbartholomae/middy-middleware-jwt-auth/master.svg?style=flat)](https://circleci.com/gh/dbartholomae/workflows/middy-middleware-jwt-auth/tree/master)  [![codecov](https://codecov.io/gh/dbartholomae/middy-middleware-jwt-auth/branch/master/graph/badge.svg)](https://codecov.io/gh/dbartholomae/middy-middleware-jwt-auth)  [![dependency status](https://david-dm.org/dbartholomae/middy-middleware-jwt-auth.svg?theme=shields.io)](https://david-dm.org/dbartholomae/middy-middleware-jwt-auth)  [![devDependency status](https://david-dm.org/dbartholomae/middy-middleware-jwt-auth/dev-status.svg)](https://david-dm.org/dbartholomae/middy-middleware-jwt-auth?type=dev)  [![Greenkeeper](https://badges.greenkeeper.io/dbartholomae/middy-middleware-jwt-auth.svg)](https://greenkeeper.io/)  [![semantic release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release#badge)  [![Gitter](https://badges.gitter.im/dbartholomae/middy-middleware-jwt-auth.svg)](https://gitter.im/middy-middleware-jwt-auth)

A [middy](https://github.com/middyjs/middy) middleware that returns errors as http errors, compatible with [http-errors](https://www.npmjs.com/package/http-errors).

## Installation
Download node at [nodejs.org](http://nodejs.org) and install it, if you haven't already.

```sh
npm install middy-middleware-json-error-handler --save
```

## Documentation

There is [additional documentation](https://dbartholomae.github.com/middy-middleware-json-error-handler).

## Usage

```typescript
import createHttpError from 'http-errors'
import middy from 'middy'
import { httpErrorHandler, httpHeaderNormalizer } from 'middy/middlewares'
import JWTAuthMiddleware, { EncryptionAlgorithms, IAuthorizedEvent } from 'middy-middleware-jwt-auth'

// Optionally define the token payload you expect to receive
interface ITokenPayload {
  permissions: string[]
}

// Optionally define a type guard for the token payload
function isTokenPayload (token: any): token is ITokenPayload {
  return token != null &&
    Array.isArray(token.permissions) &&
    token.permissions.every((permission: any) => typeof permission === 'string')
}

// This is your AWS handler
const helloWorld = async (event: IAuthorizedEvent<ITokenPayload>) => {
  // The middleware adds auth information if a valid token was added
  // If no auth was found and credentialsRequired is set to true, a 401 will be thrown. If auth exists you
  // have to check that it has the expected form.
  if (event.auth!.payload.permissions.indexOf('helloWorld') === -1) {
    throw createHttpError(403, `User not authorized for helloWorld, only found permissions [${event.auth!.permissions.join(', ')}]`, {
      type: 'NotAuthorized'
    })
  }

  return {
    body: JSON.stringify({ data: `Hello world! Here's your token: ${event.auth!.token}` }),
    statusCode: 200
  }
}

// Let's "middyfy" our handler, then we will be able to attach middlewares to it
export const handler = middy(helloWorld)
  .use(httpHeaderNormalizer()) // Make sure authorization header is saved in lower case
  .use(httpErrorHandler()) // This middleware is needed do handle the errors thrown by the JWTAuthMiddleware
  .use(JWTAuthMiddleware({
    /** Algorithm to verify JSON web token signature */
    algorithm: EncryptionAlgorithms.HS256,
    /** An optional boolean that enables making authorization mandatory */
    credentialsRequired: true,
    /** An optional function that checks whether the token payload is formatted correctly */
    isPayload: isTokenPayload,
    /** A string or buffer containing either the secret for HMAC algorithms, or the PEM encoded public key for RSA and ECDSA */
    secretOrPublicKey: 'secret',
    /**
     * An optional function used to search for a token e. g. in a query string. By default, and as a fall back,
     * event.headers.authorization and event.headers.Authorization are used.
     */
    tokenSource: (event: any) => event.queryStringParameters.token
  }))
```
