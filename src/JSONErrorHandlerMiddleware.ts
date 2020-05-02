/**
 * # JSON Error Handler Middleware
 */
/** An additional comment to make sure Typedoc attributes the comment above to the file itself */
import debugFactory, { IDebugger } from 'debug'
import middy from '@middy/core'
import { serializeError } from 'serialize-error'
import { omit } from './helpers/omit'
import { isErrorWithStatusCode } from './interfaces/IErrorWithStatusCode'

/** The actual middleware */
export class JSONErrorHandlerMiddleware
  implements middy.MiddlewareObject<any, any, any> {
  public static create (): JSONErrorHandlerMiddleware {
    return new JSONErrorHandlerMiddleware()
  }

  /** The logger used in the module */
  private readonly logger: IDebugger

  /** Creates a new JSON error handler middleware */
  constructor () {
    this.logger = debugFactory('middy-middleware-json-error-handler')
    this.logger('Setting up JSONErrorHandlerMiddleware')
  }

  public onError: middy.MiddlewareFunction<any, any> = async (
    handler: middy.HandlerLambda
  ) => {
    const error = handler.error
    if (isErrorWithStatusCode(error) && error.statusCode < 500) {
      this.logger(
        `Responding with full error as statusCode is ${error.statusCode}`
      )
      handler.response = {
        body: JSON.stringify(omit(['stack'], serializeError(error))),
        statusCode: error.statusCode
      }
      return
    }
    this.logger('Responding with internal server error')
    handler.response = {
      body: JSON.stringify({
        message: 'Internal server error',
        statusCode: 500
      }),
      statusCode: 500
    }
    return
  }
}

export default JSONErrorHandlerMiddleware.create
