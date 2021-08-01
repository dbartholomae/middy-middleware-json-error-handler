/**
 * # JSON Error Handler Middleware
 */
/** An additional comment to make sure Typedoc attributes the comment above to the file itself */
import debugFactory, { IDebugger } from 'debug'
import { MiddlewareObj } from '@middy/core'
import { serializeError } from 'serialize-error'
import { omit } from './helpers/omit'
import { isErrorWithStatusCode } from './interfaces/IErrorWithStatusCode'
import {Context as LambdaContext} from 'aws-lambda/handler';

interface Request<TEvent = any, TResult = any, TErr = Error> {
  event: TEvent
  context: LambdaContext
  response: TResult | null
  error: TErr | null
  internal: {
    [key: string]: any
  }
}

/** The actual middleware */
export class JSONErrorHandlerMiddleware
  implements MiddlewareObj {
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

  public onError = async (request: Request) => {
    const error = request.error
    if (isErrorWithStatusCode(error) && error.statusCode < 500) {
      this.logger(
        `Responding with full error as statusCode is ${error.statusCode}`
      )
      request.response = {
        body: JSON.stringify(omit(['stack'], serializeError(error))),
        statusCode: error.statusCode
      }
      return
    }
    this.logger('Responding with internal server error')
    request.response = {
      body: JSON.stringify({
        message: 'Internal server error',
        statusCode: 500
      }),
      statusCode: 500
    }
    return
  };
}

export default JSONErrorHandlerMiddleware.create
