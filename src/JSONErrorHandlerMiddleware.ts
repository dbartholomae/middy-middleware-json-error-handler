/**
 * # JSON Error Handler Middleware
 */
/** An additional comment to make sure Typedoc attributes the comment above to the file itself */
import debugFactory, { IDebugger } from 'debug'

import {Context as LambdaContext} from 'aws-lambda/handler';
import { MiddlewareObj } from '@middy/core'
import { isErrorWithStatusCode } from './interfaces/IErrorWithStatusCode'
import { omit } from './helpers/omit'
import { serializeError } from 'serialize-error'

interface Request<TEvent = any, TResult = any, TErr = Error> {
  event: TEvent
  context: LambdaContext
  response: TResult | null
  error: TErr | null
  internal: {
    [key: string]: any
  }
}

export interface Options {
  errorPropertiesToOmit?: string[]
}

/** The actual middleware */
export class JSONErrorHandlerMiddleware
  implements MiddlewareObj {
  public static create (options?: Options): JSONErrorHandlerMiddleware {
    return new JSONErrorHandlerMiddleware(options)
  }

  /** The logger used in the module */
  private readonly logger: IDebugger

  /** The list of properties to omit from the error object */
  private readonly errorPropertiesToOmit: string[]

  /** Creates a new JSON error handler middleware */
  constructor ({ errorPropertiesToOmit = ['stack'] }: Options = {}) {
    this.logger = debugFactory('middy-middleware-json-error-handler')
    this.logger('Setting up JSONErrorHandlerMiddleware')
    this.errorPropertiesToOmit = errorPropertiesToOmit;
  }

  public onError = async (request: Request) => {
    const error = request.error
    if (isErrorWithStatusCode(error) && error.statusCode < 500) {
      this.logger(
        `Responding with full error as statusCode is ${error.statusCode}`
      )
      request.response = {
        body: JSON.stringify(omit(this.errorPropertiesToOmit, serializeError(error))),
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
