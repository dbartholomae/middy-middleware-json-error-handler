import { APIGatewayEvent } from 'aws-lambda'
import JSONErrorHandlerMiddleware from '../'
import createHttpError from 'http-errors'
import middy from '@middy/core'

// This is your AWS handler
async function helloWorld (event: APIGatewayEvent) {
  if (event.queryStringParameters?.search == null) {
    // If you throw an error with status code, the error will be returned as stringified JSON
    // Only the stack will be omitted.
    throw createHttpError(400, 'Query has to include a search')
  }

  if (event.queryStringParameters?.search === 'error') {
    // If you throw an error with status code greater than 500 and specify in options that the error
    // must be exposed, then the error will be returned as stringified JSON
    throw createHttpError(500, 'Something went wrong', { expose: true })
  }

  // If you throw an error with no status code, only a generic message will be shown to the user
  // instead of the full error
  throw new Error('Search is not implemented yet')
}

// Specify which are the error properties to omit in response (by default, only the stack is omitted)
const options = {
  errorPropertiesToOmit: ['name', 'statusCode', 'stack']
}

// Let's "middyfy" our handler, then we will be able to attach middlewares to it
export const handler = middy(helloWorld)
  .use(JSONErrorHandlerMiddleware(options)) // This middleware is needed do handle the errors thrown by the JWTAuthMiddleware
